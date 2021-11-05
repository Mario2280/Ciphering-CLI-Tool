const path = require('path');
const fs = require('fs');
const cipherSequenceValidation = /(C1|C0|R1|R0|A)((-C1|-C0|-R1|-R0|-A))*/gm;

class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        this.code = 1;
    }
}

class ArgRequiredError extends ValidationError {
    constructor(Arg){
        super(`Отсутствует обязательный аргумент: ${Arg}`);
            this.Arg = Arg;
    }
}

// Search and validation option headers
function validationArgv(){
    let map = new Map();
    map.set('argCount', 0);    
    
    process.argv.forEach((item, id) => {
        
        if(item ==="-c" || item ==="--config"){
            if(map.has("c")){
                throw new Error("Много конфигов");
            } else {
                map.set("c", id);
                map.set('argCount', map.get('argCount') + 2);
            }
        }

        if(item ==="-i" || item ==="--input"){
            if(map.has("i")){
                throw new Error("Много опций ввода");
            } else {
                map.set("i", id);
                map.set('argCount', map.get('argCount') + 2);
            }
        }

        if(item ==="-o" || item ==="--output"){
            if(map.has("o")){
                throw new Error("Много опций вывода");
            } else {
                map.set("o", id);
                map.set('argCount', map.get('argCount') + 2);
            }
        }    
    });
    if(map.get('argCount') != process.argv.length - 2){
        throw new Error("Обнаружены нераспознанные аргументы");
    }
    map.delete('argCount');
    map.forEach((value,key) => {
        let arg = process.argv[map.get(key) + 1];
        if(key == "o" || key == "i"){           
            if(fs.existsSync(arg)){
                if(path.extname(arg) != ".txt"){
                    //Логика перенаправления вывода
                } else{
                    throw new Error("Не текстовый файл");
                }
            } else {
                throw new Error("НЕверный путь");
            }
        }   else{
            if(arg.match(cipherSequenceValidation) == null){
                throw new Error("НЕверная последовательность шифров");
            }
        }

        
    });
}





