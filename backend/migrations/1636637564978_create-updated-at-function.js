/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
CREATE FUNCTION trigger_set_updated_at_timestamp()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`);
};

exports.down = pgm => {
  pgm.sql(`DROP FUNCTION trigger_set_updated_at_timestamp();`);
};
