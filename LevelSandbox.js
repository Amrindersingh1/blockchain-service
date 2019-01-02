/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.get(key, (err, value) => {
              if (err) {
                console.log('Not found!', err)
                reject(err)
              } else {
                // console.log('Value = ' + value)  // DEBUG
                resolve(value)
              }
            })
          })
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.put(key, value, (err) => {
              if (err) {
                console.log('Block ' + key + ' submission failed', err)
                reject(err)
              }
              else {
                console.log('Block #' + key + ' stored')
                resolve(value)
              }
            })
          })
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise((resolve, reject) => {
            let height = -1
            self.db.createReadStream().on('data', (data) => {
              height++
            }).on('error', (err) => {
              console.log('Unable to read data stream!', err)
              reject(err)
            }).on('close', () => {
              // console.log('Blockchain height is #' + height) // DEBUG
              resolve(height)
            })
          })
    }
        

}

module.exports.LevelSandbox = LevelSandbox;