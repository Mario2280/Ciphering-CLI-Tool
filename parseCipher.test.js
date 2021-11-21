const {
    test,
    expect,
    describe,
    afterEach,
    //jest,
} = require('@jest/globals');

const { Start } = require('./parseCipher');
jest.spyOn(process, 'exit');
test('Test index file', (done) => {
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

test('Test index file', (done) => {
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

test('Test index file', (done) => {
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
    test('Test index file', (done) => {
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

test('should throw error', (done) => {
    process.exit.mockImplementation((code) => true)
    try {
        process.argv.splice(2, process.argv.length - 2, ...'-c C2'.split(' '));
        Start();
        expect(process.exit).toReturnWith(true);
        done();
    } catch (error) {
        done();
    } finally{
        process.exit.mockRestore();
    }
});




