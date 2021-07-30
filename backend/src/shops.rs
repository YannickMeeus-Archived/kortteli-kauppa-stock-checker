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
use crate::schema::shops;
use crate::database::ConnectionPool;
use crate::diesel::prelude::*;
// Model

#[derive(Serialize, Deserialize, Debug, Queryable)]
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

    pub fn get(&self) -> Vec<Shop> {
        use crate::schema::shops::dsl::*;
        let connection = self.connection_pool.get().expect("Connection to be acquired");
        let shops_found = shops
            .select((key, name))
            .load::<Shop>(&connection)
            .unwrap();

        shops_found
    }
}
//endregion

// Commands

//region CreateNewShop

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateShopCommand {
    pub name: String
}

#[derive(Insertable)]
#[table_name="shops"]
pub struct NewShop<'a> {
    pub name: &'a str
}

pub struct CreateNewShop {
    connection_pool:  Arc<ConnectionPool>
}

impl CreateNewShop {

    pub fn new(connection_pool: Arc<ConnectionPool>) -> CreateNewShop {
        CreateNewShop { connection_pool }
    }

    pub fn execute(&self, to_create: CreateShopCommand) -> Result<Shop, String> {
        use crate::schema::shops::dsl::*;
        let _connection = self.connection_pool.get().expect("Connection to be acquired");
        let new_shop = NewShop {name: to_create.name.as_str()};

        let created  =  diesel::insert_into(shops)
            .values(&new_shop)
            .returning((key, name))
            .get_result(&_connection);

        // TODO: Map this to a better error - use https://crates.io/crates/http-api-problem
        created.map_err(|e| e.to_string())
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
pub fn handle_get_all_shops(c: &State<GetAllShops>) -> Value {
    let retrieved_shops = c.get();
    json!({"shops": retrieved_shops})
}

type CreateNewShopResponse = Result<Json<Shop>, BadRequest<Json<ErrorMessage>>>;
#[post("/shops", format = "json", data = "<shop>")]
pub fn handle_create_new_shop(shop: Json<CreateShopCommand>, c: &State<CreateNewShop>) -> CreateNewShopResponse {
    let possibly_created = c.execute( shop.into_inner());
    let response = match possibly_created {
        Ok(c) => Ok(Json(c)),
        Err(message) => Err(ErrorMessage::as_bad_request(message))
    };
    response
}

