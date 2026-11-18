import { createConnection } from 'net'
import { test, S1, S2, S3, S4 } from '../config.js'

// ── 配置 ──────────────────────────────────────────────────────────────────
const RECONNECT_DELAY = 5000

const TEST_SERVERS= [
    { name: 'S1', host: '127.0.0.1', port: 6000 },
    { name: 'S2', host: '127.0.0.1', port: 6001 },
    { name: 'S3', host: '127.0.0.1', port: 6002 },
    { name: 'S4', host: '127.0.0.1', port: 6003 }
]

const DEFAULT_SERVERS = [
    { name: 'S1', host: S1, port: 4000 },
    { name: 'S2', host: S2, port: 4000 },
    { name: 'S3', host: S3, port: 4000 },
    { name: 'S4', host: S4, port: 4000 }
]

// 根据 test 标志选择服务器列表（不再重新赋值）
const serverConfigs = test === false
    ? DEFAULT_SERVERS.map(s => ({ ...s, socket: null }))
    : TEST_SERVERS.map(s => ({ ...s, socket: null }))

// ── 工具函数 ──────────────────────────────────────────────────────────────

/**
 * 按名称、索引或对象本身查找服务器配置
 * @param {string|number|object} target - 服务器名称('S1')、索引(0)或配置对象
 * @returns {object|undefined}
 */
function resolveServer(target) {
    if (typeof target === 'string') {
        return serverConfigs.find(s => s.name === target.toUpperCase())
    }
    if (typeof target === 'number') {
        return serverConfigs[target]
    }
    return target
}

// ── 发送 ──────────────────────────────────────────────────────────────────

/**
 * 向指定服务器发送缓冲区数据
 * @param {string|number|object} target - 服务器名称、索引或配置对象
 * @param {Buffer} buffer - 要发送的数据
 */
export function sendTo(target, buffer) {
    const server = resolveServer(target)

    if (!server) {
        console.error(`Target server not found: ${target}`)
        return
    }

    if (server.socket && !server.socket.destroyed) {
        server.socket.write(buffer)
        console.log(`[${server.name}] Sent (${buffer.length} bytes):`, buffer)
    } else {
        console.warn(`[${server.name}] Not connected. Message could not be sent.`)
    }
}

// ── 连接管理 ──────────────────────────────────────────────────────────────

/**
 * 建立到单个服务器的连接，并处理断线自动重连
 * @param {object} server - 服务器配置对象（含 name, host, port, socket）
 */
function connectToServer(server) {
    let isReconnecting = false

    function doConnect() {
        const socket = createConnection(server.port, server.host, () => {
            console.log(`Connected to ${server.name} (${server.host}:${server.port})`)
            isReconnecting = false
        })

        server.socket = socket

        socket.on('data', (buffer) => {
            console.log(`Received from ${server.name} (${buffer.length} bytes):`, buffer.toString())
        })

        socket.on('end', () => {
            console.log(`Disconnected from ${server.name}, reconnecting in ${RECONNECT_DELAY / 1000}s...`)
            server.socket = null
            scheduleReconnect()
        })

        socket.on('error', (err) => {
            console.error(`Error on ${server.name}:`, err.message)
            socket.destroy()
            server.socket = null
            scheduleReconnect()
        })
    }

    function scheduleReconnect() {
        if (isReconnecting) return
        isReconnecting = true
        setTimeout(doConnect, RECONNECT_DELAY)
    }

    doConnect()
}

/**
 * 启动所有服务器连接
 */
export function startAllConnections() {
    serverConfigs.forEach(connectToServer)
}

export { serverConfigs }