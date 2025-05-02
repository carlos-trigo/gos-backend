-- SELECT version();
-- CREATE skater TABLE
CREATE TABLE IF NOT EXISTS skater(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" VARCHAR(32) NOT NULL UNIQUE CHECK (length(name) >= 3),
  email VARCHAR(256) NOT NULL UNIQUE,
  picture VARCHAR(1024),
  email_verified BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, NOW()) NOT NULL,
);

-- INSERT skater
INSERT INTO skater(
	name, email, picture, email_verified)
	VALUES ('NAME', 'name@gmail.com', 'TEST', TRUE);

-- CREATE skater_connection TABLE
CREATE TABLE IF NOT EXISTS skater_connection (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  skater_a uuid REFERENCES skater (id),
  skater_b uuid REFERENCES skater (id),
  requested_by uuid REFERENCES skater (id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, NOW()) NOT NULL,
  type VARCHAR(16) NOT NULL,
  approved boolean DEFAULT false NOT NULL,
  approved_at timestamp,
  rejected boolean DEFAULT false NOT NULL,
  rejected_at timestamp
);

CREATE TYPE connection_type AS ENUM ('friend', 'block', 'archnemesis');

-- INSERT -- INSERT skater
INSERT INTO skater_connection(
	skater_a, skater_a, connection_type, requested_by, approved)
	VALUES ('NAME', 'name@gmail.com', 'TEST', TRUE);
