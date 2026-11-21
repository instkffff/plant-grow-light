/* {
    "func": "write",
    "node": "PLANT",
    "group": "G11",
    "tag": "Y",
    "value": 2000,
    "status": "success" | "error"
} */

function write(message) {
    if (message.status === 'success') {
        console.log('write success:', message);
    } else {
        console.log('write error:', message);
    }
}

export { write };
