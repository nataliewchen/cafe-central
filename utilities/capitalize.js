module.exports = (str) => {
    let capStr = str[0].toUpperCase(); // capitalize first char
    const len = str.length;
    for (let i=1; i<len; ++i) { // loop from second char to end
        if (str[i-1] === ' ') { // if previous character is a space
            capStr += str[i].toUpperCase(); // capitalize
        }
        else { // not after a space
            capStr += str[i]; // add letter
        }
    }
    return capStr;
}