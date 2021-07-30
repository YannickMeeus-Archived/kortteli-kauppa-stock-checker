use uuid::Uuid;
use std::sync::Arc;
use crate::database::ConnectionPool;
use rocket::State;
use rocket::serde::json::{Value, Json};
use rocket::serde::json::json;
use rocket::serde::Serialize;
use rocket::serde::Deserialize;
use crate::diesel::RunQueryDsl;
use crate::schema::shops;
use rocket::response::status::BadRequest;
// Model

#[derive(Serialize, Deserialize, Debug, Queryable)]
pub struct Shop {
    pub key: Uuid,
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
        let mut shops_to_return = Vec::new();
        shops_to_return.push (Shop {
            key: Uuid::new_v4(),
            name: "mock name".to_string()
        });
        shops_to_return
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
    _connection:  Arc<ConnectionPool>
}

impl CreateNewShop {

    pub fn new(connection: Arc<ConnectionPool>) -> CreateNewShop {
        CreateNewShop { _connection: connection }
    }

    pub fn execute(&self, to_create: CreateShopCommand) -> Result<Shop, String> {
            use crate::schema::shops as schema;
        let _connection = self._connection.get().expect("Connection to be acquired");
        let new_shop = NewShop {name: to_create.name.as_str()};

        let created  = diesel::insert_into(crate::schema::shops::table)
            .values(&new_shop)
            .returning((schema::key, schema::name))
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