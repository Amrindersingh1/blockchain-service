/* ===== Blockchain Class ====== */

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        console.log('I am BlockChain')
        this.getBlockHeight().then((height) => {
            if (height === -1) this.generateGenesisBlock();
          },(error) => {
              console.log(error);
          });
    }

    // method to create a Genesis Block (always with height= 0)
    // verify if the height !== 0 then
    // will not create the genesis block
    generateGenesisBlock(){
        this.addBlock(new Block.Block('Genesis block :)')).then(() => console.log('Genesis block stored!'))
    }

    // Get block height, it is method that return the height of the blockchain
    async getBlockHeight () {
        return await this.bd.getBlocksCount();
    }

    // Add new block
    async addBlock(newBlock) {
        // previous block height
        let previousBlockHeight = parseInt(await this.getBlockHeight());
        // Block height
        newBlock.height = previousBlockHeight + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (newBlock.height > 0) {
            let previousBlock = await this.getBlock(previousBlockHeight);
            newBlock.previousBlockHash = previousBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        // Adding block object to levelDB
        console.log("Added " + newBlock.JSON);
        await this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
        return await this.getBlock(newBlock.height);
    }

    // Get Block By Height
    async getBlock(height) {
        // return object as a single string
        return JSON.parse(await this.bd.getLevelDBData(height))
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        // get block object
        let block = await this.getBlock(height);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';

        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();

        // Compare
        if (blockHash === validBlockHash) {
            // return true if block is valid
            return true;
        } else {
            console.log('Block #' + height + ' invalid hash:\n' + blockHash + '<>' + validBlockHash)
            return false;
        }
    }

    // Validate Blockchain
    async validateChain() {
        let errorLog = [];
        let blockChainHeight = await this.getBlockHeight();
    
        for (let i = 0; i < blockChainHeight; i++) {
    
          // validate a single block
          if (!this.validateBlock(i)) errorLog.push(i);
    
          // compare blocks hash link
          let blockHash = this.getBlock(i).hash;
          let previousHash = this.getBlock(i + 1).previousBlockHash;
          if (blockHash !== previousHash) {
            errorLog.push(i);
          }
    
        }
    
        if (errorLog.length > 0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: ' + errorLog);
        } else {
          console.log('No errors detected');
        }

        return errorLog;
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;