// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./NFT.sol";
import "./Token.sol";

contract Controller {
    using Strings for string;

    //
    // STATE VARIABLES
    //
    uint256 private _sessionIdCounter;
    GeneNFT public geneNFT;
    PostCovidStrokePrevention public pcspToken;

    struct UploadSession {
        uint256 id;
        address user;
        string proof;
        bool confirmed;
    }

    struct DataDoc {
        string id;
        string hashContent;
    }

    mapping(uint256 => UploadSession) sessions;
    mapping(string => DataDoc) docs;
    mapping(string => bool) docSubmits;
    mapping(uint256 => string) nftDocs;

    //
    // EVENTS
    //
    event UploadData(string docId, uint256 sessionId);
    event ConfirmDoc(string docId, uint256 sessionId);
    event GNFTMinted(string docId, uint256 sessionId, uint256 tokenId);
    event PCSPRewarded(string docId, uint256 sessionId, uint256 riskScore, uint256 rewardAmount);

    constructor(address nftAddress, address pcspAddress) {
        geneNFT = GeneNFT(nftAddress);
        pcspToken = PostCovidStrokePrevention(pcspAddress);
    }

    function uploadData(string memory docId) public returns (uint256) {
        // TODO: Implement this method: to start an uploading gene data session. The doc id is used to identify a unique gene profile. Also should check if the doc id has been submited to the system before. This method return the session id
        uint256 sessionId = _sessionIdCounter;
        require(!docSubmits[docId], "Doc already been submitted");

        sessions[sessionId] = UploadSession({
            id: sessionId,
            user: msg.sender,
            proof: "",
            confirmed: false
        });
        emit UploadData(docId, sessionId);
        _sessionIdCounter++;
        return sessionId;
    }

    function confirm(
        string memory docId,
        string memory contentHash,
        string memory proof,
        uint256 sessionId,
        uint256 riskScore
    ) public virtual {
        require(proof.equal("success"));
        require(!docSubmits[docId], "Doc already been submitted");
        // Cache here for saving reading cost from storage
        UploadSession memory session = sessions[sessionId];
        require(session.user == msg.sender, "Invalid session owner");
        require(!session.confirmed, "Session is ended");

        docSubmits[docId] = true;

        docs[docId] = DataDoc({
            id: docId,
            hashContent: contentHash
        });
        
        session.proof = proof;
        session.confirmed = true;
        sessions[sessionId] = session;

        // Close the session before sending any reward to the user to prevent a reentrancy attack
        uint256 nftTokenId = geneNFT.safeMint(msg.sender);
        nftDocs[nftTokenId] = docId;
        emit GNFTMinted(docId, sessionId, nftTokenId);

        uint256 rewardAmount = pcspToken.reward(msg.sender, riskScore);
        emit PCSPRewarded(docId, sessionId, riskScore, rewardAmount);

        emit ConfirmDoc(docId, sessionId);
    }

    function getSession(uint256 sessionId) public view returns(UploadSession memory) {
        return sessions[sessionId];
    }

    function getDoc(string memory docId) public view returns(DataDoc memory) {
        return docs[docId];
    }
}
