use uuid::Uuid;
use std::sync::Arc;
use crate::database::ConnectionPool;
use rocket::State;
use rocket::serde::json::{Value, Json};
use rocket::serde::json::json;
use rocket::serde::Serialize;
use rocket::serde::Deserialize;

// Model

#[derive(Serialize, Deserialize, Debug)]
pub struct Shop {
    pub key: Uuid,
    pub name: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateShopCommand {
    pub name: String
}

// Queries

//region GetAllShops
pub struct GetAllShops{
    _connection: Arc<ConnectionPool>
}

impl GetAllShops {
    pub fn new(connection: Arc<ConnectionPool>) -> GetAllShops {
        GetAllShops { _connection: connection }
    }

    pub fn get(&self) -> Vec<Shop> {
        let mut shops = Vec::new();
        shops.push (Shop {
            key: Uuid::new_v4(),
            name: "mock name".to_string()
        });
        shops
    }
}
//endregion

// Commands

pub struct CreateNewShop {
    _connection:  Arc<ConnectionPool>
}

impl CreateNewShop {

    pub fn new(connection: Arc<ConnectionPool>) -> CreateNewShop {
        CreateNewShop { _connection: connection }
    }

    pub fn execute(&self, to_create: CreateShopCommand) -> Result<Shop, &'static str> {
        let _connection = self._connection.get().expect("Connection to be acquired");

        Ok(Shop {key: Uuid::new_v4(), name: to_create.name})
    }
}

// Api
#[get("/shops")]
pub fn handle_get_all_shops(c: &State<GetAllShops>) -> Value {
    let shops = c.get();
    json!({"shops": shops})
}

#[post("/shops", format = "json", data = "<shop>")]
pub fn handle_create_new_shop(shop: Json<CreateShopCommand>, c: &State<CreateNewShop>) -> Value {
    let created = c.execute( shop.into_inner()).unwrap();
    json!(created)
}