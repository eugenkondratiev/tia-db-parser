module.exports = function updateTypesObject(typesObj, typeName) {
    let _size = 0

    if (typesObj[typeName]) {
        const typeDef = typesObj[typeName]
        for (const [key, value] of Object.entries(typeDef)) {
            // console.log('updateTypesObject', key, value);
        }
    } else {
        // console.warn("!!!!  AHTUNG ---updateTypesObject ---Type not found WTFFFFF: ", typeName)
    }

}