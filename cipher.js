//Decode - false (0), Encode - true (1)
let fullalfabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let reversealfabetUpper = Array.from(fullalfabet).reverse().join('');
let reversealfabetLower = reversealfabetUpper.toLowerCase();
fullalfabet += fullalfabet.toLowerCase();
let alfSize = fullalfabet.length;
let retVal = '';
let isUpper = false;

function C(encode, data, offset) {
    retVal = '';
    (encode) ? null: offset = - offset;
    for (let el of data) {
        let index = fullalfabet.indexOf(el);
        if (index < 0) {
            retVal += el;
        } else {

            index = (alfSize + index + offset) % alfSize;
            (el === el.toUpperCase()) ? isUpper = true:
                isUpper = false;
            retVal += isUpper ?
                fullalfabet[index].toUpperCase() :
                fullalfabet[index].toLowerCase();
        }
    }
    return retVal;

}

function A(data) {
    let retVal = '';
    for (let el of data) {
        let index = reversealfabetUpper.indexOf(el);
        if (index < 0) {
            index = reversealfabetLower.indexOf(el);
            isUpper = false;
        } else {
            isUpper = true;
        }
        if (index < 0) {
            retVal += el;
        }
        if (index >= 0) {
            retVal += isUpper ?
                fullalfabet[index].toUpperCase() :
                fullalfabet[index].toLowerCase();
        }
    }
    return retVal;
}

module.exports = {
    C,
    A
};