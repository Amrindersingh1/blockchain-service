# blockchain-service
Rest api for private blockchain

## Getting started

Open a command prompt or shell terminal after install node.js and execute:

```
npm install
```

## Testing

```
npm test
```

Or run the server:

```
node server.js
```

Use a software like postman or a simple CURL on the terminal to send the requests to the base url http://localhost:8000 with one of the below supported endpoints:

- GET
/block/{BLOCK_HEIGHT}

example:

```
 curl http://localhost:800/block/0
```

- POST
/block

example:

```
curl -X "POST" "http://localhost:800/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents"}'
```
