#[macro_use]
extern crate rocket;

mod infrastructure;

use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions, AllowedHeaders};

use rocket::{Build, Rocket};



//noinspection RsMainFunctionNotFound
#[launch]
fn rocket() -> Rocket<Build> {
    // This needs to change to be environment specific
    let allowed_origins = AllowedOrigins::All;

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
        .mount("/", routes![infrastructure::ping_handler, infrastructure::version_handler])
        .attach(cors)
}
