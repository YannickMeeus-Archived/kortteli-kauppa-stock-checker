/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE simple_products
    RENAME COLUMN ean TO epc;
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE simple_products
    RENAME COLUMN epc TO ean;`)
};
