import fs from 'fs';

let rawdata = fs.readFileSync('data/cases.json');
let cases = JSON.parse(rawdata);

console.log("DATE,CASES");
const begin = new Date(2021, 11, 1);
const end = new Date();

for (const day of cases.data) {
    const date = new Date(day.date);
    if(date >= begin && date < end) {
        const count = day.cases;
        console.log(date.toISOString().substring(0,10) + "," + count);
    }
}