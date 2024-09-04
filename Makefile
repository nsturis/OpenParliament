.PHONY: oda_create oda_migrate prisma

oda_download:
	@echo "Downloading .bak file..."
	@python3 config/download_oda_bak.py
	@echo "Creating MSSQL docker database..."

oda_migrate:
	@echo "Migrating Oda database..."
	@docker compose up -d MSSQLDB
	@docker exec -it MSSQLDB /opt/mssql-tools18/bin/sqlcmd -S localhost -U ${MS_DB_USER} -P ${MS_DB_PASSWORD} -C -Q 'RESTORE FILELISTONLY FROM DISK = "/var/opt/mssql/backup/oda.bak"' \
   | tr -s ' ' | cut -d ' ' -f 1-2
	@docker exec -it MSSQLDB /opt/mssql-tools18/bin/sqlcmd -S localhost -U ${MS_DB_USER} -P ${MS_DB_PASSWORD} -C -Q 'RESTORE DATABASE ODA FROM DISK = "/var/opt/mssql/backup/oda.bak" WITH MOVE "ODA" TO "/var/opt/mssql/data/ODA.mdf", MOVE "ODA_log" TO "/var/opt/mssql/data/ODA_log.ldf"'

oda_postgres:
	@echo "Migrating Oda database..."
	@docker compose up -d pgsqldb
	@docker compose up -d oda_pg


prisma:
	@echo "Setting up Prisma..."
	@./config/setup_prisma.sh

reload_prisma:
	@echo "Reloading Prisma..."
	@./config/reload_prisma.sh

help:
	@echo "Available commands:"
	@echo "  make oda_create  - Set up the Oda database"
	@echo "  make oda_migrate - Migrate the Oda database"
	@echo "  make prisma      - Set up Prisma"
	@echo "  make help        - Show this help message"