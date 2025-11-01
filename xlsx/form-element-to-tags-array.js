const getTypeInfo = require('../datamap/get-type-data')
const formTagRecord = require('./form-tag-record')

const formElementsToTagsArray = (element, types, currentName, offset, tagsArray) => {

    for (const [tagName, tagDef] of Object.entries(element)) {
        if (tagDef.isArray || tagDef.type && tagDef.type.match(/rray/)) {
            console.log("###WOW its array", tagName, tagDef.type);
        }
        else if (tagDef.type) {

            const typeInfo = getTypeInfo(tagDef.type, types)
            // if (tagDef.isStruct) { console.log("####struct  - "), tagName; }

            if (typeInfo) {
                // console.log("---- tagDef", currentName.join('_'), tagName, tagDef, "typeInfo -", typeInfo);
                if (typeInfo.udtOrStruct) {
                    //TODO process struct fields
                    currentName.push(tagName)
                    const currTypeObject = { ...types[typeInfo.dataType] }
                    if (currTypeObject) {

                        formElementsToTagsArray(currTypeObject, types, currentName, offset, tagsArray)
                    } else {
                        console.log('AHTUNG in udt block. type NOT FOIND  ', tagName);
                    }

                    currentName.pop()
                } else {
                    //primitive type, can form tag
                    const newTagRecord = formTagRecord(tagName, typeInfo, currentName, offset, tagsArray)
                    // console.log('##### NEW TAG', newTagRecord);
                    tagsArray.push(newTagRecord)

                }
            } else {
                console.log("----- ??????", tagName, tagDef.type, tagDef.isStruct);
            }

        }
        else {   ///   possibly struct.  may be array

            console.log("---- Struct", currentName.join('_'), tagName, Object.keys(tagDef));
            // console.log("[tagName, tagDef] of Object.entries(db)  -", tagName, tagDef);
            currentName.push(tagName)
            for (const [_tagNameStruct, _tagDefStruct] of Object.entries(tagDef)) {
                console.log(tagName, currentName.join('_'), '#### PROCESS STRUCT FIELD', _tagNameStruct, "   - object - ", _tagDefStruct);

                const typeInfoStruct = getTypeInfo(_tagDefStruct.type, types)
                console.log("##### type+info in struct ", tagName, _tagNameStruct, typeInfoStruct);
                if (typeInfoStruct) {
                    if (typeInfoStruct.udtOrStruct) {

                        const currStructObject = { ...types[typeInfoStruct.dataType] }
                        if (currStructObject) {

                            formElementsToTagsArray(currStructObject, types, currentName, offset, tagsArray)
                        } else {
                            console.log('AHTUNG in struct block type NOT FOIND', tagName, _tagNameStruct);
                        }
                        // formElementsToTagsArray(_tagDefStruct, types, currentName, offset, tagsArray)
                    } else {
                        //primitive type, can form tag
                        const newTagRecord = formTagRecord(_tagNameStruct, typeInfoStruct, currentName, offset, tagsArray)
                        // console.log('##### NEW TAG', newTagRecord);
                        tagsArray.push(newTagRecord)
                    }

                }
                else {
                    console.log("----- ?????? in struct", tagName, _tagDefStruct.type, _tagDefStruct.isStruct);
                }
            }

            currentName.pop()
        }

    }
}
module.exports = formElementsToTagsArray