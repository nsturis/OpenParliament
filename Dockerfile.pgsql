FROM pgvector/pgvector:pg16

# Copy custom initialization scripts, if any
# COPY ./init-scripts /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
