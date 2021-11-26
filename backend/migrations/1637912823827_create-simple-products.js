/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE simple_products
  (
      id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      ean        TEXT         NOT NULL,
      quantity   INT          NOT NULL,
      shop_id    UUID         NOT NULL,
      name       TEXT         NOT NULL,
      cabinet    TEXT         NOT NULL,
      created_at TIMESTAMP(6) NOT NULL DEFAULT now(),
      updated_at TIMESTAMP(6) NOT NULL DEFAULT now(),
      UNIQUE (ean, shop_id),
      CONSTRAINT fk_shops FOREIGN KEY (shop_id) REFERENCES shops (id)
  );
  `)

  pgm.sql(`
    CREATE TRIGGER set_updated_on_simple_products
      BEFORE
          UPDATE ON simple_products
      FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_updated_at_timestamp();
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS simple_products;
  `)
};
