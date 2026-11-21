import { emitter } from '../ws/eventList.js';
import { updateDB } from './dataflow/uptadeDB.js';
import { write } from './dataflow/write.js';
import { bridge } from './dataflow/bridge.js';
import { read } from './dataflow/read.js';



function processMessage(data) {
    
    const message = JSON.parse(data);
    updateDB(message);

    switch (message['func']) {
        case 'read':
            read(message);
            break;
        case 'bridge':
            bridge(message);
            break;
        case 'write':
            write(message);
            break;
        default:
            console.log('default');
            break;
    }
}

function eventListener() {
    emitter.on('message', (data) => processMessage(data));
}

export { eventListener }