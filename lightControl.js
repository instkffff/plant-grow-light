import { startAllConnections } from './tcp/tcp.js';

import { wsClientInit, send } from './ws/wsClient.js';

import { eventListener } from './lightControl/main.js';

import { busQueues, busWorker } from './queue/queenList.js';

startAllConnections()

wsClientInit();

eventListener();

setInterval(() => {
    busWorker(busQueues[0], 'S1');
}, 1000);

setInterval(() => {
    busWorker(busQueues[1], 'S2');
}, 1000);

setInterval(() => {
    busWorker(busQueues[2], 'S3');
}, 1000);

setInterval(() => {
    busWorker(busQueues[3], 'S4');
}, 1000);