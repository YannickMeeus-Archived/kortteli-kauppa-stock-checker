#[macro_use]
extern crate rocket;
extern crate dotenv;

mod infrastructure;

use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions, AllowedHeaders};
use rocket::{Build, Rocket};

use dotenv::dotenv;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

//noinspection RsMainFunctionNotFound
#[launch]
fn rocket() -> Rocket<Build> {

    dotenv().ok();

    use std::env;
    // This needs to change to be environment specific
    let match_against = ["^https://(.+).sillygoose.io$"];
    let allowed_origins = AllowedOrigins::some_regex(&match_against);

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

    rocket::build()
        .mount("/", routes![index, infrastructure::ping_handler, infrastructure::version_handler])
        .attach(cors)
}
