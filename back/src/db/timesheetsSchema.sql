CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username char(32) NOT NULL UNIQUE,
  pw char(60) NOT NULL
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name text NOT NULL UNIQUE,
  created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  display boolean DEFAULT true
);

CREATE TABLE timers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  start_time timestamp with time zone NOT NULL UNIQUE DEFAULT CURRENT_TIMESTAMP,
  end_time timestamp with time zone,
  exported boolean DEFAULT false
);
