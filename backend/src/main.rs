#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate dotenv_codegen;
extern crate dotenv;

mod infrastructure;
mod database;
mod schema;
mod shops;

use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions, AllowedHeaders};
use rocket::{Build, Rocket};
use std::sync::Arc;

use dotenv::dotenv;
use crate::database::establish_connection;
use crate::shops::{GetAllShops, CreateNewShop};
use crate::shops::{handle_get_all_shops, handle_create_new_shop};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

embed_migrations!();

#[launch]
fn rocket() -> Rocket<Build> {

    dotenv().ok();

    let environment = dotenv!("ENVIRONMENT");
    let connection_pool = establish_connection();

    embedded_migrations
        ::run_with_output(&connection_pool.get().unwrap(), &mut std::io::stdout())
        .expect("Migrations could not be run");

    let allowed_origins = match environment {
        "development" => AllowedOrigins::some_exact(&["http://localhost:3000"]),
        "production" => AllowedOrigins::some_regex(&["^https://(.+).sillygoose.io$"]),
        _ => panic!("ENVIRONMENT environment variable needs to be one of ['development', 'production'")
    };

    // You can also deserialize this
    let cors = CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        ..Default::default()
    }
        .to_cors()
        .expect("error creating CORS fairing");

    let connection_pool_ref = Arc::new(connection_pool);
    let get_all_shops = GetAllShops::new(connection_pool_ref.clone());
    let create_new_shop = CreateNewShop::new(connection_pool_ref.clone());
    rocket::build()
        .manage(get_all_shops)
        .manage(create_new_shop)
        .mount(
            "/",
            routes![
                index,
                infrastructure::ping_handler,
                infrastructure::version_handler,
                handle_get_all_shops,
                handle_create_new_shop,
            ]
        )
        .attach(cors)
}
