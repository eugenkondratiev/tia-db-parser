const parseString = require('./parse-block-string')
const parseBlockStructArray = require('./parse-block-struct-array')
const parseStructArrayString = require('./parse-array-string')


const parseBlockArray = (blockArray) => {
    const rows = blockArray.filter(line => !line.match(/(VERSION|NON_RETAIN|BEGIN|END_BLOCK)/) && line != "").slice(2, -1)

    // console.log("BLOCK rows - ", rows);
    // console.log("BLOCK rows[0] - ", rows[0]);
    // console.log("BLOCK rows last - ", rows[rows.length - 1]);

    const rlt = {}
    const structLines = []
    let isStructLinesAggregation = false
    let strArrayStruct

    let structNestingCounter = 0

    rows.forEach((_line, _rowsIndex) => {
        if (_line.match('Struct')) {
            //search for structure recusive
            isStructLinesAggregation = true
            structNestingCounter++

            structLines.push(_line) // collecting struct lines
            if (_line.match("rray")) {
                strArrayStruct = _line
                console.log("!!!!!!!!!!!THIS LINE COUSES strArrayStruct =smth ", _line, `#######################
                    ##############################
                    ##############################
                    ########CAUSE STRUCT ARRAY###########
                    ##############################
                    ##############################
                    ##############################
                    `);
            }
            // console.log("structNestingCounter ",structNestingCounter, _line);
        } else if (_line.match("END_STRUCT")) {
            structNestingCounter--
            if (!structNestingCounter) { isStructLinesAggregation = false } else { console.log("structNestingCounter - ", _rowsIndex, structNestingCounter, _line) }
            // console.log("structNestingCounter ",structNestingCounter, _line);

            structLines.push(_line) // collecting struct lines

            if (structNestingCounter) {
                ;//still nested . proceed
            } else {
                //do smth
                // console.log("###### Struct ended", structLines.length, structLines);
                const structInBlock = parseBlockStructArray(structLines)

                rlt[structInBlock.name] = { ...structInBlock.data }
                if (strArrayStruct) {
                    // console.log(" @@@@@@@@@@@@@@@ strArrayStruct structInBlock.name  structNestingCounter ===0", structInBlock.name, structInBlock);

                    // rlt[structInBlock.name].isArray = true
                    const structArrayParameters = parseStructArrayString(strArrayStruct)

                    // rlt[structInBlock.name].comment = structArrayParameters.comment
                    // rlt[structInBlock.name].arrayStart = structArrayParameters.start
                    // rlt[structInBlock.name].arrayEnd = structArrayParameters.end

                }
                // console.log("structInBlock - ", structInBlock);

                while (structLines.length) { structLines.pop() } // clear
            }
        } else {
            if (isStructLinesAggregation) {
                structLines.push(_line) // collecting struct lines
            } else {
                //just record
                if (!isStructLinesAggregation) {

                    const parsedString = parseString(_line)
                    rlt[parsedString.name] = { ...parsedString.data }
                }
            }
        }
    });
    // console.log("parseBlockArray  - ", rlt)
    return rlt
}

module.exports = parseBlockArray