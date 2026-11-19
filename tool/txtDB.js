import fs from 'fs'

const writeTimestamp = (data) => {
    fs.writeFileSync('./timestamp.txt', data)
}

const readTimestamp = () => {
    return fs.readFileSync('./timestamp.txt', 'utf8')
}

export { writeTimestamp, readTimestamp }
