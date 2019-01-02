'use strict';

const Hapi=require('hapi');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
let myBlockChain = new BlockChain.Blockchain();

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:800
});

// Add the get block route
server.route({
    method:'GET',
    path:'/block/{blockHeight}',
    handler:async(request,h) => {
        try {
            const response = await myBlockChain.getBlock(request.params.blockHeight);
            return response;
          } catch (error) {
            return {
              "status": 404,
              "message": "Block not found"
            };
          }
    }
});

const blockPostHandler = async(request,h) => {

    var newBlock = await new Block.Block(request.payload.body);
    return await myBlockChain.addBlock(newBlock);
}

// Add post block route
server.route({
    method:'POST',
    path:'/block',
    handler: blockPostHandler
});


// Start the server
const start =  async function() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();