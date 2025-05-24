# Build stage
FROM rust:1.81 as builder

# Install sea-orm-cli
RUN cargo install sea-orm-cli

# Set working directory
WORKDIR /usr/src/app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source code and migrations
COPY src ./src
COPY migrations ./migrations

# Remove redundant SQL file
RUN rm -f src/create_seen_posts.sql

# Build the application
RUN cargo build --release

# Final stage
FROM debian:buster-slim

# Install libpq for PostgreSQL client
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/local/bin

# Copy the compiled binary, migrations, and sea-orm-cli
COPY --from=builder /usr/src/app/target/release/tech-chronicle-bot .
COPY --from=builder /usr/src/app/migrations ./migrations
COPY --from=builder /root/.cargo/bin/sea-orm-cli /usr/local/bin/sea-orm-cli

# Run migrations and start the application
CMD sea-orm-cli migrate -d ./migrations && ./tech-chronicle-bot
