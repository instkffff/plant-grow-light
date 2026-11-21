import { newQueue } from './queue.js';
import { startAllConnections, sendTo } from '../tcp/tcp.js';

const busQueues = [
    newQueue({ name: 'bus1', maxSize: 60, defaultTimeout: 10000 }),
    newQueue({ name: 'bus2', maxSize: 60, defaultTimeout: 10000 }),
    newQueue({ name: 'bus3', maxSize: 60, defaultTimeout: 10000 }),
    newQueue({ name: 'bus4', maxSize: 60, defaultTimeout: 10000 }),
];

// 执行器函数

function busWorker(queue, client) {
    const mission = queue.work();
    if (mission) {
        sendTo(client, mission);
    }
}

export { busQueues, busWorker };
