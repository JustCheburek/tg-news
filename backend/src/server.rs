use actix_web::{get, web, App, HttpServer, HttpResponse, Responder};
use serde::Deserialize;
use sea_orm::{DatabaseConnection, EntityTrait, QueryOrder, PaginatorTrait};
use std::sync::Arc;
use chrono::{DateTime, Utc};

#[derive(serde::Serialize)]
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

#[get("/posts")]
async fn get_all_posts(
    db: web::Data<Arc<DatabaseConnection>>,
    query: web::Query<Pagination>,
) -> impl Responder {
    let page = query.page.unwrap_or(1).max(1) as u64;
    let per_page = query.per_page.unwrap_or(10).clamp(1, 100) as u64;

    match crate::models::Entity::find()
        .order_by_desc(crate::models::Column::CreatedAt)
        .paginate(&*db, per_page) // FIXME: Problematic place
        .fetch_page(page - 1)
        .await
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
            eprintln!("Error fetching posts: {:?}", e);
            HttpResponse::InternalServerError().json("Failed to fetch posts")
        }
    }
}

pub async fn run_server(db: Arc<DatabaseConnection>) -> std::io::Result<()> {
    let server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .service(get_all_posts)
    })
    .bind("127.0.0.1:8080")?
    .run();

    server.await
}
