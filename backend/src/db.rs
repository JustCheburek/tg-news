use sea_orm::{Database, DatabaseConnection};
use std::env;

pub async fn establish_connection() -> Result<DatabaseConnection, sea_orm::DbErr> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");
    let db = Database::connect(&database_url).await?;
    Ok(db)
}
