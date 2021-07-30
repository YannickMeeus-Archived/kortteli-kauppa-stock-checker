
use diesel::{
    r2d2::Pool,
    pg::PgConnection,
    r2d2::ConnectionManager,
    r2d2::PoolError
};
use dotenv::dotenv;
use std::env;

pub type ConnectionPool = Pool<ConnectionManager<PgConnection>>;

fn init_pool(database_url: &str) -> Result<ConnectionPool, PoolError> {
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder().build(manager)
}
pub fn establish_connection() -> ConnectionPool {
    dotenv().ok();

    let database_url =
        env
            ::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");

    init_pool(&database_url)
        .unwrap_or_else(|_| {
            panic!("Error creating pool against '{}'", database_url);
        })
}