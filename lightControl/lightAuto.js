import { calPWM } from './calPWM.js';
import { getValue } from '../sqlite/read.js';
import { getCurrentTimestamp } from './tools/timeParser.js';

import { busQueues } from '../queue/queenList.js';
import { selLight } from '../protocol/selectLight.js';
import { setPWM } from '../protocol/setPWM.js';
import { groupMap } from '../config.js';

import { send } from '../ws/wsClient.js';

function sendMsg (r, b, w, group) {
    console.log(r, b, w, group);
    ['R', 'B', 'W'].forEach((tag, i) =>
        send({ func: 'write', node: 'PLANT', group, tag, value: [r, b, w][i] })
    );
}

const S1bus = busQueues[0];
const S2bus = busQueues[1];
const S3bus = busQueues[2];
const S4bus = busQueues[3];

const BusList = [S1bus, S2bus, S3bus, S4bus];

function Lset( group, r, b, w ){
    const map = {
        'G11': 1, 'G12': 1, 'G13': 1,
        'G21': 2, 'G22': 2, 'G23': 2,
        'G31': 3, 'G32': 3, 'G33': 3,
        'G41': 4, 'G42': 4, 'G43': 4,
    };
    const system = map[group];
    const groupID = groupMap[group];

    if (groupID.length === 2) {
        const RBGroup = selLight(groupID[2]);
        const bufferPWMR = setPWM(1, r);
        const bufferPWMB = setPWM(1, b);
        const WGroup = selLight(groupID[0]);
        const bufferPWMW = setPWM(1, w);

        BusList[system - 1].add(RBGroup);
        BusList[system - 1].add(bufferPWMR);
        BusList[system - 1].add(RBGroup);
        BusList[system - 1].add(bufferPWMB);
        BusList[system - 1].add(WGroup);
        BusList[system - 1].add(bufferPWMW);

    } else {
        const WGroup = selLight(groupID[0]);
        const bufferPWMW = setPWM(1, w);

        BusList[system - 1].add(WGroup);
        BusList[system - 1].add(bufferPWMW);
    }
}

async function lightAuto( group ) {
    const MODE = getValue('PLANT', group, 'MODE');
    const confID = String(getValue('PLANT', group, 'ID')).padStart(4, '0');
    const tstart = getValue('PLANT', group, 'TIMESTAMP');
    const tnow = getCurrentTimestamp();
    const K = getValue('PLANT', group, 'K');
    
    if (K === 0) {
        return;
    }

    if (MODE === 1) {
        const { r, b, w } = await calPWM( confID, tstart, tnow );
        Lset( group, r, b, w );
        sendMsg( r, b, w, group );
    } else {
        return;
    }
    
}

export { lightAuto };