CREATE TABLE shops (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    key TEXT NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

CREATE UNIQUE INDEX ix_shops_key on shops (key);