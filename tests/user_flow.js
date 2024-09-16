import Web3 from "web3";
import axios from "axios";
import fs from "fs";

import {setTimeout} from 'timers/promises';
import { createHash } from 'crypto';


// Configure your RPC URL and private key
const rpcUrl = 'http://subnet.local:9650/ext/bc/LIFENetwork/rpc'; // e.g., Infura, Alchemy, or your custom node
const privateKey = '0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027'; // Input your private key
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// Configure your REST API details
const apiBaseUrl = 'http://backend:3001';
const apiLoginUrl = `${apiBaseUrl}/auth/login`;
const apiSubmitUrl = `${apiBaseUrl}/gene/submit`;

// Smart contract details
const CONTRACT_ADDRESS_TOKEN = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922"
const CONTRACT_ADDRESS_NFT = "0x17aB05351fC94a1a67Bf3f56DdbB941aE6c63E25"
const CONTRACT_ADDRESS_CONTROLLER = "0x5aa01B3b5877255cE50cc55e8986a7a5fe29C70e"

async function main() {
    try {
        // 1. Connect to the blockchain and transfer coins
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        // Create a new wallet to transfer to
        const newWallet = web3.eth.accounts.create();

        console.log('Transferring coin to new wallet:', newWallet.address);

        const transfer = await web3.eth.sendTransaction({
            from: account.address,
            to: newWallet.address,
            value: web3.utils.toWei('0.1', 'ether'), // Send 0.01 ETH
            gas: 21000
        });

        console.log('Transfer successful, transaction hash:', transfer.transactionHash);

        let text = Date.now().toString();
        let signature = web3.eth.accounts.sign(text, web3.utils.toHex(newWallet.privateKey));

        // 2. Login to the REST API
        const loginResponse = await axios.post(apiLoginUrl, {
            address: newWallet.address,
            message: text,
            signature: signature.signature
        });

        const token = loginResponse.data.accessToken;
        console.log('Login successful, token:', token);

        // 3. Submit data to the web server
        const geneData = "extremely high risk";
        const submitResponse = await axios.post(apiSubmitUrl, {
            data: geneData
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const {docId, riskScore} = submitResponse.data.data;
        console.log('Data submitted, doc ID:', docId);

        // 4. Call smart contract function "uploadData" with the doc ID
        const controllerContract = new web3.eth.Contract(JSON.parse(fs.readFileSync("/workspaces/artifacts/Controller.sol/Controller.json", 'utf-8')).abi, CONTRACT_ADDRESS_CONTROLLER);

        const uploadDataReceipt = await controllerContract.methods.uploadData(docId).send({
            from: account.address
        });

        console.log('uploadData function called, transaction hash:', uploadDataReceipt.transactionHash);
        
        // Delay 3s, wait for backend synchonization finished
        await setTimeout(3000);

        // 5. Check if session id is synced
        const sessionIdsResponse = await axios.get(`${apiBaseUrl}/gene/${docId}/sessionIds`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Doc ID: ${docId} - Session Ids: ${JSON.stringify(sessionIdsResponse.data.data)}`);

        // 6. Call smart contract function "confirm"
        const confirmReceipt = await controllerContract.methods.confirm(
            docId, 
            createHash('sha256').update(geneData).digest('hex'),
            "success",
            sessionIdsResponse.data.data[0],
            riskScore
        ).send({
            from: account.address
        });
        console.log('confirm function called, transaction hash:', confirmReceipt.transactionHash);

        // Delay 3s, wait for backend synchonization finished
        await setTimeout(3000);

        // 7. Check if doc id is confirmed
        const docConfirmedResponse = await axios.get(`${apiBaseUrl}/gene/${docId}/confirmed`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Doc ID: ${docId} - Confirmed: ${JSON.stringify(docConfirmedResponse.data.data)}`);

        // if (checkSyncResponse.data.isSynced) {
        //     console.log('Data is synchronized with the blockchain.');
        // } else {
        //     console.log('Data is not yet synchronized.');
        // }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

main();
