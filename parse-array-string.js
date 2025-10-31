const parseArrayString=(arrayString) => {
    if (typeof arrayString !== 'string') {return null;}
   
       const checkComment = arrayString.split("//")
    const _comment = checkComment[1] ? checkComment[1] : null


    const getType = checkComment[0].split('of');
    const _type = getType[1].trim().replace('\"','');

    const [_start,_end] = getType[0].match(/\[(.*?)\]/)[1].split('..');

    return {
        type:_type,
        start:+_start,
        end:+_end,
        comment:_comment
    }

}

module.exports = parseArrayString;
