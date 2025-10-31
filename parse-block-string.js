const parseBlockString = (str) => {



    const checkComment = str.replace(/\{.*\}/g, "").split("//")
    // console.log("parseBlockString checkComment" , checkComment);
    const _comment = checkComment[1] ? checkComment[1] : null

    const checkDefValue = checkComment[0].split(":=")

    const _defaultValue = checkDefValue[1] ? checkDefValue[1].replace(/[\s+\;]/g, "") : null

    const checkType = checkDefValue[0].split(":")
    // obj.name = checkType[0].replace(/[\s+\;]/g, "")
    const _type = checkType[1].replace(/(\;|\")/g, "").trim()

    return {
        name: checkType[0].replace(/[\s+\;]/g, ""),
        data: {
            type: _type,
            defaultValue: _defaultValue,
            comment: _comment
        }
    }

}

module.exports = parseBlockString