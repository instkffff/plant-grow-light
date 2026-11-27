import { createConnection } from 'net'
import { S1, S2, S3, S4 } from '../config.js'

// ── 配置 ──────────────────────────────────────────────────────────────────
const RECONNECT_DELAY = 5000

const serverConfigs = [
    { name: 'S1', host: S1, port: 6000, socket: null },
    { name: 'S2', host: S2, port: 6001, socket: null },
    { name: 'S3', host: S3, port: 6002, socket: null },
    { name: 'S4', host: S4, port: 6003, socket: null }
]


// ── 工具函数 ──────────────────────────────────────────────────────────────

/**
 * 按名称查找服务器配置
 * @param {string} name - 服务器名称('S1')
 * @returns {object|undefined}
 */
function resolveServer(name) {
    return serverConfigs.find(s => s.name === name.toUpperCase())
}

// ── 发送 ──────────────────────────────────────────────────────────────────

/**
 * 向指定服务器发送缓冲区数据
 * @param {string} name - 服务器名称('S1')
 * @param {Buffer} buffer - 要发送的数据
 */
function sendTo(name, buffer) {
    const server = resolveServer(name)

    if (!server) {
        console.error(`Server not found: ${name}`)
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
        isReconnecting = false  // ★ 每次重连尝试都重置标志
        const socket = createConnection(server.port, server.host, () => {
            console.log(`Connected to ${server.name} (${server.host}:${server.port})`)
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
function startAllConnections() {
    serverConfigs.forEach(connectToServer)
}

export { startAllConnections, sendTo }