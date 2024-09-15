FROM debian:stable-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
ENV PATH="$PATH:/root/.local/bin:/root/bin"

WORKDIR /app
COPY entrypoint.sh /app/entrypoint.sh

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=20 \
    CMD bash -c '[ -f /opt/done ]' || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]