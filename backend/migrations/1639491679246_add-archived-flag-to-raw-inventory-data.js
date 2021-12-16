/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE raw_inventory_data
      ADD COLUMN archived BOOLEAN NOT NULL DEFAULT FALSE
    `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE raw_inventory_data
      DROP COLUMN archived
    `)
};
