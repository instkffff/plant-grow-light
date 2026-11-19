import { sendTo, startAllConnections, serverConfigs } from './tcp/tcp.js';

import { wsClientInit, send } from './ws/wsClient.js';


startAllConnections()

wsClientInit();