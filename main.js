const CPU_PREFIX = 'CP20'
const DB_NUMBER = 101;
const CONNECTION_ID = "CP20"

// const DB_NAME = 'User_data_type_1.udt';
// const DB_NAME = 'HMIDB';

// const srcFile = './sourse/HMIDB.db'
//EQParametersDB
const srcFile = './sourse/EQParametersDB.db'
const SOURSE_PATH = './sourse/'
const srcFiles = [
  // 'User_data_type_1.udt',

  ['EQParametersDB.db', 0],
  ['HMIDB.db', 0],
  ['U01TrackingDB.db', 0],
  ['AlarmDB.db', 0],
  ['DIDB.db', 0],
  ['AIDB.db', 0],
  ['InitDB.db', 0],

]

// const srcFile = './sourse/User_data_type_1.udt'

// const parseString = require('./parse-type-string')
// const parseStruct = require('./parse-struct-string')


const parseTypeArray = require('./parse-type-array')
const parseBlockArray = require('./parse-block-array')
const formTagsArray = require('./xlsx/form-tags-array')


const events = require('events');
const fs = require('fs');
const readline = require('readline');

async function processLineByLine(fileName, dbIndex) {
  const dblines = []
  const dbtree = {
    types: {},
    db: {},
    dnIndex: dbIndex,
  }

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      // console.log(`Line from file: ${line}`);
      dblines.push(line)
    });

    await events.once(rl, 'close');

    // console.log(dblines)
    let currentType = {}
    let currenTypeLines = []
    let dataBlockLines = []

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
        // console.log(_index, ' END_TYPE ', isReadingType, strCurrentType, currenTypeLines.length)
        if (currenTypeLines.length) {
          dbtree.types[strCurrentType] = { ...parseTypeArray(currenTypeLines) }
        }
        currenTypeLines = []
      }
      else if (l.match('TYPE')) {
        isReadingType = true
        let _match = l.match(/(?<=").*(?=")/)
        if (_match) {

          strCurrentType = _match[0].replace(/\"/g, "")
          // console.log(_index, " strCurrentType - ", isReadingType, strCurrentType)
        }

      } else if (l.match('END_DATA_BLOCK') || l.match('BEGIN')) {
        isReadingBlock = false

        // console.log(_index, " DATA_BLOCK - ", l, dataBlockLines.length, dataBlockLines)
        if (dataBlockLines.length) {
          dbtree.db = { ...parseBlockArray(dataBlockLines) }
        }
        dataBlockLines = []

      } else if (l.match(/DATA_BLOCK/i)) {
        isReadingBlock = true

        let _match = l.match(/(?<=\").*(?=\")/)
        if (_match) {

          dbtree.dbName = _match[0].replace(/\"/g, "")
          // console.log(_index, " DATA_BLOCK - ", dbtree.dbName, l)
        }
      } else {
        if (isReadingType) {
          currenTypeLines.push(l)
        }
        if (isReadingBlock) {
          dataBlockLines.push(l)
        }
      }
    })
    // console.log("#### dbtree   ", JSON.stringify(dbtree, null, " "))
    return dbtree;

  } catch (err) {
    console.error(err);
  }
}

(async function main() {
  let tagsarray = []
  const dbsarray = []
  //############################READ FILES ####################################
  for await (const [fileName, dbIndex] of srcFiles) {
    try {
      console.log("#####READ new file  ", fileName);

      const dbtreeObj = await processLineByLine(SOURSE_PATH + fileName, dbIndex);
      dbsarray.push(dbtreeObj)

    } catch (error) {
      console.error("Error process file ", fileName, error)
    }
    fs.writeFileSync('./dest/parsed.json', JSON.stringify(dbsarray, null, " "))




  }

  //######################UPDATE TYPES##########################################


  const currentName = [CPU_PREFIX]

  //#######################FORM TAGS ARRAY##########################################
  for await (const dbObj of dbsarray) {
    // console.log(`${CPU_PREFIX}_${dbObj.dbName}`);

    const dbTagsArray = formTagsArray(dbObj, currentName, CONNECTION_ID)
    tagsarray = [...tagsarray, ...dbTagsArray]

    //add connection id  as prefix to path and in connection column 

  }
  console.log("tagsArray.length", tagsarray.length);
  const noSpareTagsArray = tagsarray.filter(tagRecord => !tagRecord[0].includes('spare'))
  console.log("noSpareTagsArray.length", noSpareTagsArray.length);

})();

