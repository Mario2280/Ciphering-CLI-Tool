const {
    validationArgv,
    ValidationError
} = require('./myErrors');
const {
    MyWriteStream,
    MyReadStream,
    myTransformC,
    myTransformR,
    myTransformA,
} = require('./myCustomStream');
const path = require('path');
const {
    pipeline
} = require('stream');


let input, output, config, arrTransform = [];

function callback() {
    console.log('!Success!');
}

async function run() {
    pipeline(
        input,
        ...arrTransform,
        output,
        callback
    );
}

try {
    let map = validationArgv();

    map.forEach((val, key) => {
        switch (key) {
            case 'o':
                output = new MyWriteStream(path.resolve(process.argv[val + 1]));
                break;
            case 'i':
                input = new MyReadStream(path.resolve(process.argv[val + 1]));
                break;
            case 'c':
                config = process.argv[val + 1].split('-');
                break;
        }
    });

    if (!output) {
        output = process.stdout;
    }
    if (!input) {
        input = process.stdin;
        process.stdin.resume();
    }

    config.forEach((el, id, config) => {
        //C or R
        let encode;
        if (config[id].length == 2) {
            config[id][1] == '1' ? encode = true : encode = false;
            config[id][0] == 'C' ? arrTransform.push(new myTransformC(encode)) :
                arrTransform.push(new myTransformR(encode));
        } else {
            arrTransform.push(new myTransformA());
        }
    });

    run();

} catch (err) {
    if (err instanceof ValidationError) {
        process.stderr.write(err.message);
        process.stderr.write(`\nThe program exited with code = ${err.code}`);
        process.exit(err.code);
    }
}