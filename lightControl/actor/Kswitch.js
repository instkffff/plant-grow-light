import { busQueues } from '../../queue/queenList.js';
import { groupDiv } from './groupDiv.js';

import { updateValue } from '../../sqlite/insert.js';
import { timeParser, getCurrentTimestamp } from '../tools/timeParser.js';

import { send } from '../../ws/wsClient.js';

const S1bus = busQueues[0];
const S2bus = busQueues[1];
const S3bus = busQueues[2];
const S4bus = busQueues[3];

const BusList = [S1bus, S2bus, S3bus, S4bus];

function sendMsgTime (Y, M, D, H, MM, group ) {
    ['Y', 'M', 'D', 'HH', 'MM' ].forEach((tag, i) =>
        send({ func: 'write', node: 'PLANT', group, tag, value: [Y, M, D, H, MM][i] })
    );
}

function Kswitch( message ) {
    const { system, groupID } = groupDiv(message);
    const timestamp = getCurrentTimestamp()
    const group = message['group'];

    updateValue('PLANT', group, 'TIMESTAMP', timestamp);

    const { Y, M, D, H, MM } = timeParser(timestamp);
    sendMsgTime(Y, M, D, H, MM, group);
}
export { Kswitch };