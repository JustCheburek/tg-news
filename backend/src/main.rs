mod db;
mod models;

use actix_web::{get, web, App, HttpServer, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sea_orm::{DatabaseConnection, EntityTrait, QueryOrder, PaginatorTrait, ActiveModelTrait, Set, ColumnTrait, QueryFilter};
use std::{error::Error, fs, sync::Arc, time::Duration};
use dotenv::dotenv;
use opml::{OPML, Outline};
use rand::prelude::*;
use reqwest;
use chrono::{DateTime, Utc};
use chatgpt::{prelude::ChatGPT, types::CompletionResponse};
use tokio::time::sleep;

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

    let db = Arc::new(db::establish_connection().await?);
    let opml_file_path = "feeds.opml";
    let rss_urls = load_rss_urls_from_opml(opml_file_path).expect("Failed to load RSS URLs from OPML");

    let mut rng = StdRng::seed_from_u64(42);
    let db_clone = db.clone();
    let rss_task = tokio::spawn(async move {
        loop {
            if let Some(rss_feed_url) = rss_urls.choose(&mut rng) {
                if let Err(err) = fetch_and_store_rss_updates(rss_feed_url, &db_clone).await {
										// FIXME: replace println! with logging library
                    eprintln!("Error fetching or storing updates: {:?}", err);
                }
            }
            sleep(Duration::from_secs(600)).await;
        }
    });

    let server_task = tokio::spawn(async move {
        HttpServer::new(move || {
            App::new()
                .app_data(web::Data::new(db.clone()))
                .service(get_all_posts)
        })
        .bind("127.0.0.1:8080")?
        .run()
        .await
    });

    tokio::try_join!(rss_task, server_task.unwrap())?;
    Ok(())
}

fn load_rss_urls_from_opml(opml_file_path: &str) -> Result<Vec<String>, Box<dyn Error>> {
    let opml_content = fs::read_to_string(opml_file_path)?;
    let opml = OPML::from_str(&opml_content)?;
    let mut rss_urls = Vec::new();
    extract_urls_from_outline(&opml.body.outlines, &mut rss_urls);

		// FIXME: replace println! with logging library
		println!("Your RSS URLs: {:#?}", rss_urls);

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

async fn chatgpt(url: String) -> Result<String, Box<dyn std::error::Error>> {
    let key = std::env::var("OPENAI")?;
    let client = ChatGPT::new(key)?;
		// TODO: Add catching prompt from .env
		// Something like format!({}, {}) and then response.send_message(prompt)
		let _prompt; 
		
    let response: CompletionResponse = client
        .send_message(format!("дай описание этой новости в пределах 400 символов: {}", url))
        .await?;

		// FIXME: replace println! with logging library
		println!("Response: {}", &response.message().content);
    Ok(response.message().content.clone())
}

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
                let description = chatgpt(link.clone()).await?;
                insert_seen_post(db, &link, &title, &description).await?;
                sleep(Duration::from_secs(900)).await;
                break;
            }
        }
    }
    Ok(())
}

#[get("/posts")]
async fn get_all_posts(
    db: web::Data<Arc<DatabaseConnection>>,
    query: web::Query<Pagination>,
) -> impl Responder {
    let page = query.page.unwrap_or(1).max(1) as u64;
    let per_page = query.per_page.unwrap_or(10).clamp(1, 100) as u64;

    match models::Entity::find()
        .order_by_desc(models::Column::CreatedAt)
        // .paginate(&*db, per_page)
        // .fetch_page(page - 1)
        // .await
    {
        Ok(posts) => {
            let formatted_posts: Vec<String> = posts.into_iter().map(|post| {
                let title = post.title.unwrap_or_else(|| "No Title".to_string());
                let description = post.description.unwrap_or_else(|| "No description available".to_string());
                let caption = "<a href=\"https://t.me/Tech_Chronicle/\">Tech Chronicle</a>";
                format!(
                    "<b># {}</b> | <a href=\"{}\">источник</a>\n\n{}\n\n{}",
                    title, post.link, description, caption
                )
            }).collect();
            HttpResponse::Ok().json(formatted_posts)
        }
        Err(e) => {
						// FIXME: replace println! with logging library
						eprintln!("Error fetching posts: {:?}", e);
            HttpResponse::InternalServerError().json("Failed to fetch posts")
        }
    }
}
