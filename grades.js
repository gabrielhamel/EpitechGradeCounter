const login = ''; // Put your autologin here

if (login == '') {
    console.log('Missing autologin url.\nOpen the script and put him into login var');
    return;
}

if (process.argv.length != 5) {
    console.log("Usage: node index.js year module location");
    console.log("For example: node grades.js 2018 B-OOP-400 REN-4-1");
    return;
}

const year = process.argv[2];
const course = process.argv[3];
const location = process.argv[4];

const url = 'https://intra.epitech.eu/auth-' + login + '/module/' + year + '/' + course + '/' + location + '/registered/?format=json';

let grades = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'Echec': 0};
let total = 0;
let request;

try {
    request = require('request');
} catch (err) {
    console.log('Missing module: \'request\'');
    console.log('Try to type "npm install"');
    return;
}

request.get(url, (err, res, body) => {
    const accounts = JSON.parse(body);
    if (accounts['error']) {
        console.log(accounts['error']);
        return;
    }
    accounts.forEach(elem => {
        grades[elem.grade]++;
        total++;
    });
    console.log('Total: ' + total + ' students');
    console.log('A: ' + grades['A'] + ' (' + (100 * grades['A'] / total).toFixed(2) + '%)');
    console.log('B: ' + grades['B'] + ' (' + (100 * grades['B'] / total).toFixed(2) + '%)');
    console.log('C: ' + grades['C'] + ' (' + (100 * grades['C'] / total).toFixed(2) + '%)');
    console.log('D: ' + grades['D'] + ' (' + (100 * grades['D'] / total).toFixed(2) + '%)');
    console.log('E: ' + grades['Echec'] + ' (' + (100 * grades['Echec'] / total).toFixed(2) + '%)');
})