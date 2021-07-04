use rocket::{serde::json::{Value, json}};

#[get("/_version")]
pub fn version() -> Value {
    const VERSION: &'static str = env!("CARGO_PKG_VERSION");
    json!({"data": VERSION})
}