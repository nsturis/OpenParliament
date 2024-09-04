#!/bin/zsh

rm -rf prisma

bunx prisma init

echo "Dropping the oda database in postgres"
PGPASSWORD=root psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS oda;"

echo "Creating the oda database in postgres"
PGPASSWORD=root psql -h localhost -U postgres -c "CREATE DATABASE oda;"
PGPASSWORD=root psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE oda TO postgres;"

echo "Importing from oda_fresh"
PGPASSWORD=root psql -h localhost -U postgres oda < oda.sql

echo "Pulling the database with prisma"
bunx prisma db pull

echo "Generating the artifacts"
bunx prisma generate

echo "Creating an empty directory for the initial migration"
mkdir -p prisma/migrations/0_init

echo "Generating the initial migration"
bunx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql

bunx prisma migrate resolve --applied 0_init 

python3 config/schema_relations.py

bunx prisma migrate dev --create-only --name "added_relations"

echo "Appending relations.sql to the migration.sql"
# cat prisma/migrations/0_init/relations.sql >> prisma/migrations/0_init/migration.sql
