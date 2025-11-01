const endOfRow = "Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False".split("\t")


module.exports = (tagName, typeInfo, currentName, offset, tagsArray) => {

    let currentAddress = `%DB${offset.dbIndex}.${typeInfo._db}${offset.current}`

    const tagRecord = [
        `${currentName.join('_')}_${tagName}`,
        offset.connectionId + '\\' + currentName[0] + '_' + offset.dbName,
        offset.connectionId,
        '<No Value>',
        typeInfo.dataType,
        typeInfo.size,
        typeInfo.coding,
        "Absolute access",
        currentAddress,
        'False', '<No Value>', '<No Value>', 0, '<No Value>',
        '',//typeInfo.comment,
        ...endOfRow

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
        }
        offset.current += typeInfo.size
        offset.bools = 0

    }

    console.log("####### new tag record", tagRecord);
    // return tagsArray.push(tagRecord)
    return tagRecord
}