//const endOfRow = "Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False".split("\t")

const { END_OF_TAG_ROW, COLMNS_BEFORE_COMMENT, CYCLE, CPU_PREFIX } = require('../constants')

module.exports = (tagName, typeInfo, currentName, offset, tagsArray) => {
    // const tagName = String(_tagName).replace(/\_/g, "")
    console.log("fffffffffffffffffffff-tagrecord", typeInfo);

    const lastTagsArrayIndex = tagsArray.length ? tagsArray.length - 1 : 0
    const lastTag = tagsArray[lastTagsArrayIndex]

    const currentStructName = currentName.length > 0 ? String(currentName[currentName.length - 1]) : null
    const lastTagNameParts = lastTag && lastTag[0] ? lastTag[0].split('_') : []

    const lastStructName = lastTagNameParts.length > 1 ? String(lastTagNameParts[lastTagNameParts.length - 2]) : null

    // let lastStructName = null //= lastTag ? [...lastTag[0]].pop() : null
    // if (lastTag && lastTag[0] && lastTagsArrayIndex > 0) {
    //     const lastTagFullName = lastTag[0]

    //     const lastTagNameParts = lastTagFullName.split('_')

    //     lastTagNameParts.pop()

    //     // lastStructName = lastTagNameParts.pop()

    //     lastStructName = lastTagNameParts.length ? lastTagNameParts[lastTagNameParts.length - 1] : null

    // }
    if (currentStructName != lastStructName) {
        console.log("$$$$$$$$$$$$$$$$$$$$$  lastStructName  ", lastStructName, lastTag && lastTag[0], "currentStructName  ", currentStructName, currentName.join('_'));
    }

    const lastTagIsBool = lastTag ? lastTag[4] === 'Bool' : false
    const lastTagIsOneByte = lastTag ? lastTag[4] === 'Byte' || lastTag[4] === 'Char' : false


    function updateLastBoolTags(numberOfBools) {
        try {
            for (let i = 1; i <= numberOfBools; i++) {
                const currentBit = i > 8 ? i - 9 : i - 1
                const currentIndex = lastTagsArrayIndex - numberOfBools + i
                console.log("lastTagsArrayIndex", lastTagsArrayIndex, "   numberOfBools   ", numberOfBools, "  current indeks - ", currentIndex, " i=", i, " currentBit ", currentBit);
                tagsArray[currentIndex][8] += `.${currentBit}`


            }
        } catch (error) {
            console.error("!**************>?>?>?>?>?>?>?>?>?>?>!!!!!  updateLastBoolTags error  ", error, numberOfBools, lastTagsArrayIndex, tagsArray);
        }

    }
    let currentAdressInDb

    if ((currentStructName != lastStructName) && lastTagIsBool) {
        //new struct element + reset bool offset
        if (lastTagIsBool) {
            offset.current += 2
            updateLastBoolTags(offset.bools)
            offset.bools = 0
        }
        if (lastTagIsOneByte && offset.current % 2) {
            offset.current += 1
        }

        currentAdressInDb = offset.current

        offset.bools = 0

    } else {
        if (typeInfo.dataType == 'Bool') {

            if (offset.bools == 16) {
                offset.current += 2
                updateLastBoolTags(offset.bools)
                offset.bools = 0
            }

            currentAdressInDb = lastTagIsBool
                ? offset.bools > 7 ? offset.current + 1 : offset.current
                : offset.current
        }
        else {
            if (lastTagIsBool) {
                offset.current += 2
                updateLastBoolTags(offset.bools)
                // offset.bools = 0
            }
            currentAdressInDb = offset.current
            offset.bools = 0
        }
    }

    // const currentAdressInDb = typeInfo.dataType != 'Bool'
    //     ? offset.current
    //     : lastTagIsBool
    //         ? offset.bools > 7 ? offset.current + 1 : offset.current
    //         : offset.current



    // : offset.bools > 7 ? offset.current + 1 : offset.current

    let currentAddress = `%DB${offset.dbIndex}.${typeInfo._db}${currentAdressInDb}`
    // let currentAddress = `%DB${offset.dbIndex}.${typeInfo._db}${currentAdressInDb}${currentStructName != lastStructName && typeInfo.dataType == 'Bool' ? lastStructName : ""}`
    if (typeInfo.dataType === 'String' || typeInfo.dataType === 'ULInt'
        || typeInfo.dataType === 'LInt' || typeInfo.dataType === 'LReal'
        || typeInfo.dataType === 'Date_And_Time'
        || typeInfo.dataType === 'LTime' || typeInfo.dataType === 'LWord') {
        currentAddress += `.0`
    } // always start at byte boundary
    const tagRecord = [
        `${currentName.join('_')}_${tagName}`,
        // currentName.join('_'),
        offset.connectionId + '\\' + CPU_PREFIX + '_' + offset.dbName,
        offset.connectionId,
        '<No Value>',
        typeInfo.dataType,
        typeInfo.dataType === 'String' ? typeInfo.size - 2 : typeInfo.size,
        typeInfo.coding,
        "Absolute access",
        currentAddress,
        ...COLMNS_BEFORE_COMMENT,//'False', '<No Value>', '<No Value>', 0, '<No Value>',
        typeInfo.comment || '',
        'Cyclic in operation',
        CYCLE,
        ...END_OF_TAG_ROW

    ]



    offset.comment = ''


    if (typeInfo.dataType === 'Bool') {
        offset.bools++
    } else {
        offset.current += typeInfo.size
        offset.bools = 0

    }

    // if (typeInfo.dataType === 'Bool') {
    //     offset.bools++
    //     if (offset.bools === 16) {
    //         //DO SMTH TO ADD bite at the and of last bool adreses
    //         offset.current += 2
    //         offset.bools = 0
    //     }
    // } else {
    //     if (offset.bools > 0) {
    //         //DO SMTH TO ADD bite at the and of last bool adreses
    //         offset.current += 2
    //     }
    //     offset.current += typeInfo.size
    //     offset.bools = 0
    // }

    // console.log("####### new tag record", tagRecord);


    // return tagsArray.push(tagRecord)
    return tagRecord
}