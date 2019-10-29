const login = '0f52672c1c1dafd1808fb4d42a46e56da3182807'; // Put your autologin here

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

const sem = '-' + location.split('-')[1] + '-' + location.split('-')[2];

const url = 'https://intra.epitech.eu/auth-' + login + '/module/' + year + '/' + course + '/' + location + '/registered/?format=json';

const city = ['REN', 'BDX', 'LIL', 'LYN', 'MAR', 'MPL', 'NCY', 'NAN', 'NCE', 'PAR', 'STG', 'TLS', 'TIR', 'BRU', 'COT', 'RUN', 'BER', 'BAR'];
let allGrades = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'Echec': 0};
let grades = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'Echec': 0};
let total = 0;
let totalNation = 1;
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
});

var accountfn = (elem) => {
    return new Promise((resolve) => {
        allGrades[elem.grade]++;
        totalNation++;
        resolve();
    })
}

var fn = (elem) => { 
    return new Promise((resolve, reject) => {
        let url = 'https://intra.epitech.eu/auth-' + login + '/module/' + year + '/' + course + '/' + elem + sem + '/registered/?format=json';
        request.get(url, (err, res, body) => {
            const accounts = JSON.parse(body);
            Promise.all(Object.values(accounts).map(accountfn)).then(() => {
                resolve();
            }).catch((error) => {reject(error)});;
        })
    });
};

Promise.all(city.map(fn)).then(() => {
    console.log('national:');
    console.log('Total: ' + totalNation + ' students');
    console.log('A: ' + allGrades['A'] + ' (' + (100 * allGrades['A'] / totalNation).toFixed(2) + '%)');
    console.log('B: ' + allGrades['B'] + ' (' + (100 * allGrades['B'] / totalNation).toFixed(2) + '%)');
    console.log('C: ' + allGrades['C'] + ' (' + (100 * allGrades['C'] / totalNation).toFixed(2) + '%)');
    console.log('D: ' + allGrades['D'] + ' (' + (100 * allGrades['D'] / totalNation).toFixed(2) + '%)');
    console.log('E: ' + allGrades['Echec'] + ' (' + (100 * allGrades['Echec'] / totalNation).toFixed(2) + '%)');
}).catch((e) => {
    //console.log(e)
});