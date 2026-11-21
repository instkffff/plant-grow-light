import { busQueues } from '../../queue/queenList.js';
import { groupDiv } from './groupDiv.js';

import { updateValue } from '../../sqlite/insert.js';
import { timeParser, getCurrentTimestamp } from '../tools/timeParser.js';

import { send } from '../../ws/wsClient.js';

import { getValue } from '../../sqlite/read.js';

import { selLight } from '../../protocol/selectLight.js';
import { setPWM } from '../../protocol/setPWM.js';

function Kswitch(message) {
    const { system, groupID } = groupDiv(message);
    const group = message['group'];
    const bus = busQueues[system - 1];

    const R = getValue('PLANT', group, 'R');
    const B = getValue('PLANT', group, 'B');
    const W = getValue('PLANT', group, 'W');
    const MODE = getValue('PLANT', group, 'MODE');

    if (message['value'] === 1) {
        if (MODE === 0) {
            if (groupID.length === 2) {
                const RBGroup = selLight(groupID[1]);
                const WGroup = selLight(groupID[0]);
                bus.add(RBGroup);
                bus.add(setPWM(1, R));
                bus.add(RBGroup);
                bus.add(setPWM(2, B));
                bus.add(WGroup);
                bus.add(setPWM(1, W));
            } else {
                const WGroup = selLight(groupID[0]);
                bus.add(WGroup);
                bus.add(setPWM(1, W));
            }
        } else {
            const timestamp = getCurrentTimestamp();
            updateValue('PLANT', group, 'TIMESTAMP', timestamp);
            const { Y, M, D, H, MM } = timeParser(timestamp);
            ['Y', 'M', 'D', 'HH', 'MM'].forEach((tag, i) =>
                send({ func: 'write', node: 'PLANT', group, tag, value: [Y, M, D, H, MM][i] })
            );
        }
    } else {
        if (groupID.length === 2) {
            const RBGroup = selLight(groupID[1]);
            const WGroup = selLight(groupID[0]);
            bus.add(RBGroup);
            bus.add(setPWM(1, 0));
            bus.add(RBGroup);
            bus.add(setPWM(2, 0));
            bus.add(WGroup);
            bus.add(setPWM(1, 0));
        } else {
            const WGroup = selLight(groupID[0]);
            bus.add(WGroup);
            bus.add(setPWM(1, 0));
        }
    }
}

export { Kswitch };