/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
CREATE TABLE shops
(
    id         uuid         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name       VARCHAR      NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT now(),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT now(),
    UNIQUE (name)
);
`)};

exports.down = pgm => {
  pgm.sql(`
DROP TABLE IF EXISTS shops;
  `)
};
