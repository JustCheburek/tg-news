mod db;
mod models;

use actix_web::{get, web, App, HttpServer, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sea_orm::{DatabaseConnection, EntityTrait, QueryOrder, ActiveModelTrait, Set, ColumnTrait, QueryFilter};
use std::{error::Error, fs, sync::Arc, time::Duration};
use dotenv::dotenv;
use env_logger;
use opml::{OPML, Outline};
use rand::prelude::*;
use reqwest;
use chrono::{DateTime, Utc};
use chatgpt::{prelude::ChatGPT, types::CompletionResponse};
use tokio::time::sleep;
use log::{error, info};

// Struct to hold application state
#[derive(Clone)]
struct AppState {
    db: Arc<DatabaseConnection>,
}

#[derive(Serialize)]
struct Post {
    id: i32,
    link: String,
    title: Option<String>,
    description: Option<String>,
    created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
struct Pagination {
    page: Option<i32>,
    per_page: Option<i32>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    env_logger::init();

    // Create the database connection and wrap it in AppState
    let db = Arc::new(db::establish_connection().await?);
    let app_state = AppState { db };

    let opml_file_path = "feeds.opml";
    let rss_urls = load_rss_urls_from_opml(opml_file_path)?;

    let mut rng = StdRng::seed_from_u64(42);
    let db_clone = app_state.db.clone();
    let rss_task = tokio::spawn(async move {
        loop {
            if let Some(rss_feed_url) = rss_urls.choose(&mut rng) {
                if let Err(err) = fetch_and_store_rss_updates(rss_feed_url, &db_clone).await {
                    error!("Error fetching or storing updates: {:?}", err);
                }
            }
            sleep(Duration::from_secs(600)).await;
        }
    });

    let server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone())) // Store AppState in app state
            .service(get_all_posts)
    })
				.bind("127.0.0.1:8081")?
				.run();

    let server_task = tokio::spawn(server);

    // Run both tasks and handle server result only
    let (_, server_result) = tokio::try_join!(rss_task, server_task)?;
    server_result?;

    Ok(())
}

fn load_rss_urls_from_opml(opml_file_path: &str) -> Result<Vec<String>, Box<dyn Error>> {
    let opml_content = fs::read_to_string(opml_file_path)?;
    let opml = OPML::from_str(&opml_content)?;
    let mut rss_urls = Vec::new();
    extract_urls_from_outline(&opml.body.outlines, &mut rss_urls);
    info!("Loaded RSS URLs: {:?}", rss_urls);
    Ok(rss_urls)
}

fn extract_urls_from_outline(outlines: &[Outline], rss_urls: &mut Vec<String>) {
    for outline in outlines {
        if let Some(xml_url) = &outline.xml_url {
            rss_urls.push(xml_url.clone());
        }
        if !outline.outlines.is_empty() {
            extract_urls_from_outline(&outline.outlines, rss_urls);
        }
    }
}

// async fn chatgpt(url: String) -> Result<String, Box<dyn std::error::Error>> {
//     let key = std::env::var("OPENAI").map_err(|_| "OPENAI environment variable not set")?;
//     let prompt_template = std::env::var("CHATGPT_PROMPT")
//         .unwrap_or("дай описание этой новости в пределах 400 символов: {}".to_string());
//     let client = ChatGPT::new(key)?;
		
//     let response: CompletionResponse = client
//         .send_message(format!("{}", prompt_template.replace("{}", &url)))
//         .await?;
//     info!("ChatGPT response for URL {}: {}", url, &response.message().content);
//     Ok(response.message().content.clone())
// }

async fn insert_seen_post(db: &DatabaseConnection, link: &str, title: &str, description: &str) -> Result<(), sea_orm::DbErr> {
    let post = models::ActiveModel {
        link: Set(link.to_string()),
        title: Set(Some(title.to_string())),
        description: Set(Some(description.to_string())),
        ..Default::default()
    };
    post.insert(db).await?;
    Ok(())
}

async fn fetch_and_store_rss_updates(
    rss_feed_url: &str,
    db: &DatabaseConnection,
) -> Result<(), Box<dyn std::error::Error>> {
    let content = reqwest::get(rss_feed_url).await?.bytes().await?;
    let channel = rss::Channel::read_from(&content[..])?;

    for item in channel.items() {
        if let Some(item_link) = item.link() {
            let exists = models::Entity::find()
                .filter(models::Column::Link.eq(item_link))
                .one(db)
                .await?;

            if exists.is_none() {
                let link = item_link.to_string();
                let title = item.title().unwrap_or("No Title").to_string();
                // let description = chatgpt(link.clone()).await?;
								let description = format!("{}", link.clone());
                insert_seen_post(db, &link, &title, &description).await?;
                sleep(Duration::from_secs(30)).await;
            }
        }
    }
    Ok(())
}

#[get("/posts")]
async fn get_all_posts(
    state: web::Data<AppState>,
    _query: web::Query<Pagination>,
) -> impl Responder {
    match models::Entity::find()
        .order_by_desc(models::Column::CreatedAt)
        .all(state.db.as_ref())
        .await
    {
        Ok(posts) => {
            let formatted_posts: Vec<Post> = posts.into_iter().map(|post| Post {
                id: post.id,
                link: post.link,
                title: post.title,
                description: post.description,
                created_at: post.created_at,
            }).collect();
            HttpResponse::Ok().json(formatted_posts)
        }
        Err(e) => {
            error!("Error fetching posts: {:?}", e);
            HttpResponse::InternalServerError().json("Failed to fetch posts")
        }
    }
}
