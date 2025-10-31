const parseString = require('./parse-type-string')
const parseTypeStructArray = require('./parse-type-struct-array')


const parseTypeArray = (typeArray) => {
    const rows = typeArray.filter(line => !line.match('VERSION') && line != "").slice(1, -1)

    // console.log("rows - ", rows);
    const rlt = {}
    const structLines = []
    let isStructLinesAggregation = false

    let structNestingCounter = 0
    rows.forEach((_line, _rowsIndex) => {
        if (_line.match('Struct')) {
            //search for structure recusive
            isStructLinesAggregation = true
            structNestingCounter++

            structLines.push(_line) // collecting struct lines
            // console.log("structNestingCounter ",structNestingCounter, _line);
        } else if (_line.match("END_STRUCT")) {
            isStructLinesAggregation = false
            structNestingCounter--
            // console.log("structNestingCounter ",structNestingCounter, _line);

            structLines.push(_line) // collecting struct lines

            if (structNestingCounter) {
                ;//still nested . proceed
            } else {
                //do smth
                // console.log("###### Struct ended", structLines.length, structLines);
                const structInType = parseTypeStructArray(structLines)
                   
                rlt[structInType.name] = { ...structInType.data }

                // console.log("structInType - ", structInType);

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
    // console.log("parseTypeArray  - ", rlt)
    return rlt
}

module.exports = parseTypeArray