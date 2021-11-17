/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    INSERT INTO shops (
      name
    ) VALUES
      ('Kuninkaantammi'),
      ('Katajanokka'),
      ('Olari'),
      ('Painiitty'),
      ('Talinranta'),
      ('Keimolanmaki')
  `)
};

exports.down = pgm => {
  pgm.sql(`
    TRUNCATE shops
  `)
};
