
use dotenv::dotenv;
use std::env;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Postgres, Pool};

pub type ConnectionPool = Pool<Postgres>;

pub async fn establish_connection() -> Result<ConnectionPool, String> {
    dotenv().ok();

    let database_url =
        env
            ::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");

    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url.as_str()).await.map_err(|e| e.to_string())
}