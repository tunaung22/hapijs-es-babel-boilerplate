### Place .env file in the project root


``` conf
### DOTENV CONFIG ###
# DEVELOPMENT
# node
NODE_ENV=development
NODE_HOST=localhost
NODE_PORT=3030

# database settings
PG_DB_HOST=localhost
PG_DB_PORT=5432
PG_DB_NAME=dev
PG_DB_USERNAME=my_db
PG_DB_PASSWORD=null
PG_DB_POOL_MIN=2
PG_DB_POOL_MAX=10
# knex
KNEX_MIGRATION_TABLE=knex_migrations
DB_PAGINATION=10

# HAPIJS PLUGIN
APP_COOKIE_NAME=my-app-cookie
APP_COOKIE_PASSWORD=!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6

# COOKIE day*hours*mins*secs
COOKIE_TTL=604800

# Notes
# require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); });
# SECRET_STRING=place-super-secure-long-secret-string-here
```