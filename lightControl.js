import { sendTo, startAllConnections, serverConfigs } from './tcp/tcp.js';

import { wsClientInit, send } from './ws/wsClient.js';

import { eventListener } from './lightControl/main.js';

// tartAllConnections()

wsClientInit();

eventListener();
