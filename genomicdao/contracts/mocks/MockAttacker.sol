// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "../Controller.sol";

contract MockAttacker is IERC721Receiver {

    struct CacheSession {
        uint256 sessionId;
        string docId;
        string contentHash;
        string proof;
        uint256 riskScore;
    }

    Controller public controllerContract;
    bool public attackOngoing;
    CacheSession private cache;
    
    constructor(address controllerAddress) {
        controllerContract = Controller(controllerAddress);
    }

    function onERC721Received(
        address operator,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external override returns (bytes4) {
        if (!attackOngoing && operator == address(controllerContract)) {
            attackOngoing = true;
            controllerContract.confirm(cache.docId, cache.contentHash, cache.proof, cache.sessionId, cache.riskScore);
        }
        return IERC721Receiver.onERC721Received.selector;
    }

    function attack(
        string memory docId,
        string memory contentHash,
        string memory proof,
        uint256 riskScore
    ) external {
        uint256 sessionId = controllerContract.uploadData(docId);
        cache = CacheSession({
            sessionId: sessionId,
            docId: docId,
            contentHash: contentHash,
            proof: proof,
            riskScore: riskScore
        });
        controllerContract.confirm(docId, contentHash, proof, sessionId, riskScore);
    }
}