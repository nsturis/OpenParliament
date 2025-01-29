from sqlalchemy import create_engine, text
from datetime import datetime
import logging
import httpx
from typing import List, Dict, Any, Optional
import asyncio

class OdaDbSync:
    def __init__(self, db_url: str, oda_base_url: str = "https://oda.ft.dk/api"):
        self.engine = create_engine(db_url)
        self.oda_base_url = oda_base_url
        # Define foreign key relationships
        self.foreign_key_mappings = {
            'MødeAktør': {
                'aktørid': ('Aktør', 'id'),
                'mødeid': ('Møde', 'id')
            },
            'DokumentAktør': {
                'aktørid': ('Aktør', 'id'),
                'dokumentid': ('Dokument', 'id')
            },
            'SagAktør': {
                'aktørid': ('Aktør', 'id'),
                'sagid': ('Sag', 'id')
            },
            'AktørAktør': {
                'fraaktørid': ('Aktør', 'id'),
                'tilaktørid': ('Aktør', 'id')
            },
            # Add other relationships as needed
        }
        self.entity_mappings = {
            # Base entities (no foreign keys)
            'Aktørtype': '"Aktørtype"',
            'AktørAktørRolle': '"AktørAktørRolle"',
            'Periode': '"periode"',
            'Dokumenttype': 'dokumenttype',
            'Dokumentkategori': 'dokumentkategori',
            'Dokumentstatus': 'dokumentstatus',
            'Mødetype': '"Mødetype"',
            'Mødestatus': '"Mødestatus"',
            'Sagstype': 'sagstype',
            'Sagsstatus': 'sagsstatus',
            'Sagskategori': 'sagskategori',
            'SagAktørRolle': '"SagAktørRolle"',
            'DokumentAktørRolle': '"DokumentAktørRolle"',
            'SagDokumentRolle': 'sagdokumentrolle',
            'Stemmetype': 'stemmetype',
            'Afstemningstype': 'afstemningstype',
            'Emneordstype': 'emneordstype',
            
            # First level dependencies
            'Aktør': '"Aktør"',
            'Dokument': 'dokument',
            'Møde': '"Møde"',
            'Sag': 'sag',
            
            # Second level dependencies
            'AktørAktør': '"AktørAktør"',
            'DokumentAktør': '"DokumentAktør"',
            'MødeAktør': '"MødeAktør"',
            'SagAktør': '"SagAktør"',
            'Emneord': 'emneord',
            
            # Third level dependencies
            'Sagstrin': 'sagstrin',
            'EmneordDokument': 'emneorddokument',
            'EmneordSag': 'emneordsag',
            'Fil': 'fil',
            'Stemme': 'stemme',
            
            # Fourth level dependencies
            'SagstrinAktør': '"SagstrinAktør"',
            'SagstrinDokument': 'sagstrindokument',
            'Dagsordenspunkt': 'dagsordenspunkt',
            
            # Final level
            'Sambehandlinger': 'sambehandlinger'
        }

    async def get_last_sync_date(self, entity_name: str) -> Optional[datetime]:
        table_name = self.entity_mappings.get(entity_name)
        if not table_name:
            raise ValueError(f"Unknown entity: {entity_name}")
        
        query = text("""
            SELECT MAX(opdateringsdato AT TIME ZONE 'UTC') 
            FROM {}
        """.format(table_name))
        
        with self.engine.connect() as conn:
            result = conn.execute(query).scalar()
            return result

    async def fetch_oda_data(self, entity_name: str, since_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Fetch data from ODA API"""
        all_items = []
        batch_size = 100
        skip = 0
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            while True:
                try:
                    # First try without any filtering
                    params = {
                        "$top": batch_size,
                        "$skip": skip,
                        "$orderby": "opdateringsdato"
                    }
                    
                    if since_date:
                        formatted_date = since_date.strftime('%Y-%m-%dT%H:%M:%S')
                        params["$filter"] = f"opdateringsdato gt datetime'{formatted_date}'"
                    
                    url = f"{self.oda_base_url}/{entity_name}"
                    response = await client.get(url, params=params)
                    response.raise_for_status()
                    
                    # Get the response content
                    content = response.json()
                    
                    # Handle both possible response formats
                    if 'value' in content:
                        items = content['value']
                    elif 'd' in content:
                        items = content['d']
                    else:
                        items = []
                    
                    all_items.extend(items)
                    
                    # Check if there's a next page
                    if 'odata.nextLink' in content:
                        skip += batch_size
                    else:
                        break
                        
                except Exception as e:
                    logging.error(f"Error fetching {entity_name} from ODA API: {str(e)}")
                    raise

        return all_items

    async def get_columns_info(self, table_name: str) -> List[tuple]:
        """Get column information from the database schema"""
        # Remove quotes from table_name for the query
        clean_table_name = table_name.replace('"', '')
        
        query = text("""
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME ILIKE :table_name
        """)
        
        with self.engine.connect() as conn:
            result = conn.execute(query, {"table_name": clean_table_name}).fetchall()
            logging.debug(f"Columns for {table_name}: {result}")
            return result

    async def has_identity_column(self, table_name: str) -> Optional[str]:
        """Check if table has an identity column in PostgreSQL"""
        query = text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = :table_name
            AND is_identity = 'YES'
        """)
        
        with self.engine.connect() as conn:
            result = conn.execute(query, {"table_name": table_name}).fetchone()
            return result[0] if result else None

    def cast_value(self, column_type: str, value: Any) -> Any:
        """Cast value to appropriate database type"""
        if value is None:
            return None
        if column_type == "float":
            return float(value)
        elif column_type == "int":
            return int(value)
        return value

    async def fetch_single_entity(self, entity_name: str, entity_id: int) -> Optional[Dict[str, Any]]:
        """Fetch a single entity by ID from ODA API"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                url = f"{self.oda_base_url}/{entity_name}({entity_id})"
                response = await client.get(url)
                response.raise_for_status()
                
                content = response.json()
                if 'd' in content:
                    return content['d']
                return content
                
            except Exception as e:
                logging.error(f"Error fetching single {entity_name} with ID {entity_id}: {str(e)}")
                return None

    async def ensure_foreign_key_exists(self, foreign_table: str, foreign_key: str, foreign_id: int) -> bool:
        """Ensure a foreign key exists, fetching it from the API if necessary"""
        # First check if it exists in the database
        exists = self.check_foreign_key_exists(foreign_table, foreign_key, foreign_id)
        if exists:
            return True
        
        # If not, try to fetch it from the API
        logging.info(f"Fetching missing {foreign_table} record with ID {foreign_id} from API")
        entity_data = await self.fetch_single_entity(foreign_table, foreign_id)
        
        if entity_data:
            # Insert the fetched entity
            try:
                await self.upsert_entity(foreign_table, entity_data)
                return True
            except Exception as e:
                logging.error(f"Error upserting fetched {foreign_table} record: {str(e)}")
                return False
        
        return False

    async def resolve_dependencies(self, entity_name: str, data: Dict[str, Any]) -> None:
        """Resolve all foreign key dependencies for an entity"""
        dependencies = self.foreign_key_mappings.get(entity_name, {})
        for fk_column, (foreign_entity, foreign_key) in dependencies.items():
            foreign_id = data.get(fk_column)
            if not await self.ensure_foreign_key_exists(foreign_entity, foreign_key, foreign_id):
                raise ValueError(
                    f"Could not ensure {foreign_entity} with ID {foreign_id} exists "
                    f"(required for {entity_name}.{fk_column})"
                )

    async def upsert_entity(self, entity_name: str, data: Dict[str, Any]) -> None:
        """Upsert an entity into the database using INSERT ... ON CONFLICT"""
        try:
            table_name = self.entity_mappings.get(entity_name)
            if not table_name:
                raise ValueError(f"Unknown entity: {entity_name}")

            # Handle foreign key dependencies
            if entity_name == "MødeAktør":
                aktørid = data.get("aktørid")
                if not await self.ensure_foreign_key_exists("Aktør", "id", aktørid):
                    logging.error(f"Could not ensure Aktør with ID {aktørid} exists")
                    raise ValueError(f"Required Aktør with ID {aktørid} could not be fetched")
                
                mødeid = data.get("mødeid")
                if not await self.ensure_foreign_key_exists("Møde", "id", mødeid):
                    logging.error(f"Could not ensure Møde with ID {mødeid} exists")
                    raise ValueError(f"Required Møde with ID {mødeid} could not be fetched")

            # Debug log the incoming data
            logging.debug(f"Upserting data for {entity_name}: {data}")

            columns_info = await self.get_columns_info(table_name)
            logging.debug(f"Columns for {table_name}: {columns_info}")
            
            # Create a case-insensitive mapping of API fields to DB columns
            column_mapping = {col[0].lower(): col[0] for col in columns_info}
            
            # Cast values to their corresponding data types
            casted_data = {}
            for col, col_type in columns_info:
                # Look up the API field name in a case-insensitive way
                api_value = None
                for api_field, value in data.items():
                    if api_field.lower() == col.lower():
                        api_value = value
                        break
                
                if api_value is not None:
                    casted_data[col] = self.cast_value(col_type, api_value)
            
            # Validate that we have data to insert
            if not casted_data:
                raise ValueError(f"No valid data to insert for {entity_name}")
            
            # Debug log the processed data
            logging.debug(f"Processed data for {entity_name}: {casted_data}")
            
            # Generate the INSERT ... ON CONFLICT query components
            insert_columns = ', '.join([f'"{col}"' for col in casted_data.keys()])
            insert_values = ', '.join([f":{col}" for col in casted_data.keys()])
            update_columns = ', '.join([f'"{col}" = EXCLUDED."{col}"' 
                                      for col in casted_data.keys() 
                                      if col.lower() not in ['id', 'opdateringsdato']])
            
            # Ensure we have update columns
            if not update_columns:
                update_columns = '"opdateringsdato" = EXCLUDED."opdateringsdato"'  # Fallback update
            
            # Add condition to only update if the new opdateringsdato is later
            update_condition = f'{table_name}."opdateringsdato" = GREATEST(EXCLUDED."opdateringsdato", {table_name}."opdateringsdato")'
            
            upsert_query = text(f"""
                INSERT INTO {table_name} ({insert_columns})
                VALUES ({insert_values})
                ON CONFLICT (id) DO UPDATE SET
                {update_columns}
                WHERE {update_condition};
            """)
            
            # Debug log the SQL query
            logging.debug(f"Executing query: {upsert_query}\nWith parameters: {casted_data}")
            
            with self.engine.connect() as conn:
                conn.execute(upsert_query, casted_data)
                conn.commit()
                
        except Exception as e:
            logging.error(f"Error upserting to {entity_name}: {str(e)}")
            raise

    async def sync_entity(self, entity_name: str, since_date: Optional[datetime] = None) -> None:
        """Synchronize a single entity from ODA API to local database"""
        table_name = self.entity_mappings.get(entity_name)
        if not table_name:
            raise ValueError(f"Unknown entity: {entity_name}")

        try:
            if not since_date:
                since_date = await self.get_last_sync_date(entity_name)

            logging.info(f"Starting sync for {entity_name} since {since_date}")
            
            items = await self.fetch_oda_data(entity_name, since_date)
            
            for item in items:
                await self.upsert_entity(entity_name, item)
            
            logging.info(f"Completed sync for {entity_name}. Synced {len(items)} items.")
            
        except Exception as e:
            logging.error(f"Error during sync of {entity_name}: {str(e)}")
            raise

    async def sync_all(self) -> None:
        """Synchronize all entities in the correct order based on dependencies"""
        sync_order = [
            # Base entities (no foreign keys)
            ['Aktørtype', 'Periode', 'Dokumenttype', 'Dokumentkategori', 'Dokumentstatus',
             'Mødetype', 'Mødestatus', 'Sagstype', 'Sagsstatus', 'Sagskategori',
             'AktørAktørRolle', 'DokumentAktørRolle', 'SagAktørRolle', 'SagDokumentRolle',
             'Stemmetype', 'Afstemningstype', 'Emneordstype'],
            
            # First level dependencies
            ['Aktør', 'Dokument', 'Møde', 'Sag'],
            
            # Second level dependencies
            ['AktørAktør', 'DokumentAktør', 'MødeAktør', 'SagAktør', 'Emneord'],
            
            # Third level dependencies
            ['Sagstrin', 'EmneordDokument', 'EmneordSag', 'Fil', 'Stemme'],
            
            # Fourth level dependencies
            ['SagstrinAktør', 'SagstrinDokument', 'Dagsordenspunkt'],
            
            # Final level
            ['Sambehandlinger']
        ]

        for level in sync_order:
            tasks = [self.sync_entity(entity) for entity in level]
            try:
                await asyncio.gather(*tasks)
            except Exception as e:
                logging.error(f"Error syncing entities at level {level}: {str(e)}")
                raise
