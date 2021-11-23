/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE raw_inventory_data
(
    id         uuid DEFAULT gen_random_uuid() NOT NULL CONSTRAINT ingested_product_informations_pkey  PRIMARY KEY,
    shop       uuid,
    raw_data   jsonb,
    created_at TIMESTAMP(6)                   NOT NULL DEFAULT now(),
    updated_at TIMESTAMP(6)                   NOT NULL DEFAULT now()
);
  `);
  pgm.sql(`
CREATE TRIGGER set_updated_on_raw_inventory_data
  BEFORE
      UPDATE ON raw_inventory_data
  FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();
  `)
};

exports.down = pgm => {
  pgm.sql(`DROP TRIGGER set_updated_on_raw_inventory_data ON raw_inventory_data;`)
  pgm.sql(`
    DROP TABLE IF EXISTS raw_inventory_data;
  `)
};
