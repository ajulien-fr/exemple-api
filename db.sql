DROP DATABASE IF EXISTS db_api;
DROP USER IF EXISTS api;
DROP USER IF EXISTS api@localhost;

CREATE USER api@localhost IDENTIFIED BY 'insecure';
GRANT ALL PRIVILEGES ON db_api.* TO api@localhost;

