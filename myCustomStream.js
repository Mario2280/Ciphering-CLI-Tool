const { Readable, Writable, Transform } = require('stream');
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
      let buf = Buffer.alloc(n,0,'utf8');
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


class myWriteStream extends Writable {
    constructor(filename) {
        super();
        this.filename = filename;
      }
      _construct(callback) {
        fs.open(this.filename, 'a',  (err, fd) => {
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

    constructor(funcAndArgsObj, options = {}){
        options = Object.assign({}, options, {
            decodeStrings: false
        });
        super(options);
        this.funcAndArgsObj = funcAndArgsObj;
    }

    _transform(chunk, encoding, callback){
        
       
        this.push(chunk.toUpperCase());
        callback();
    }
}


//Decode - false (0), Encode - true (1)
let fullalfabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let reversealfabetUpper = Array.from(fullalfabet).reverse().join('');
let reversealfabetLower = reversealfabetUpper.toLowerCase();
fullalfabet += fullalfabet.toLowerCase();
let alfSize = fullalfabet.length;
let retVal = '';
let isUpper = false;
//Decode - true, Encode -false
function C(encode, data, offset){
    retVal = '';
    (encode) ? null : offset = - offset;
    for(let el of data) {
        let index = fullalfabet.indexOf(el);
        if(index < 0){
            retVal+= el;
        } else{
            
            index = (alfSize + index + offset) % alfSize;
            (el === el.toUpperCase()) ? isUpper = true :
            isUpper = false;
            retVal+= isUpper ?
            fullalfabet[index].toUpperCase() :
            fullalfabet[index].toLowerCase();
        }
    }
    return retVal;
    
}
function A(data){
    let retVal = '';
    for(let el of data){
        let index = reversealfabetUpper.indexOf(el);
        if(index < 0){
            index = reversealfabetLower.indexOf(el);
            isUpper = false;
        } else {
            isUpper = true;
        }
        if(index < 0){
            retVal+= el;
        }
        if(index >= 0){
            retVal+= isUpper ?
            fullalfabet[index].toUpperCase() :
            fullalfabet[index].toLowerCase();
        }
    }
    return retVal;
}
let qwe = C(true,'This is secret. Message about "_" symbol!',1);
let C1C1 = C(true,qwe,1);
let R0 = C(false,C1C1,8);


console.log(A(R0));


