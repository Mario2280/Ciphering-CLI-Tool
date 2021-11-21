const {
    test,
    expect,
    describe,
    afterEach
    //jest,
} = require('@jest/globals');
const fs = require('fs');
jest.spyOn(fs, 'open');
jest.spyOn(fs, 'closeSync');
jest.spyOn(fs, 'write');
jest.spyOn(fs, 'read');

const streams = require('./myCustomStream');

let StreamRight, SrteamError;
let res;
afterEach(() => {
    StreamRight = null;
    SrteamError = null;
});

describe('Test Writable ', () => {
    test('should attach a descriptor of the opened file to the property "fd", open, write, close Stream', (done) => {
        fs.open.mockImplementation((path, mode, cb) => {
            cb(null, 3);
        });
        fs.closeSync = jest.fn((fd) => undefined);
        fs.write.mockImplementation((fd, encoding, cb) => {
            cb();
        });
        StreamRight = new streams.MyWriteStream('./myCustomStream.js');
        StreamRight.on('finish', () => {
            try {
                expect(fs.open).toBeCalledTimes(1);
                expect(fs.write).toBeCalledTimes(1);
                expect(StreamRight.fd).toBe(3);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            } finally {
                fs.open.mockClear();
                fs.write.mockClear();
                
            }
        });
        StreamRight.end(' ');
        StreamRight.on('close', () => {
            try {
                expect(fs.closeSync).toBeCalledWith(3);
            } catch (error) {
                throw error;
            } finally{
                fs.closeSync.mockClear();
            }
        });
    
    });
    
    test('should throw an errors', (done) => {
        fs.open.mockImplementation((path, mode, cb) => {
            cb(new Error('TEST ERROR'), null);
        });
        SrteamError = new streams.MyWriteStream('./myCustomStream.js');
        SrteamError.on('error', () => {
            try {
                expect(fs.open).toBeCalledTimes(1);
                expect(fs.open).toThrow();
                done();
            } catch (error) {
                console.log(error);
                done(error);
            } finally {
                fs.open.mockClear();         
            }
        });
    });
});

describe('Test Readable', () => {
    test('should attach a descriptor of the opened file to the property "fd", open, read Stream',(done)=>{
        fs.open.mockImplementation((path, mode, cb) => {
            cb(null, 5);
        });
        //fs.closeSync = jest.fn((fd) => undefined);
        fs.read.mockImplementation((fd, buf, a, b, c, cb) => {
            cb(null, 1);
        });
        StreamRight = new streams.MyReadStream('./myCustomStream.js');
        StreamRight.on('resume', () => {
            try {
                expect(fs.open).toBeCalledTimes(1);
                expect(fs.read).toBeCalledTimes(1);
                expect(StreamRight.fd).toBe(5);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            } finally {
                fs.read.mockRestore();     
            }
        });
        StreamRight.resume();
        StreamRight.pause();
        StreamRight.emit('close');
    });

    test('should throw error', (done) => {
        fs.open.mockImplementation((path, mode, cb) => {
            cb(new Error('TEST'), null);
        });
        //fs.closeSync = jest.fn((fd) => undefined);
        StreamError = new streams.MyReadStream('./myCustomStream.js');
        StreamError.on('close', () => {
            try {
                expect(fs.open).toBeCalledTimes(1);
                expect(fs.open).toThrow();
                done();
            } catch (error) {
                console.log(error);
                done(error);
            } finally {
                //fs.open.mockRestore();
                fs.open.mockRestore();                
            }
        });
        StreamError.resume();
        StreamError.pause();
        StreamError.emit('close');
    });
});

describe('Test Transform Altbash, Caesar, ROT-8', ()=>{
    test('Test correct transform', () => {
        StreamRight = new streams.myTransformA();
        StreamRight.write('ABC_!');
        res = StreamRight.read(5).toString('utf8');
        expect(res).toBe('ZYX_!');
    });

    test('Test correct transform', () => {
        StreamRight = new streams.myTransformC(true);
        StreamRight.write('ABC_!');
        res = StreamRight.read(5).toString('utf8');
        expect(res).toBe('BCD_!');
    });

    test('Test correct transform', () => {
        StreamRight = new streams.myTransformR(true);
        StreamRight.write('ABC_!');
        res = StreamRight.read(5).toString('utf8');
        expect(res).toBe('IJK_!');
    });
});

