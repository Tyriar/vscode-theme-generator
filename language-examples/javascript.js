// An exceptionally useful comment
function func(param) {
    var text = 'string';
    for (var i = 0; i < param.length; i++) {
        text += i;
    }
    var number = 0;
    var templateLiterals = `a ${text} b ${1 + 2} c`;
    var escapes = 'line 1\nline 2';
    return {
        "text": text,
        "boolean": false,
        "number": 231
    };
}
