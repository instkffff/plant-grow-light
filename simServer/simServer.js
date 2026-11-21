import { createServer } from 'net'

const HOST = '127.0.0.1'
const PORTS = [6000, 6001, 6002, 6003]

function handleSocket(socket, port) {
    console.log(`[${port}] Client connected: ${socket.remoteAddress}:${socket.remotePort}`)

    socket.on('data', (buffer) => {
        console.log(`[${port}] Received buffer (${buffer.length} bytes):`, buffer)
    })

    socket.on('end', () => {
        console.log(`[${port}] Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`)
    })

    socket.on('error', (err) => {
        console.error(`[${port}] Socket error:`, err.message)
    })
}

function startServer(port) {
    const server = createServer((socket) => handleSocket(socket, port))

    server.on('error', (err) => {
        console.error(`Server error on port ${port}:`, err.message)
    })

    server.listen(port, HOST, () => {
        console.log(`TCP server listening on ${HOST}:${port}`)
    })

    return server
}

const servers = PORTS.map(startServer)

process.on('SIGINT', () => {
    console.log('\nShutting down servers...')
    servers.forEach((s) => s.close())
    process.exit(0)
})


