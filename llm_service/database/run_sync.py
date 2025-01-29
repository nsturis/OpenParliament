import argparse
from sync_oda_db import OdaDbSync
import asyncio
import os
import logging
from sqlalchemy import text

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_args():
    parser = argparse.ArgumentParser(description='Sync ODA data to database.')
    parser.add_argument('--entity', type=str, help='Name of the entity to sync.')
    parser.add_argument('--list-tables', action='store_true', help='List all tables in the database')
    return parser.parse_args()

async def list_tables(db_url):
    """List all tables in the database"""
    sync = OdaDbSync(db_url)
    query = text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    
    with sync.engine.connect() as conn:
        result = conn.execute(query)
        tables = [row[0] for row in result]
        
    print("\nAvailable tables:")
    for table in tables:
        print(f"- {table}")
    print()

async def main():
    args = parse_args()
    db_url = os.getenv('DATABASE_URL')
    
    if args.list_tables:
        await list_tables(db_url)
        return
        
    sync = OdaDbSync(db_url)
    try:
        if args.entity:
            entity_name = args.entity
            since_date = await sync.get_last_sync_date(entity_name)
            logging.info(f"Last sync date for {entity_name}: {since_date}")
            
            items = await sync.fetch_oda_data(entity_name, since_date)
            logging.info(f"Fetched {len(items)} items for {entity_name}")
            
            for item in items:
                await sync.upsert_entity(entity_name, item)
            
            logging.info(f"Successfully synced {entity_name}")
        else:
            await sync.sync_all()
            logging.info("Successfully synced all entities.")
            
    except Exception as e:
        logging.error(f"Error during synchronization: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())