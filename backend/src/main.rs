#[macro_use]
extern crate rocket;
#[macro_use]
extern crate dotenv_codegen;
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

    let environment = dotenv!("ENVIRONMENT");

    let allowed_origins = match environment {
        "development" => AllowedOrigins::some_exact(&["http://localhost:3000"]),
        "production" => AllowedOrigins::some_regex(&["^https://(.+).sillygoose.io$"]),
        _ => panic!("ENVIRONMENT NEEDS TO BE SET")
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

    rocket::build()
        .mount("/", routes![index, infrastructure::ping_handler, infrastructure::version_handler])
        .attach(cors)
}
