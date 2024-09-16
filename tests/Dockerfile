FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/app

CMD ["tail", "-f", "/dev/null"]