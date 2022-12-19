let fs = require('fs');
let arg = process.argv;
let input = fs.readFileSync(arg[3]);
let mode = arg[2];
let shift = arg[4];
shift = +shift;
input = input.toString();

/*Функция кодирования, обрабатывает только заглавные и строчные английские буквы, 
сдвигает их по таблице ASCII остальные символы остаются изначальными*/
function encode(inpStr, shift) {
    let codeOfChar = 0;
    let encodedStr = "";
    for (let i = 0; i < inpStr.length; i++) {
        if (inpStr.charCodeAt(i) > 64 && inpStr.charCodeAt(i) < 91) {
            codeOfChar = inpStr.charCodeAt(i) + shift;
            if (codeOfChar > 90) {
                codeOfChar = codeOfChar - 90 + 64;
            }
            encodedStr += String.fromCharCode(codeOfChar);
        }
        else if (inpStr.charCodeAt(i) > 96 && inpStr.charCodeAt(i) < 123) {
            codeOfChar = inpStr.charCodeAt(i) + shift;
                if (codeOfChar > 122) {
                    codeOfChar = codeOfChar - 122 + 96;
                }
                encodedStr += String.fromCharCode(codeOfChar);
        }
        else {
            encodedStr += inpStr[i];
        }
    }
    return encodedStr;
}
//Аналогичная функция для декодирования
function decode (encodedStr, shift) {
    let codeOfChar = 0;
    let decodedStr = "";
    for(let i = 0; i < encodedStr.length; i++) {
        if (encodedStr.charCodeAt(i) > 64 && encodedStr.charCodeAt(i) < 91) {
            codeOfChar = encodedStr.charCodeAt(i) - shift;
            if (codeOfChar <= 64) {
                codeOfChar = codeOfChar + 90 - 64;
            }
            decodedStr += String.fromCharCode(codeOfChar);
        }
        else if (encodedStr.charCodeAt(i) > 96 && encodedStr.charCodeAt(i) < 123) {
            codeOfChar = encodedStr.charCodeAt(i) - shift;
                if (codeOfChar <= 96) {
                    codeOfChar = codeOfChar + 122 - 96;
                }
                decodedStr += String.fromCharCode(codeOfChar);
        }
        else {
            decodedStr += encodedStr[i];
        }
    }
    return decodedStr;
}
//Вспомогательная функция которая находит наиболее часто встречающийся элемент в массиве
function findMostFreqElem(arr) {
    let count = 0;
    let maxCount = 0;
    let mostFreqElem = 0;
    arr.sort((a,b) => a - b);
    for(let i = 1; i < arr.length; i++) {
        if(arr[i-1] == arr[i]) {
            count++;
        }
        else {
            if(count > maxCount) {
                maxCount = count;
                mostFreqElem = arr[i-1];
            }
            count = 0;
        }
    }
    return mostFreqElem;
}

function hack(encodedStr) {
    let realFreqs = {'a': 8.17, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.7, 'f': 2.23, 'g': 2.02, 'h': 6.09, 'i': 6.97, 'j': 0.15, 'k': 0.77, 'l': 4.03, 'm': 2.41, 'n': 6.75, 'o': 7.51, 'p': 1.93, 'q': 0.1, 'r': 5.99, 's': 6.33, 't': 9.06, 'u': 2.76, 'v': 0.98, 'w': 2.36, 'x': 0.15, 'y': 1.97, 'z': 0.05};
    let textFreqs = {'a': 0, 'b': 0, 'c': 0, 'd': 0, 'e': 0, 'f': 0, 'g': 0, 'h': 0, 'i': 0, 'j': 0, 'k': 0, 'l': 0, 'm': 0, 'n': 0, 'o': 0, 'p': 0, 'q': 0, 'r': 0, 's': 0, 't': 0, 'u': 0, 'v': 0, 'w': 0, 'x': 0, 'y': 0, 'z': 0};
    encodedStr = encodedStr.toLowerCase();

    //Генерируем "таблицу" частот для закодированного текста
    for (let i = 0; i < encodedStr.length; i++){
        if(encodedStr.charCodeAt(i) > 122 || encodedStr.charCodeAt(i) < 97) {
            continue;
        }
        textFreqs[encodedStr[i]]++;
    }
    for(let key in textFreqs) {
        textFreqs[key] /= encodedStr.length;
        textFreqs[key] *= 100;
    }

    //Создаем массив всех возможных сдвигов с учетом погрешности 0,25
    let deff = 0.25;
    let shifts = [];
    for(let i in textFreqs) {
        for(let j in realFreqs){
            if((textFreqs[i] >= realFreqs[j] - deff) && (textFreqs[i] <= realFreqs[j] + deff)){
                if (i.charCodeAt(0) - j.charCodeAt(0) > 0){
                shifts.push(i.charCodeAt(0) - j.charCodeAt(0));
                }
            }
        }
    }

    //Выбираем наиболее частовстречающийся сдвиг, он и будет искомым
    shift = findMostFreqElem(shifts);
    return shift;
}   

//Блок управления режимами
if (mode == 'encode') {
    console.log(encode(input, shift));
}
if(mode == 'decode') {
    console.log(decode(input,shift));
}
if(mode == 'hack') {
    shift = hack(input);
    console.log(decode(input, shift));
}