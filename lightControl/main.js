import { emitter } from '../ws/eventList.js';



function processMessage(data) {
    console.log('[ws] received:', JSON.parse(data));
    const message = JSON.parse(data);

    switch (message['func']) {
        case 'read':
            console.log('read');
            break;
        case 'bridge':
            console.log('bridge');
            break;
        case 'write':
            console.log('write');
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