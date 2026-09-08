#!/usr/bin/env bash
# Push new rows of append-only tables from the laptop DB to the server DB.
# Both sides sync ODA tables themselves; this is only for tables we produce
# locally: taleSegmentRaw, taleSegmentChunk, FilContent, idmap.
# Usage: scripts/push-rows.sh taleSegmentRaw taleSegmentChunk   (parents first)
set -euo pipefail
SERVER=${SERVER:-unfuckthesystem}

local_psql() { docker exec -i pgsqldb psql -U postgres -d oda -Atq -c "$1"; }
remote_psql() {
  ssh "$SERVER" "docker exec -i \$(docker ps -qf name=pgsqldb) psql -U postgres -d oda -Atq -c $(printf %q "$1")"
}

for t in "$@"; do
  max=$(remote_psql "SELECT COALESCE(MAX(id), 0) FROM \"$t\"")
  echo "$t: server max id $max, pushing rows above it"
  local_psql "COPY (SELECT * FROM \"$t\" WHERE id > $max) TO STDOUT" | remote_psql "COPY \"$t\" FROM STDIN"
done
