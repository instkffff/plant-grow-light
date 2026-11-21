import { busQueues } from '../../queue/queenList.js';
import { groupDiv } from './groupDiv.js';
import { selLight } from '../../protocol/selectLight.js';
import { setPWM } from '../../protocol/setPWM.js';

import { getValue } from '../../sqlite/read.js';

const S1bus = busQueues[0];
const S2bus = busQueues[1];
const S3bus = busQueues[2];
const S4bus = busQueues[3];

const BusList = [S1bus, S2bus, S3bus, S4bus];

function Wset(message) {
    const { system, groupID } = groupDiv(message);

    const group = message['group'];

    const K = getValue('PLANT', group, 'K');

    if (K === 0) {
        return;
    }

    const bufferW = selLight(groupID[0]);
    BusList[system - 1].add(bufferW);
    const bufferPWMW = setPWM(1, message['value']);
    BusList[system - 1].add(bufferPWMW);

}

export { Wset };
