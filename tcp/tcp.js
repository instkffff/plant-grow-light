import { createConnection } from 'net'

// 1. 定义服务器列表（带名称标识）
const serverConfigs = [
    { name: 'S1', host: '127.0.0.1', port: 6000, socket: null },
    { name: 'S2', host: '127.0.0.1', port: 6001, socket: null },
    { name: 'S3', host: '127.0.0.1', port: 6002, socket: null },
    { name: 'S4', host: '127.0.0.1', port: 6003, socket: null }
]

const RECONNECT_DELAY = 5000

// 2. 发送缓冲区的通用函数（支持按名称如 'S1' 发送）
function sendTo(target, buffer) {
    // target 可以是名字（如 'S1'），也可以直接是配置对象，或者是数组下标
    let server = null
    if (typeof target === 'string') {
        server = serverConfigs.find(s => s.name === target.toUpperCase())
    } else if (typeof target === 'number') {
        server = serverConfigs[target]
    } else {
        server = target
    }

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

// 3. 建立连接与断线重连逻辑
function connectToServer(server) {
    let isReconnecting = false

    function connect() {
        isReconnecting = false  // ← 关键：每次尝试连接时重置标志

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
        setTimeout(() => {
            isReconnecting = false  // ← 在调用 connect 前重置
            connect()
        }, RECONNECT_DELAY)
    }

    connect()
}

// 4. 启动所有服务器连接
function startAllConnections() {
    serverConfigs.forEach(connectToServer)
}

export { sendTo, startAllConnections, serverConfigs }