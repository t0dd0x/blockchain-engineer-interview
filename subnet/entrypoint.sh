#!/bin/sh

cat > ~/.avalanche-cli/config.json <<- "EOF"
{
  "node-config": {
    "http-host": "0.0.0.0",
    "http-allowed-origins": "*",
    "http-allowed-hosts": "*"
  }
}
EOF

avalanche blockchain create LIFENetwork --test-defaults --evm --evm-chain-id 9999 --evm-token LIFE
avalanche blockchain deploy LIFENetwork --local

touch /opt/done

tail -f /dev/null