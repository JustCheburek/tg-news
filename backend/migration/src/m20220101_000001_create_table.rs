use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(SeenPosts::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SeenPosts::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(SeenPosts::Link).text().not_null())
                    .col(ColumnDef::new(SeenPosts::Title).text())
                    .col(ColumnDef::new(SeenPosts::Description).text())
                    .col(
                        ColumnDef::new(SeenPosts::CreatedAt)
                            .timestamp_with_time_zone()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(SeenPosts::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum SeenPosts {
    Table,
    Id,
    Link,
    Title,
    Description,
    CreatedAt,
}
