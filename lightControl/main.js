import { emitter } from '../ws/eventList.js';
import { updateDB } from './dataflow/uptadeDB.js';

function processMessage(data) {
    console.log('[ws] received:', JSON.parse(data));
    const message = JSON.parse(data);
    updateDB(message);

    switch (message['func']) {
        case 'read':
            break;
        case 'bridge':
            break;
        case 'write':
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