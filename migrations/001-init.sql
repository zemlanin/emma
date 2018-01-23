-- Up
CREATE TABLE machines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blueprint TEXT NOT NULL,
  cursor TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  waits_for TIMESTAMP,
  finished BOOLEAN NOT NULL DEFAULT f,
  data JSON,
  error TEXT
);

INSERT INTO machines (blueprint, cursor, data) VALUES ('cart', 'start', '{"user_id": 123}');

-- Down
DROP TABLE machines;
