/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
 pgm.sql( `
  INSERT INTO
      shops (
          name
      )
  VALUES (
    'Kalliolahde'
  )
 `)
};

exports.down = pgm => {
  pgm.sql( `
    DELETE FROM
        shops
    WHERE
        name = 'Kalliolahde'
  `)
};
