use rocket::{serde::json::{Value, json}};

#[get("/_ping")]
pub
fn ping() -> Value {
    json!({"data": "pong"})
}