const parseString = require('./parse-type-string')


const parseTypeStructArray = (typeArray) => {

    const structName = typeArray[0].split(":")[0].trim()
    // console.log("structName in parseTypeStructArray    - ", structName);
    const rows = typeArray.filter(line => !line.match('VERSION') && line != "").slice(1, -1)
    const structRlt = {}
    const structLines = []

    // console.log("####parseTypeStructArray rows - ", rows);

    let isStructLinesAggregation = false


    let structNestingCounter = 0
    rows.forEach((_line, _rowsIndex) => {
        if (_line.match('Struct')) {
            //search for structure recusive
            isStructLinesAggregation = true
            structNestingCounter++
            structLines.push(_line)

        } else if (_line.match("END_STRUCT")) {
            isStructLinesAggregation = false
            structNestingCounter--
            structLines.push(_line)


            if (structNestingCounter) {
                ;//still nested . proceed
            } else {
                //do smth
                // console.log("###### parseTypeStructArray Struct ended", structLines.length, structLines);
                const structInType = parseTypeStructArray(structLines)

                // console.log("parseTypeStructArray structInType - ", structInType);
                    structRlt[structInType.name] = { ...structInType.data }

                while (structLines.length) { structLines.pop() } // clear
            }

        } else {
            //just record
            if (!isStructLinesAggregation) {

                const parsedString = parseString(_line)
                structRlt[parsedString.name] = { ...parsedString.data }
            } else {  // isStructLinesAggregation
                structLines.push(_line)
            }
        }
    });
    // console.log("-------parseTypeStructArray", structRlt)

    return {
        name: structName,
        data: { ...structRlt }

    }
}

    module.exports = parseTypeStructArray