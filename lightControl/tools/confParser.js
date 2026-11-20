import { parse } from "csv-parse";

function confParser(csv) {
    return new Promise((resolve, reject) => {
        parse(csv, { columns: true, skip_empty_lines: true }, (err, records) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(records);
        });
    });
}

/* const csvSample = `
sel,tmark,r,b,w
1,0,0,0,0
2,10,100,100,50
3,10,200,150,200
4,10,250,200,100
5,10,200,200,150
`;

const result = await confParser(csvSample);

console.log(result); */

/* 
result sample
[
    { sel: '1', tmark: '0', r: '0', b: '0', w: '0' },
    { sel: '2', tmark: '10', r: '100', b: '100', w: '50' },
    { sel: '3', tmark: '10', r: '200', b: '150', w: '200' },
    { sel: '4', tmark: '10', r: '250', b: '200', w: '100' },
    { sel: '5', tmark: '10', r: '200', b: '200', w: '150' }
] 
*/

export { confParser };

