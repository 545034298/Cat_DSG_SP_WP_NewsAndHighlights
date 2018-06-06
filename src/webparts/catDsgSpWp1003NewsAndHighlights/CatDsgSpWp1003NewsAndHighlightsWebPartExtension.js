String.prototype.byteLength = function () {
    var str = this, length = str.length;
    for (var i in str) {
        if (str.hasOwnProperty(i)) {
            var isDoubleByte = str[i].charCodeAt(0).toString(16).length == 4;
            if (isDoubleByte) length += 1;
        }
    }
    return length;
};
String.prototype.truncateString = function (limit) {
    var str = this, length = 0, truncatedString = "";
    for (var i in str) {
        length += 1;
        if (str.hasOwnProperty(i)) {
            var isDoubleByte = str[i].charCodeAt(0).toString(16).length == 4;
            if (isDoubleByte) length += 1;
            if (length <= limit) {
                truncatedString += str[i];
            }
            else {
                break;
            }
        }
    }
    return truncatedString;
};