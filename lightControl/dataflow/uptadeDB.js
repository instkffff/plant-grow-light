import { updateValue } from '../../sqlite/insert.js';
import { GT } from '../../config.js';

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

function updateDB(message) {
    if (!message) return;
    if (GT.includes(message.tag)) {
        updateValue(message.node, message.group, message.tag, message.value);
    }
}

export { updateDB };