use uuid::Uuid;
use std::sync::Arc;

use rocket::{
    serde::json::{Value, Json},
    State,
    serde::json::json,
    serde::Serialize,
    serde::Deserialize,
    response::status::BadRequest
};
use crate::database::ConnectionPool;
// Model

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Shop {
    pub key: Uuid,
    pub name: String
}
// Queries

//region GetAllShops
pub struct GetAllShops{
    connection_pool: Arc<ConnectionPool>
}

impl GetAllShops {
    pub fn new(connection_pool: Arc<ConnectionPool>) -> GetAllShops {
        GetAllShops { connection_pool }
    }

    pub async fn get(&self) -> Vec<Shop> {
        let results = sqlx::query_as( "SELECT key, name FROM shops").fetch_all(&*self.connection_pool).await;

        match results {
            Ok(shops) => shops,
            Err(e) => {
                println!("{}", e.to_string());
                Vec::new()
            }
        }
    }
}
//endregion

// Commands

//region CreateNewShop

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateShopCommand {
    pub name: String
}

pub struct CreateNewShop {
    connection_pool:  Arc<ConnectionPool>
}

impl CreateNewShop {

    pub fn new(connection_pool: Arc<ConnectionPool>) -> CreateNewShop {
        CreateNewShop { connection_pool }
    }

    pub async fn execute(&self, to_create: CreateShopCommand) -> Result<Shop, String> {
        let inserted_shop = sqlx::query_as(r#"
            INSERT INTO shops
                (
                    name
                )
                VALUES
                (
                    $1
                )
                RETURNING key, name
        "#)
            .bind(to_create.name)
            .fetch_one(&*self.connection_pool)
            .await;
        match inserted_shop {
            Ok(shop) => Ok(shop),
            Err(e) => Err(e.to_string()),
        }
    }
}
//endregion

// Api

#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorMessage {
    error: String,
}

impl ErrorMessage {
    pub fn as_bad_request(message: String) -> BadRequest<Json<ErrorMessage>> {
        BadRequest(Some(Json(ErrorMessage{ error: message })))
    }
}
#[get("/shops")]
pub async fn handle_get_all_shops(c: &State<GetAllShops>) -> Value {
    let retrieved_shops = c.get().await;
    json!({"shops": retrieved_shops})
}

type CreateNewShopResponse = Result<Json<Shop>, BadRequest<Json<ErrorMessage>>>;
#[post("/shops", format = "json", data = "<shop>")]
pub async fn handle_create_new_shop(shop: Json<CreateShopCommand>, c: &State<CreateNewShop>) -> CreateNewShopResponse {
    let possibly_created = c.execute( shop.into_inner()).await;
    let response = match possibly_created {
        Ok(c) => Ok(Json(c)),
        Err(message) => Err(ErrorMessage::as_bad_request(message))
    };
    response
}

