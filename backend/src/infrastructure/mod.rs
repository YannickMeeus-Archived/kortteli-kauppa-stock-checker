pub mod ping;
pub mod version;

pub use self::ping::ping as ping_handler;
pub use self::version::version as version_handler;