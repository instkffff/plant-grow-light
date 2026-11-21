import { Bset } from '../actor/Bset.js';
import { Rset } from '../actor/Rset.js';
import { Wset } from '../actor/Wset.js';

import { Kswitch } from '../actor/Kswitch.js';


/* 

bridge and read message
{
    "func": "read",
    "node": "PLANT",
    "group": "G11",
    "tag": "Y",
    "value": 100
}

write message
{
    "func": "write",
    "node": "PLANT",
    "group": "G11",
    "tag": "Y",
    "value": 2000
}

updateValue('System1', 'valve1', 'windSet', 0);

*/


/* 
const GT = ['ID', 'MODE', 'K', 'R', 'B', 'W', 'TIMESTAMP']
*/

function bridge(message) {
    switch (message['tag']) {
        case 'ID':
            console.log('ID:', message.value);
            break;
        case 'MODE':
            console.log('MODE:', message.value);
            break;
        case 'K':
            console.log('K:', message.value);
            Kswitch(message);
            break;
        case 'R':
            console.log('R:', message.value);
            Rset(message);
            break;
        case 'B':
            console.log('B:', message.value);
            Bset(message);
            break;
        case 'W':
            console.log('W:', message.value);
            Wset(message);
            break;
        default:
            console.log('default');
            break;
    }
}

export { bridge };