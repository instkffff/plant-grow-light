import { startAllConnections } from './tcp/tcp.js';
import { wsClientInit, send } from './ws/wsClient.js';
import { eventListener } from './lightControl/main.js';
import { busQueues, busWorker } from './queue/queenList.js';
import { lightAuto } from './lightControl/lightAuto.js';

startAllConnections();
wsClientInit();
eventListener();

busQueues.forEach((queue, i) => {
    setInterval(() => busWorker(queue, `S${i + 1}`), 100);
});

const rows = ['1', '2', '3', '4'];
const cols = ['1', '2', '3'];
rows.forEach(r => {
    cols.forEach(c => {
        setInterval(() => {
            lightAuto(`G${r}${c}`);
        }, 60000);
    });
});
