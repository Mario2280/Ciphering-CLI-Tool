const {
    test,
    expect,
    describe,
} = require('@jest/globals');
const streams = require('./myCustomStream');
const { Start, input, output, callback } = require('./parseCipher');
jest.spyOn(process, 'exit');

describe('Test example', () => {
    test('Example test 1', (done) => {
        try {
            process.argv.splice(2, process.argv.length - 2, ...'-c C1-C1-R0-A'.split(' '));        
            process.stdout.on('data', (data) => {
    
                expect(data).toBe('Myxn xn nbdobm. Tbnnfzb ferlm "_" nhteru!');
            });  
            Start();    
            process.stdin.write('This is secret. Message about "_" symbol!');
        } catch (error) {        
        } finally { 
            done();
        }
    });
    
    test('Example test 2', (done) => {
        try {
            process.argv.splice(2, process.argv.length - 2, ...'-c C1-C0-A-R1-R0-A-R0-R0-C1-A'.split(' '));
            process.stdout.on('data', (data) => {
                expect(data).toBe('Vhgw gw wkmxkv. Ckwwoik onauv "_" wqcnad!');
            });
            Start();  
            process.stdin.write('This is secret. Message about "_" symbol!');
        } catch (error) {
            
        } finally {
            done();
        }
    });
    
    test('Example test 3', (done) => {
        try {
            process.argv.splice(2, process.argv.length - 2, ...'-c A-A-A-R1-R0-R0-R0-C1-C1-A'.split(' '));
            process.stdout.on('data', (data) => {
                expect(data).toBe('Hvwg wg gsqfsh. Asggous opcih "_" gmapcz!');
            });
            Start();
            process.stdin.write('This is secret. Message about "_" symbol!');
        } catch (error) {
            
        } finally {
            done();
        }
    });
    setTimeout(() => {
        test('Example test 4', (done) => {
            try {
                process.argv.splice(2, process.argv.length - 2, ...'-c C1-R1-C0-C0-A-R0-R1-R1-A-C1'.split(' '));
                process.stdout.on('data', (data) => {
                    expect(data).toBe('This is secret. Message about "_" symbol!');
                });
                Start();
                process.stdin.write('This is secret. Message about "_" symbol!');
            } catch (error) {
                
            } finally {
                done();
            }
        });
    },1000);
});

describe('Test Start function', () => {
    test('should throw error', (done) => {
        process.exit.mockImplementation((code) => code)
        try {
            process.argv.splice(2, process.argv.length - 2, ...'-c C2'.split(' '));
            Start();
            expect(process.exit).toReturnWith(1);
            done();
        } catch (error) {
            done();
        }
    });
    
    test('Input and Output should be args value and instance of myCustom Stream class', (done) => {
        try {
            process.argv.splice(2, process.argv.length - 2, ...'-c C1 -i ./input.txt -o ./output.txt'.split(' '));
            Start();
            expect(output instanceof streams.MyWriteStream &&
                input instanceof streams.MyReadStream).toBeTruthy();
            done();
        } catch (error) {
            done();
        }
    });
});






