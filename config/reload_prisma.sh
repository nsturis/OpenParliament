echo "Dropping the oda database in postgres"
PGPASSWORD=root psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS oda;"

echo "Creating the oda database in postgres"
PGPASSWORD=root psql -h localhost -U postgres -c "CREATE DATABASE oda;"
PGPASSWORD=root psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE oda TO postgres;"

echo "Importing from oda_fresh"
PGPASSWORD=root psql -h localhost -U postgres oda < oda.sql

echo "Resolve the initial migration"
bunx prisma migrate resolve --applied 0_init 

echo "migrate the relations and other db schema changes"
bunx prisma migrate dev