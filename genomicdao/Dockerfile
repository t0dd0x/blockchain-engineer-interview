FROM debian:stable-slim

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

CMD ["tail", "-f", "/dev/null"]