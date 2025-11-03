const updateTypesData = require("./update-types-data")

module.exports = function getTypeInfo(type, typesObj) {
    const typeName = String(type).trim().replace("\"", "")
    { //primitive types
        if (typeName === 'Bool') return {  /// TODO consider 8-16-32 bool in a row
            dataType: 'Bool',
            size: 1,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'Int') return {
            dataType: 'Int',
            size: 2,
            coding: 'Binary',
            _db: 'DBW'

        }
        if (typeName === 'Real') return {
            dataType: 'Real',
            size: 4,
            coding: 'IEEE754',
            _db: 'DBD'

        }
        if (typeName === 'Word') return {
            dataType: 'Word',
            size: 2,
            coding: 'Binary',
            _db: 'DBW'
        }
        if (typeName === 'Date_And_Time') return {
            dataType: 'Date_And_Time',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'Date') return {
            dataType: 'Date',
            size: 2,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'Time') return {
            dataType: 'Time',
            size: 4,
            coding: 'Binary',
            _db: 'DBD'
        }




        if (typeName === 'Byte') return {
            dataType: 'Byte',
            size: 1,
            coding: 'Binary',
            _db: 'DBB'
        }
        if (typeName === 'Char') return {
            dataType: 'Char',
            size: 1,
            coding: 'Binary',
            _db: 'DBB'
        }

        if (typeName === 'DWord') return {
            dataType: 'DWord',
            size: 4,
            coding: 'Binary'
        }
        if (typeName === 'Time_Of_Day') return {
            dataType: 'Time_Of_Day',
            size: 4,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'SInt') return {
            dataType: 'SInt',
            size: 2,
            coding: 'Binary',
            _db: 'DBB'
        }
        if (typeName === 'LWord') return {
            dataType: 'LWord',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'LInt') return {
            dataType: 'LInt',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'LReal') return {
            dataType: 'LReal',
            size: 8,
            coding: 'IEEE754',
            _db: 'DBX'
        }
        if (typeName === 'LTime') return {
            dataType: 'LTime',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'LTime_Of_Day') return {
            dataType: 'LTime_Of_Day',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'UDInt') return {
            dataType: 'UDInt',
            size: 4,
            coding: 'Binary',
            _db: 'DBD'
        }
        if (typeName === 'UInt') return {
            dataType: 'UInt',
            size: 2,
            coding: 'Binary',
            _db: 'DBW'
        }
        if (typeName === 'ULInt') return {
            dataType: 'ULInt',
            size: 8,
            coding: 'Binary',
            _db: 'DBX'
        }
        if (typeName === 'USnt') return {
            dataType: 'USnt',
            size: 2,
            coding: 'Binary',
            _db: 'DBB'
        }
    }

    if (typeName == "IPICombinedStatesUDT" || typeName == "IPIDistrCommandsUDT") return {
        dataType: 'Word',
        size: 2,
        coding: 'Binary',
        _db: 'DBW'
    }


    if (typeName.match(/^String/)) {
        // String[80]
        const match = typeName.match(/String\[(\d+)\]/)
        if (match) {
            const strLength = parseInt(match[1], 10)
            return {
                dataType: 'String',
                size: strLength + 2, // +2 for length bytes
                coding: 'Binary',
                _db: 'DBX'
            }
        }
    }

    if (typesObj[typeName]) {

        if (!typesObj[typeName].size) {
            // console.warn("------updating  typesObj: ", typeName)
            updateTypesData(typesObj, typeName)

        }

        return {
            dataType: typeName,
            size: typesObj[typeName].size || 0,
            coding: 'UDT',
            udtOrStruct: true,
        }; // user defined type found

    } else {
        // console.warn("!!!!  AHTUNG Type not found in typesObj: ", typeName)

        // console.log("!!!!  AHTUNG Type not found in typesObj: ", typeName)
        return null
    }
}