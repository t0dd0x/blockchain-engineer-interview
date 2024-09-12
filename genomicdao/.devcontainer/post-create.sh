#!/bin/zsh
set -x

avalanche blockchain create LIFENetwork --test-defaults --evm --evm-chain-id 9999 --evm-token LIFE
nohup avalanche blockchain deploy LIFENetwork --local