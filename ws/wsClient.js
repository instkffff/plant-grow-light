/*
websocket

ip: 127.0.0.1
port: 30000
*/

import WebSocket from 'ws';

import { createEventEmitter } from '../tool/event.js';

// 创建事件发射器实例
const emitter = createEventEmitter();

const WS_URL = 'ws://127.0.0.1:30000';
const RECONNECT_DELAY = 5000;

let ws = null;
let reconnectTimer = null;

function wsClientInit() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        return;
    }

    ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log('[ws] connected');
    });

    ws.on('message', (data) => {
        emitter.emit('message', data);
    });

    ws.on('close', () => {
        console.log('[ws] disconnected, reconnecting...');
        scheduleReconnect();
    });

    ws.on('error', (err) => {
        console.error('[ws] error:', err.message);
    });
}

function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        wsClientInit();
    }, RECONNECT_DELAY);
}

function send(data) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('[ws] not connected, message not sent');
        return false;
    }
    ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    return true;
}

export { wsClientInit, send };