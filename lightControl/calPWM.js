import { confLoader } from './tools/confLoader.js';
import { confParser } from './tools/confParser.js';

/* 
confOBJ sample
[
    { sel: '1', tmark: '0',  r: '0',   b: '0',   w: '0'   },
    { sel: '2', tmark: '10', r: '100', b: '100', w: '50'  },
    { sel: '3', tmark: '5',  r: '200', b: '150', w: '200' },
    { sel: '4', tmark: '20', r: '250', b: '200', w: '100' },
    { sel: '5', tmark: '10', r: '200', b: '200', w: '150' }
]

tmark 是分钟单位：
- sel1 的 tmark 恒为 0（起点）
- selN (N>=2) 的 tmark 表示从 sel(N-1) 过渡到 selN 所需的分钟数
*/

const toInt = (v) => parseInt(v, 10) || 0;
const OFF = { r: 0, b: 0, w: 0 };

async function calPWM(confID, tstart, tnow) {
    const configCsv = confLoader(confID);            // 同步
    if (!configCsv || configCsv.length === 0) {
        console.log('config file is empty');
        return { ...OFF };
    }
    const configOBJ = await confParser(configCsv);
    if (!configOBJ || configOBJ.length === 0) {
        return { ...OFF };
    }

    const elapsed = (tnow - tstart) / 60000; // 分钟

    // 起点：elapsed <= 0 返回第一个条目的值
    const first = configOBJ[0];
    if (elapsed <= 0) {
        return { r: toInt(first.r), b: toInt(first.b), w: toInt(first.w) };
    }

    // 从第 0 段开始累计；第 0 段的 tmark 按约定忽略
    let cumulative = 0;
    let prevEntry = first;

    for (let i = 1; i < configOBJ.length; i++) {
        const entry = configOBJ[i];
        const tmark = toInt(entry.tmark);
        const nextCumulative = cumulative + tmark;

        if (elapsed <= nextCumulative) {
            const segmentDuration = nextCumulative - cumulative;
            const progress = segmentDuration === 0
                ? 1
                : (elapsed - cumulative) / segmentDuration;

            const r = Math.round(toInt(prevEntry.r) + progress * (toInt(entry.r) - toInt(prevEntry.r)));
            const b = Math.round(toInt(prevEntry.b) + progress * (toInt(entry.b) - toInt(prevEntry.b)));
            const w = Math.round(toInt(prevEntry.w) + progress * (toInt(entry.w) - toInt(prevEntry.w)));
            return { r, b, w };
        }

        prevEntry = entry;
        cumulative = nextCumulative;
    }

    // 超出最后一段：熄灭
    return { ...OFF };
}

/* // 使用示例
import { getCurrentTimestamp } from './tools/timeParser.js';

(async () => {
    const tstart = getCurrentTimestamp();
    const tnow = tstart + 40 * 60000; // 40 分钟后

    const result = await calPWM('0035', tstart, tnow);
    console.log(`tstart: ${new Date(tstart).toISOString()}`);
    console.log(`tnow:   ${new Date(tnow).toISOString()}`);
    console.log(`result:`, result);
})();
 */

export { calPWM };