const getTypeInfo = require('../datamap/get-type-data');
const parseArrayString = require('../parse-array-string');
const formTagRecord = require('./form-tag-record')

const formElementsToTagsArray = (element, types, currentName, offset, tagsArray) => {


    // console.log("------------------Object.entries(element) - ", Object.entries(element));



    for (const [_tagName, tagDef] of Object.entries(element)) {
        const tagName = String(_tagName).replace(/\_/g, "")

        // console.log("####Object.entries(element)  ##", currentName.join('_'), tagName, Object.entries(tagDef).map((entr) => `${entr[0]}:${entr[1] && entr[1].type}:${entr[1] && entr[1].isArray}`));

        // if (typeof tagDef != 'object') { continue }

        //  console.log("####Object.entries(element)  ##", currentName.join('_'), tagName, tagDef);
        if (tagDef && tagDef.isArray) {
            console.log(`######   isArray############
                ######   isArray############
                ######   isArray############
                ######   isArray############
                ######   isArray############
                ######   isArray############
                `, currentName.join('_'), tagName, tagDef.type)
        }
        if (tagDef && tagDef.type) {
            if (tagDef.type.match(/rray/)) { console.log("######", currentName.join('_'), tagName, tagDef.type) }
        } else {
            // console.log("######  WHERE IS THE TYPE", currentName.join('_'), tagName, Object.keys(tagDef));
        }
        if (tagDef && (tagDef.isArray || tagDef.type && tagDef.type.match(/truct/))) {
            console.log("%%%%%%%%%%%%% OOOPPPPA   %%%%%%%%%%%", tagName, tagDef);
        }

        if (tagDef && (tagDef.isArray || tagDef.type && tagDef.type.match(/rray/) || tagDef.dataType && tagDef.dataType.match(/rray/))) {

            const _type = tagDef.type || tagDef.dataType

            const arrTypeData = parseArrayString(_type)

            //TODO process array elements

            const typeInfoArray = getTypeInfo(arrTypeData.type, types)
            const currentArrayType = types[arrTypeData.type]


            console.log("###WOW its array", currentName.join('_'), tagName, tagDef, arrTypeData, typeInfoArray, _type, currentArrayType);

            // const arrInfo = parseArrayString(tagDef.type)
            // const typeInfoStruct = getTypeInfo(arrInfo.type, types)
            currentName.push(tagName)
            for (let index = arrTypeData.start; index <= arrTypeData.end; index++) {
                if (currentArrayType) {
                    currentName.push(index)

                    //recursive nesting
                    //console.log("--???????????????????????????????????????????????????????????????-- tagDef   typeInfoArray  --------------", currentName.join('_'), tagName, tagDef, "typeInfo -", typeInfoArray);
                    formElementsToTagsArray(currentArrayType, types, currentName, offset, tagsArray)

                    //???????????????????????????????????????????????????????????????

                    currentName.pop()
                } else {
                    //array of primitive type -    form tag
                    const newTagRecord = formTagRecord(index, typeInfoArray, currentName, offset, tagsArray)
                    // console.log('##### NEW TAG', newTagRecord);
                    tagsArray.push(newTagRecord)
                    console.log("00000000000000000000000   tagsArray     ", tagsArray.length);

                }
            }
            currentName.pop()

        }
        else if (tagDef && tagDef.type) {

            const typeInfo = getTypeInfo(tagDef.type, types)
            if (tagDef.isStruct) { console.log("####struct  - "), tagName; }

            if (typeInfo) {
                // console.log("---- tagDef  and typeInfo", currentName.join('_'), tagName, tagDef, "typeInfo -", typeInfo);

                if (typeInfo.udtOrStruct) {
                    //TODO process struct fields
                    currentName.push(tagName)
                    const currTypeObject = { ...types[typeInfo.dataType] }
                    if (currTypeObject) {
                        if (tagDef.type.match(/rray/)) { console.log("######    typeInfo.udtOrStruct  -------", currentName.join('_'), tagName, tagDef.type) }

                        formElementsToTagsArray(currTypeObject, types, currentName, offset, tagsArray)
                    } else {
                        console.log('AHTUNG in udt block. type NOT FOUND  ', tagName);
                        if (tagDef.type.match(/rray/)) { console.log("######  AHTUNG  typeInfo NO Struct /////////", currentName.join('_'), tagName, tagDef.type) }
                    }

                    currentName.pop()
                } else {
                    //primitive type, can form tag
                    if (tagDef.isArray) { console.log("##!##!NOOOOOO    primitive type   mast be isArray  parsed before  !!!/////////", currentName.join('_'), tagName, tagDef.type) }

                    if (tagDef.type.match(/rray/)) { console.log("##!##!primitive type   maz be array!!!/////////", currentName.join('_'), tagName, tagDef.type) }

                    const newTagRecord = formTagRecord(tagName, typeInfo, currentName, offset, tagsArray)
                    // console.log('##### NEW TAG', newTagRecord);
                    tagsArray.push(newTagRecord)


                    // console.log("00000000000000000000000   tagsArray     ", tagsArray.length);

                }
            } else {
                console.log("----- ??????", tagName, tagDef.type, tagDef.isStruct);
            }
        }
        else {   ///   possibly struct.  may be array
            if (typeof tagDef === 'object' && tagDef !== null) {
                // console.log("---- Struct", currentName.join('_'), tagName);
                // console.log("---- Struct", currentName.join('_'), tagName, Object.keys(tagDef));


                // console.log("[tagName, tagDef] of Object.entries(db)  -", tagName, tagDef);
                
                
                currentName.push(tagName)
                for (const [_tagNameStruct, _tagDefStruct] of Object.entries(tagDef)) {

                    const typeInfoStruct = getTypeInfo(_tagDefStruct.type, types)

                    // console.log('&&&&&&&&&&&&&&&&&&&&&&&', tagName, currentName.join('_'), '#### PROCESS STRUCT FIELD', _tagNameStruct, "   - object - ")//, _tagDefStruct, typeInfoStruct);



                    // console.log("##### type+info in struct ", tagName, _tagNameStruct, typeInfoStruct, currentName.join('_'));
                    // if (typeInfoStruct && (_tagDefStruct.type &&_tagDefStruct.type.match(/rray/) || _tagDefStruct.dataType &&_tagDefStruct.dataType.match(/rray/))) { console.log("######    _tagNameStruct  NO  tagDef.type STRUCT???? -------", currentName.join('_'), _tagNameStruct, _tagDefStruct.type, typeInfoStruct) }
                    if ((_tagDefStruct.type && _tagDefStruct.type.match(/rray/))) {
                        ;//    console.log("######    _tagNameStruct  NO  tagDef.type STRUCT???? -------", currentName.join('_'), _tagNameStruct, _tagDefStruct.type)//, typeInfoStruct)
                    }
                    if ((_tagDefStruct.dataType && _tagDefStruct.dataType.match(/rray/))) {
                        ; // console.log("#!##!#!##    _tagNameStruct !!!!!! NO  tagDef._tagDefStructSTRUCT???? -------", currentName.join('_'), _tagNameStruct, _tagDefStruct.type)//, typeInfoStruct)
                    }

                    if (typeInfoStruct) {
                        if (typeInfoStruct.udtOrStruct) {
                            currentName.push(_tagNameStruct)

                            const currStructObject = { ...types[typeInfoStruct.dataType] }
                            if (currStructObject) {
                                formElementsToTagsArray(currStructObject, types, currentName, offset, tagsArray)
                            } else {
                                console.log('AHTUNG in struct block type NOT FOIND', tagName, _tagNameStruct);
                            }

                            currentName.pop()

                            // formElementsToTagsArray(_tagDefStruct, types, currentName, offset, tagsArray)
                            // } else if (typeInfoStruct.isArray) {
                            //     console.log('&&&#### PROCESS STRUCT FIELD&&&', tagName, currentName.join('_'), _tagNameStruct, "   - object - ",
                            //         _tagDefStruct, typeInfoStruct.isArray, typeInfoStruct.arrayStart, typeInfoStruct.arrayEnd);

                            // }
                        } else {
                            //primitive type, can form tag
                            const newTagRecord = formTagRecord(_tagNameStruct, typeInfoStruct, currentName, offset, tagsArray)

                            // console.log('##### NEW TAG', newTagRecord);

                            tagsArray.push(newTagRecord)

                            // console.log("00000000000000000000000   tagsArray     ", tagsArray.length);

                        }

                    }
                    else {  ///    process aray of type or struct
                        // console.log('&ELSE ELSE ELSE ELSE &&#### PROCESS STRUCT FIELD&&&', tagName, currentName.join('_'), _tagNameStruct, "   - object - ",
                        //     _tagDefStruct, _tagDefStruct.isArray, _tagDefStruct.arrayStart, _tagDefStruct.arrayEnd);

                        if (_tagDefStruct.isArray) {
                            //array of struct

                            for (let index = _tagDefStruct.arrayStart; index <= _tagDefStruct.arrayEnd; index++) {
                                // const element = array[index];
                                currentName.push(`${_tagNameStruct}_${index}`)

                                // console.log('//array of struct, ', currentName.join('_'), 'SOME Srtuct');

                                //TOTDO process struct fields!!!!!!!!!!!!!!!
                                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!s



                                formElementsToTagsArray(_tagDefStruct, types, currentName, offset, tagsArray)

                                currentName.pop()
                            }
                        } else {
                            //Struct of some type 
                            if (_tagDefStruct && _tagDefStruct.type) {
                                const arrInfo = parseArrayString(_tagDefStruct.type)
                                const typeInfoStruct = getTypeInfo(arrInfo.type, types)

                                // console.log('//array of some type, ', currentName.join('_'), arrInfo);
                                for (let index = arrInfo.start; index <= arrInfo.end; index++) {
                                    // const element = array[index];
                                    currentName.push(_tagNameStruct)
                                    // currentName.push(`${_tagNameStruct}_${index}`)
                                    // console.log('//```````//array of some type, ', currentName.join('_'), arrInfo.type, index);


                                    if (types[arrInfo.type]) {
                                        // console.log("types[arrInfo.type]   - ", types[arrInfo.type]);
                                    }
                                    // console.log('//```````//array of some type, ', currentName.join('_'), arrInfo.type, index, types[arrInfo.type]);
                                    if (types[arrInfo.type]) {  // struct type -   recursive processing
                                        // console.log('//`###### recurrent``````//array of some type, ', currentName.join('_'), arrInfo.type, index);

                                        //  formElementsToTagsArray(arrInfo.type, types[arrInfo.type], currentName, offset, tagsArray)
                                        currentName.push(index)

                                        formElementsToTagsArray(types[arrInfo.type], types, currentName, offset, tagsArray)
                                        currentName.pop()
                                    } else {  /// elementary type
                                        const newTagRecord = formTagRecord(index, typeInfoStruct, currentName, offset, tagsArray)
                                        tagsArray.push(newTagRecord)
                                        console.log("00000000000000000000000   tagsArray     ", tagsArray.length);

                                    }
                                    currentName.pop()
                                }
                            } else {
                                console.log('*-*-*-*-*-*-*-*-*-REAALLY  STRUCT  ', tagName, _tagNameStruct, Object.keys(_tagDefStruct));

                                currentName.push(_tagNameStruct)

                                formElementsToTagsArray(_tagDefStruct, types, currentName, offset, tagsArray)

                                currentName.pop()

                            }
                        }

                        // console.log("----- ?????? in struct", tagName, _tagDefStruct.type, _tagDefStruct.isStruct);
                    }
                }
                currentName.pop()


            }
        }

    }
}
module.exports = formElementsToTagsArray