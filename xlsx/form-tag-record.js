//const endOfRow = "Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False".split("\t")

const { END_OF_TAG_ROW, COLMNS_BEFORE_COMMENT, } = require('../constants')

module.exports = (tagName, typeInfo, currentName, offset, tagsArray) => {

    const lastTagsArrayIndex = tagsArray.length - 1
    const lastTag = tagsArray[lastTagsArrayIndex]
    
    
    const currentAdressInDb = typeInfo.dataType != 'Bool'
        ? offset.current
        : offset.bools > 7 ? offset.current + 1 : offset.current

    let currentAddress = `%DB${offset.dbIndex}.${typeInfo._db}${currentAdressInDb}`
    if (typeInfo.dataType === 'String' || typeInfo.dataType === 'ULInt'
        || typeInfo.dataType === 'LInt' || typeInfo.dataType === 'LReal'
        || typeInfo.dataType === 'Date_And_Time'
        || typeInfo.dataType === 'LTime' || typeInfo.dataType === 'LWord') {
        currentAddress += `.0`
    } // always start at byte boundary
    const tagRecord = [
        `${currentName.join('_')}_${tagName}`,
        // currentName.join('_'),
        offset.connectionId + '\\' + currentName[0] + '_' + offset.dbName,
        offset.connectionId,
        '<No Value>',
        typeInfo.dataType,
        typeInfo.dataType === 'String' ? typeInfo.size - 2 : typeInfo.size,
        typeInfo.coding,
        "Absolute access",
        currentAddress,
        ...COLMNS_BEFORE_COMMENT,//'False', '<No Value>', '<No Value>', 0, '<No Value>',
        '',//typeInfo.comment,
        ...END_OF_TAG_ROW

    ]
    if (typeInfo.dataType === 'Bool') {
        offset.bools++
        if (offset.bools === 16) {
            //DO SMTH TO ADD bite at the and of last bool adreses
            offset.current += 2
            offset.bools = 0
        }
    } else {
        if (offset.bools > 0) {
            //DO SMTH TO ADD bite at the and of last bool adreses
            offset.current += 2
        }
        offset.current += typeInfo.size
        offset.bools = 0

    }

    // console.log("####### new tag record", tagRecord);


    // return tagsArray.push(tagRecord)
    return tagRecord
}