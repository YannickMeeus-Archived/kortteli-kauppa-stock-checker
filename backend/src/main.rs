#[macro_use]
extern crate rocket;

use rocket::{Build, Rocket, serde::json::{Value, json}};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/_ping")]
fn ping() -> Value {
    json!({"data": "pong"})
}
//noinspection RsMainFunctionNotFound
#[launch]
fn rocket() -> Rocket<Build> {
    rocket::build().mount("/", routes![index, ping])
}
