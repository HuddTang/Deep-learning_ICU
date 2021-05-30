const abbr = function(s, length=4){
    // length = 4;
    if(s.length>length){
        return s.slice(0,length)+"..";
    }else{
        return s
    }
    return "";
}

export default abbr;