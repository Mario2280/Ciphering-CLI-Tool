const path = require('path');
const fs = require('fs');

//Не совсем понял что подразумевалось
//под пользовательскими ошибками так что добавил
//эту однотипную фигню не обессудьте вас ждёт говнокод
class ValidationError extends Error {
    constructor(message) {
        Error.stackTraceLimit = 1;
        super(message);
        this.name = this.constructor.name;
        this.code = 1;
    }
}

class ArgRequiredError extends ValidationError {
    constructor(Arg) {
        super(`Required argument missing: ${Arg}`);
    }
}

class RepeatingOptionsError extends ValidationError {
    constructor(Arg) {
        super(`The option ${Arg} is duplicated`);
    }
}

class ExtraArgumentsError extends ValidationError {
    constructor(Args) {
        if(Args.length == 0){
            super(`Some options have not values`);
        } else{
            super(`Invalid arguments found: ${Args.splice(0,3)}`);
        }        
    }
}

class InvalidConfigError extends ValidationError {
    constructor(someData) {
        super(`Config set incorrectly: ${someData}`);
    }
}
// Search and validation option headers
function validationArgv() {
    let map = new Map();
    let argCount = 0;
    const cipherSequenceValidation = /(C1|C0|R1|R0|A)((-C1|-C0|-R1|-R0|-A))*\s/gm;
    //Поиск всех опций и вынесение их в мап
    process.argv.forEach((item, id) => {

        if (item === "-c" || item === "--config") {
            if (map.has("c")) {
                throw new RepeatingOptionsError('CONFIG');
            } else {
                map.set("c", id);
                argCount += 1;
            }
        }

        if (item === "-i" || item === "--input") {
            if (map.has("i")) {
                throw new RepeatingOptionsError("INPUT");
            } else {
                map.set("i", id);
                argCount += 1;
            }
        }

        if (item === "-o" || item === "--output") {
            if (map.has("o")) {
                throw new RepeatingOptionsError("OUTPUT");
            } else {
                map.set("o", id);
                argCount += 1;
            }
        }
    });
    if (!map.has('c')) {
        throw new ArgRequiredError('CONFIG');
    }
    //Костыль на отсев лишних аргументов
    if (argCount * 2 != process.argv.length - 2) {
        let tempArr = [],
            extraArg = [];
        for (let el of map.values()) {
            tempArr.push(el, el + 1);
        }
        process.argv.forEach((item, id) => {
            if (id == 0 || id == 1) {
                return;
            }
            if (!tempArr.includes(id)) {
                extraArg.push(item);
            }

        });
        throw new ExtraArgumentsError(extraArg);
    }
    //Проверка значений опций
    map.forEach((value, key) => {
        let arg = process.argv[map.get(key) + 1];
        if (key == "o" || key == "i") {
            if (fs.existsSync(arg)) {
                if (path.extname(arg) != ".txt") {
                    //Логика перенаправления вывода
                } else {
                    throw new Error("This is not a file");
                }
            } else {
                throw new Error("Invalid path");
            }
        } else {
            //Регулярочка с пробелом в конце(костыль - не знал как без пробела)
            if (`${arg} `.match(cipherSequenceValidation) == null) {
                throw new InvalidConfigError(arg);
            }
        }


    });
}

module.exports = {
    validationArgv,
    ValidationError,
    ArgRequiredError,
    RepeatingOptionsError,
    ExtraArgumentsError,
    InvalidConfigError
};

//Надо вынести логику