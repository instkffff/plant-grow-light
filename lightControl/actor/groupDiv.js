import { groupMap } from '../../config.js';

function groupDiv( message ) {
    const group = message['group'];
    const map = {
        'G11': 1, 'G12': 1, 'G13': 1,
        'G21': 2, 'G22': 2, 'G23': 2,
        'G31': 3, 'G32': 3, 'G33': 3,
        'G41': 4, 'G42': 4, 'G43': 4,
    };
    const system = map[group];
    const groupID = groupMap[group];
    return { system, groupID };
}

export { groupDiv };