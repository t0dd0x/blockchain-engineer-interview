#!/bin/sh
npm i
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js --network life_local

touch /opt/done

tail -f /dev/null