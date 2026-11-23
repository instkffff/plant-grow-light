/*
 * 文件管理 API 服务器
 *
 * POST   /upload          - 上传 CSV 文件
 * GET    /files           - 获取文件列表
 * DELETE /delete/:filename - 删除文件
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_DIR = path.join(__dirname, 'lightConf');
const PORT = 4000;

if (!fs.existsSync(CSV_DIR)) fs.mkdirSync(CSV_DIR, { recursive: true });

function safeDecode(s) {
    try { return decodeURIComponent(s); } catch { return s; }
}

function parseMultipart(body, boundary) {
    const delim = Buffer.from('\r\n--' + boundary);
    let pos = body.indexOf(Buffer.from('--' + boundary)) + delim.length - 2;
    if (pos < delim.length - 2) return null;

    while (pos < body.length) {
        if (body[pos] === 0x0d && body[pos + 1] === 0x0a) pos += 2;
        else break;

        const headerEnd = body.indexOf('\r\n\r\n', pos);
        if (headerEnd === -1) return null;
        const headerStr = body.slice(pos, headerEnd).toString('latin1');
        const bodyStart = headerEnd + 4;
        const bodyEnd = body.indexOf(delim, bodyStart);
        if (bodyEnd === -1) return null;

        const match = headerStr.match(/filename\*?=(?:UTF-8''|")?([^";]*)"?/i);
        if (match) {
            // multipart 头按 latin1 解码过，需还原为 UTF-8
            const filename = Buffer.from(match[1], 'latin1').toString('utf8');
            return { filename: safeDecode(filename), content: body.slice(bodyStart, bodyEnd) };
        }
        pos = bodyEnd + delim.length;
    }
    return null;
}

function handleUpload(req, parsedUrl, res) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('error', () => { res.writeHead(400); res.end(JSON.stringify({ error: '请求体读取失败' })); });
    req.on('end', () => {
        const body = Buffer.concat(chunks);
        const m = req.headers['content-type']?.match(/boundary=(.+)$/);
        if (m) {
            let b = m[1].trim().replace(/^"|"$/g, '');
            const parsed = parseMultipart(body, b);
            if (!parsed) { res.writeHead(400); res.end(JSON.stringify({ error: '无法解析上传内容' })); return; }
            const filename = path.basename(parsed.filename) || 'unnamed';
            fs.writeFileSync(path.join(CSV_DIR, filename), parsed.content);
            res.writeHead(200); res.end(JSON.stringify({ filename }));
            return;
        }
        const rawName = parsedUrl.searchParams.get('filename');
        if (!rawName) { res.writeHead(400); res.end(JSON.stringify({ error: '缺少文件名' })); return; }
        const filename = path.basename(rawName) || 'unnamed';
        fs.writeFileSync(path.join(CSV_DIR, filename), body);
        res.writeHead(200); res.end(JSON.stringify({ filename }));
    });
}

function handleFileList(res) {
    const files = fs.readdirSync(CSV_DIR).filter(f => fs.statSync(path.join(CSV_DIR, f)).isFile())
        .map(f => ({ name: f, size: fs.statSync(path.join(CSV_DIR, f)).size }));
    res.writeHead(200); res.end(JSON.stringify(files));
}

function handleDeleteFile(filename, res) {
    // 双重兜底：入参可能是编码后的字符串
    const name = path.basename(safeDecode(filename));
    const filepath = path.join(CSV_DIR, name);
    if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        fs.unlinkSync(filepath);
        res.writeHead(200); res.end(JSON.stringify({ filename: name }));
    } else {
        res.writeHead(404); res.end(JSON.stringify({ error: '文件不存在', name }));
    }
}

function handleDownloadFile(filename, res) {
    const name = path.basename(safeDecode(filename));
    const filepath = path.join(CSV_DIR, name);
    if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        res.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
        });
        fs.createReadStream(filepath).pipe(res);
    } else {
        res.writeHead(404); res.end(JSON.stringify({ error: '文件不存在', name }));
    }
}

function handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (pathname === '/upload' && req.method === 'POST') { handleUpload(req, parsedUrl, res); return; }
    if (pathname === '/files' && req.method === 'GET') { handleFileList(res); return; }

    const dm = pathname.match(/^\/delete\/(.+)$/);
    if (dm && req.method === 'DELETE') { handleDeleteFile(dm[1], res); return; }

    const dl = pathname.match(/^\/download\/(.+)$/);
    if (dl && req.method === 'GET') { handleDownloadFile(dl[1], res); return; }

    // 便于排查：明确区分「路径不匹配」和「方法不对」
    if (dm) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed', need: 'DELETE', got: req.method }));
        return;
    }
    res.writeHead(404); res.end(JSON.stringify({ error: 'Not Found', pathname, method: req.method }));
}

http.createServer(handleRequest).listen(PORT, () => console.log(`文件管理 API 服务器已启动 http://localhost:${PORT}`));