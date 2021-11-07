const {
    Readable,
    Writable,
    Transform,
} = require('stream');
const fs = require('fs');

class MyReadStream extends Readable {
    constructor(filename, options = {}) {
        super(options);
        this.filename = filename;
        this.fd = null;
    }
    _construct(callback) {
        fs.open(this.filename, 'r', (err, fd) => {
            if (err) {
                callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }
    _read(n) {
        let buf = Buffer.alloc(n, 0, 'utf8');
        fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
            if (err) {
                this.destroy(err);
            } else {
                this.push(
                    bytesRead > 0 ? buf.slice(0, bytesRead) : null
                );

            }
        });
    }
    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}

class MyWriteStream extends Writable {
    constructor(filename) {
        super();
        this.filename = filename;
    }
    _construct(callback) {
        fs.open(this.filename, 'a', (err, fd) => {
            if (err) {
                callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }
    _write(chunk, encoding, callback) {
        fs.write(this.fd, chunk, callback);
    }
    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}

class myTransform extends Transform {

    constructor(funcAndArgsObj, options = {}) {
        options = Object.assign({}, options, {
            decodeStrings: false
        });
        super(options);
        this.funcAndArgsObj = funcAndArgsObj;
    }

    _transform(chunk, encoding, callback) {


        this.push(chunk.toUpperCase());
        callback();
    }
}

module.exports = {
    MyWriteStream,
    MyReadStream,
}