const {
    test,
    expect,
    describe,
    beforeEach
} = require('@jest/globals');
const {
    A,
    C
} = require('./cipher.js');
let result;

beforeEach(() => result = '');

describe('Cipher Test', () => {
    test('Altbash test', () => {
        result = A(`This is secret. Message about "_" symbol!`);
        expect(result).toBe(`Gsrh rh hvxivg. Nvhhztv zylfg "_" hbnylo!`);
    });
    test('Caesar test encode', () => {
        result = C(true, `This is secret. Message about "_" symbol!`, 1);
        expect(result).toBe(`Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!`);
    });
    test('Caesar test decode', () => {
        result = C(false, `Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!`, 1);
        expect(result).toBe(`This is secret. Message about "_" symbol!`);
    });
    test('ROT-8 test encode', () => {
        result = C(true, `This is secret. Message about "_" symbol!`, 8);
        expect(result).toBe(`Bpqa qa amkzmb. Umaaiom ijwcb "_" agujwt!`);
    });
    test('ROT-8 test decode', () => {
        result = C(false, `Bpqa qa amkzmb. Umaaiom ijwcb "_" agujwt!`, 8);
        expect(result).toBe(`This is secret. Message about "_" symbol!`);
    });

});