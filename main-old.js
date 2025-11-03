const CPU_PREFIX = 'CP20'
const DB_NUMBER = 101;
const DB_NAME = 'HMIDB';

const srcFile = './sourse/HMIDB.db'
const dblines = []
const parseString = require('./parse-type-string')
const parseStruct = require('./parse-struct-string')

const events = require('events');
const fs = require('fs');
const readline = require('readline');

(async function processLineByLine() {
  const dbtree = {
    types: {},
    db: {}
  }

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(srcFile),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      // console.log(`Line from file: ${line}`);
      dblines.push(line)
    });

    await events.once(rl, 'close');

    // console.log(dblines)
    let currentType = {}

    let isReadingType
    let isReadingBlock
    let isReadingStruct
    let strCurrentType
    let strCurrentStruct

    dblines.forEach((l, _index) => {
      if (l == "") { // emptystring
        // console.log(_index, " EMPTY - ", l)
      }
      else if (l.match('END_TYPE')) {
        isReadingType = false
        // console.log(_index, ' END_TYPE ', isReadingType, strCurrentType)
      }
      else if (l.match('TYPE')) {
        isReadingType = true
        let _match = l.match(/(?<=").*(?=")/)
        if (_match) {

          strCurrentType = _match[0].replace(/\"/g, "")
          // console.log(_index, " strCurrentType - ", isReadingType, strCurrentType)
        }
      }
      else if (l.match('END_STRUCT')) {
        isReadingStruct = false
        // console.log(_index, " END_STRUCT - ", l)

      } else if (l.match(/STRUCT/)) {
        isReadingStruct = true
        // console.log(_index, " STRUCT - ", l)

      } else if (l.match(/Struct/)) {
        isReadingStruct = true
        // console.log(_index, " Struct - ", l)
        if (isReadingBlock) {
          const parsetStr = parseStruct(l)
          // console.log(_index, "new struct in block", parsetStr)
          if (!dbtree.db[parsetStr.name]) {
            dbtree.db[parsetStr.name] = {}
            strCurrentStruct = parsetStr.name
          }
        }

      } else if (l.match('END_DATA_BLOCK') || l.match('BEGIN')) {
        isReadingBlock = false

        // console.log(_index, " DATA_BLOCK - ", l)

      } else if (l.match(/DATA_BLOCK/i)) {
        isReadingBlock = true

        let _match = l.match(/(?<=\").*(?=\")/)
        if (_match) {

          dbtree.dbName = _match[0].replace(/\"/g, "")
          // console.log(_index, " DATA_BLOCK - ", dbtree.dbName, l)
        }
      } else {

        if (isReadingType && !l.match(/VERSION/i)) {
          const parsedString = parseString(l)
          // console.log(_index, strCurrentType, " type row - ", parseString(l))
          if (!dbtree.types[strCurrentType]) {
            dbtree.types[strCurrentType] = {}
          }
          dbtree.types[strCurrentType][parsedString.name] = { ...parsedString.data }
        } else if (isReadingBlock && !isReadingStruct) {
          if (!l.match(/VERSION|S7_Optimized_Access|NON_RETAIN/g)) {

            // console.log(_index, isReadingBlock, isReadingStruct, " db block row direct var- ", l)
            const parsedStr = parseStruct(l)
            if (!dbtree.db[parsedStr.name]) {
              dbtree.db[parsedStr.name] = { data: parsedStr.data }
              strCurrentStruct = parsedStr.name
            }

          } else {
            // console.log(_index, isReadingBlock, isReadingStruct, " db block row dsome struct- ", l)

          }
        } else if (isReadingBlock && isReadingStruct) {

          // console.log(_index, isReadingBlock, isReadingStruct, strCurrentStruct, " isReadingStruct- ", l)
              

        }
      }


    })


    // console.log("#### dbtree   ", JSON.stringify(dbtree, null, " "))
    fs.writeFileSync('./dest/parsed.json', JSON.stringify(dbtree, null, " "))
  } catch (err) {
    console.error(err);
  }
})();

