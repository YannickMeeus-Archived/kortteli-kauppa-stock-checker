/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
CREATE TRIGGER set_updated_on_shops
  BEFORE
      UPDATE ON shops
  FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();
  `)
};

exports.down = pgm => {
  pgm.sql(`DROP TRIGGER set_updated_on_shops ON shops;`)
};
