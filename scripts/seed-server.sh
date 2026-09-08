#!/usr/bin/env bash
# One-time seed of the server DB from the laptop DB (pg_dump → rsync → pg_restore).
# Run after the Coolify stack has started once, so the pgsqldb container exists.
# The restore runs detached on the server (30–60 min, rebuilds the HNSW index);
# this script follows /data/seed.log and Ctrl-C is safe.
set -euo pipefail
SERVER=${SERVER:-unfuckthesystem}
DUMP=~/oda-backups/oda-$(date +%F).dump

if [ ! -s "$DUMP" ]; then
  echo "dumping local oda -> $DUMP"
  docker exec pgsqldb pg_dump -U postgres -Fc oda > "$DUMP"
fi
rsync -avP "$DUMP" "$SERVER:/data/oda.dump"

ssh "$SERVER" 'PG=$(docker ps -qf name=pgsqldb); [ -n "$PG" ] || { echo "no pgsqldb container on server"; exit 1; }
  nohup bash -c "
    docker cp /data/oda.dump $PG:/tmp/oda.dump &&
    docker exec $PG pg_restore -U postgres -d oda -j 4 --no-owner --clean --if-exists /tmp/oda.dump;
    echo pg_restore exit \$?;
    docker exec $PG rm /tmp/oda.dump; rm /data/oda.dump; echo SEED_DONE
  " > /data/seed.log 2>&1 &'
echo "restore started; following $SERVER:/data/seed.log"
ssh "$SERVER" 'tail -f /data/seed.log | sed "/SEED_DONE/q"'
