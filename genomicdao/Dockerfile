FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /workspaces/app

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=20 \
    CMD bash -c '[ -f /opt/done ]' || exit 1

CMD ["tail", "-f", "/dev/null"]