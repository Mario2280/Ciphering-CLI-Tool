const {
    validationArgv
} = require('./myErrors');
const {
    MyWriteStream,
    MyReadStream,
    myTransform
} = require('./myCustomStream');
const {
    C,
    A
} = require('./cipher');
const path = require('path');
const {
    pipeline
} = require('stream');
let map = validationArgv();
let input, output, config, arrTransform = [];
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
})

if (!output) {
    output = process.stdout;
}
if (!input) {
    input = process.stdin;
    process.stdin.resume();
}
class ConfigClass {
    constructor(encoding, offset, transform) {
        this.encoding = encoding;
        this.offset = offset;
        this.transform = transform;
    }
}

config.forEach((el, id, config) => {
    //C or R
    if (config[id].length == 2) {
        arrTransform.push(new myTransform(new ConfigClass(el[1] == '1' ? true : false, el[0] == 'C' ? 1 : 8, C)));
    } else {
        arrTransform.push(new myTransform(new ConfigClass(null, null, A)));
    }
})

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
run();