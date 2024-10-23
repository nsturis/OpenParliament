FROM postgres:16

# Install dependencies required for building extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-server-dev-all \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pgvector
RUN git clone --depth 1 --branch v0.5.0 https://github.com/pgvector/pgvector.git /pgvector \
    && cd /pgvector \
    && make && make install \
    && rm -rf /pgvector

# Copy custom initialization scripts, if any
# COPY ./init-scripts /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432