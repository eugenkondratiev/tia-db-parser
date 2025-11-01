
const formElementToTagsArray = require('./form-element-to-tags-array')



module.exports = function formTagsArray(dbObject, currentName, connectionId) {
    const tagsArray = []
    const offset = { current: 0, bools: 0, dbIndex: dbObject.dnIndex, connectionId: connectionId }

    const { types, db, dbName } = dbObject
    currentName.push(dbName)
    offset.dbName = dbName
    
    console.log("###### formTagsArray", dbName, currentName.join('_'))
    // console.log(dbName,types,db);
    formElementToTagsArray(db, types, currentName, offset, tagsArray)

    // for (const [tagName, tagDef] of Object.entries(db)) {
    //     if (tagDef.isArray || tagDef.type && tagDef.type.match(/rray/)) {
    //         console.log("###WOW its array", tagName, tagDef.type);
    //     }
    //     else if (tagDef.type) {

    //         const typeInfo = getTypeInfo(tagDef.type, types)
    //         // if (tagDef.isStruct) { console.log("####struct  - "), tagName; }

    //         if (typeInfo) {
    //             console.log("---- tagDef", currentName.join('_'), tagName, tagDef, "typeInfo -", typeInfo);
    //         } else {
    //             console.log("----- ??????", tagName, tagDef.type, tagDef.isStruct);
    //         }

    //     }
    //     else {   ///   possibly struct.  may be array

    //         console.log("---- Struct", currentName.join('_'), tagName, Object.keys(tagDef));
    //         // console.log("[tagName, tagDef] of Object.entries(db)  -", tagName, tagDef);
    //     }
    // }

    currentName.pop() //dbName
    return [...tagsArray]

}
