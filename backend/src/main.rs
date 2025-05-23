mod db;
mod models;
mod server;

use crate::db::establish_connection;
use crate::server::run_server;
use crate::models::{Entity as SeenPosts, ActiveModel as SeenPostsActiveModel, Column};

use std::{collections::HashSet, error::Error, fs, time::Duration, sync::Arc};
use dotenv::dotenv;
use opml::{Outline, OPML};
use rand::prelude::*;
use reqwest;
use rss::Channel;
use teloxide::{prelude::*, types::ParseMode};
use tokio::time::sleep;
use chatgpt::{prelude::ChatGPT, types::CompletionResponse};
use sea_orm::{EntityTrait, QueryFilter, ColumnTrait, ActiveModelTrait, Set};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    let bot_token = std::env::var("TG_BOT_TOKEN")
        .expect("TG_BOT_TOKEN must be set.")
        .to_string();
    let channel_id: String = std::env::var("TG_CHAT_ID")
        .expect("TG_CHAT_ID must be set.")
        .to_string();
    let bot = Bot::new(bot_token);

    let db = Arc::new(establish_connection().await?);

    let opml_file_path = "feeds.opml";
    let rss_urls =
        load_rss_urls_from_opml(opml_file_path).expect("Failed to load RSS URLs from OPML");

    let _seen_urls: HashSet<String> = HashSet::new();

    let mut rng = StdRng::seed_from_u64(42);
    let db_clone = db.clone();
    let rss_task = tokio::spawn(async move {
        loop {
            if let Some(rss_feed_url) = rss_urls.choose(&mut rng) {
                if let Err(err) = fetch_and_send_rss_updates(&bot, channel_id.clone(), rss_feed_url, &db_clone)
                    .await
                {
                    eprintln!("Error fetching or sending updates: {:?}", err);
                }
            }
            sleep(Duration::from_secs(600)).await;
        }
    });

    let server_task = tokio::spawn(run_server(db));

    tokio::try_join!(rss_task, server_task)?;

    Ok(())
}

fn load_rss_urls_from_opml(opml_file_path: &str) -> Result<Vec<String>, Box<dyn Error>> {
    let opml_content = fs::read_to_string(opml_file_path)?;
    let opml = OPML::from_str(&opml_content)?;

    let mut rss_urls = Vec::new();
    extract_urls_from_outline(&opml.body.outlines, &mut rss_urls);

    println!("Your RSS URLs: {:#?}", rss_urls);
    Ok(rss_urls)
}

async fn chatgpt(url: String) -> Result<String, Box<dyn std::error::Error>> {
    let key = std::env::var("OPENAI")?;
    let client = ChatGPT::new(key)?;

    let response: CompletionResponse = client
        .send_message(format!("дай описание этой новости в пределах 400 символов: {}", url))
        .await?;

    println!("Response: {}", &response.message().content);

    Ok(response.message().content.clone())
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

async fn insert_seen_post(db: &sea_orm::DatabaseConnection, link: &str, title: &str, description: &str) -> Result<(), sea_orm::DbErr> {
    let post = SeenPostsActiveModel {
        link: Set(link.to_string()),
        title: Set(Some(title.to_string())),
        description: Set(Some(description.to_string())),
        ..Default::default()
    };
    post.insert(db).await?;
    Ok(())
}

async fn fetch_and_send_rss_updates(
    bot: &Bot,
    channel_id: String,
    rss_feed_url: &str,
    db: &sea_orm::DatabaseConnection,
) -> Result<(), Box<dyn std::error::Error>> {
    let content = reqwest::get(rss_feed_url).await?.bytes().await?;
    let channel = Channel::read_from(&content[..])?;

    for item in channel.items() {
        if let Some(item_link) = item.link() {
            let exists = SeenPosts::find()
                .filter(Column::Link.eq(item_link))
                .one(db)
                .await?;

            if exists.is_none() {
                let link1 = item_link.to_string();
                let title = item.title().unwrap_or("No Title").to_string();
                let caption = "<a href=\"https://t.me/Tech_Chronicle/\">Tech Chronicle</a>";
                let _content: Option<&str> = item.content();
                let description = chatgpt(link1.clone()).await?;

                insert_seen_post(db, &link1, &title, &description).await?;

                bot.send_message(
                    channel_id.clone(),
                    format!(
                        "<b># {}</b> | <a href=\"{}\">источник</a>\n\n{}\n\n{}",
                        title, link1, description, caption,
                    ),
                )
                .parse_mode(ParseMode::Html)
                .send()
                .await?;

                sleep(Duration::from_secs(900)).await;

                break;
            }
        }
    }

    Ok(())
}
