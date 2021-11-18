const {
    test,
    expect,
    describe
} = require('@jest/globals');
const {
    validationArgv,
    ValidationError,
    checkPath
} = require('./myErrors');
const fs = require('fs');
//fs.stat = jest.fn().mockReturnValue(ValidationError);
// const statMock = jest.spyOn(fs,'stat').mockImplementation(() => {
//         throw new ValidationError();
//       });
let i = 0;
let arrTestValue = [
    '-c C1-R1 -c',
    '-c C1 -i --input',
    '-c C1 -i ./1.txt -o',
    '-c A -o -o',
    '-i -o',
    '-c A asdfg sdffd',
    '-c A -i ./asd.txt',
    '-c A1-C1-R1',
    '-c Aasdsad',
];
let caseArr = [];


describe('function validationArgv ', () => {

    test('function checkPath', ()=>{
        expect(()=>{
            //statMock.mockReturnValue(new ValidationError());
            checkPath('D:\\RS-SCHOOL\\Ciphering CLI Tool\\someFolder');
        }).toThrowError(ValidationError);
        // statMock.mockRestore();
        // fs.stat.mockImplementation(() => {
        //     throw new ValidationError();
        //   });
    });
    for (let el of arrTestValue) {
        caseArr.push([el, ValidationError]);
    }  
    test.each(caseArr)('Test all ValidationErrors', () => {
        if(i < arrTestValue.length){
            process.argv.splice(2, process.argv.length - 2, ...caseArr[i++][0].split(' '));
        }
        expect(() => {
            validationArgv();
        }).toThrowError(ValidationError);
    });

    test('return value', () => {
        process.argv.splice(2, process.argv.length - 2, ...'-c C1-A-R0 -i ./myErrors.js'.split(' '));
        let result = validationArgv();

        expect(Object.fromEntries(result)).toStrictEqual({
            c: 2,
            i: 4
        });
    });

});