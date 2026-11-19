// 时间戳转 年 月 日 时 分 并输出
function timeParser(timestamp) {
    const date = new Date(timestamp);

    const Y = date.getFullYear();
    const M = date.getMonth() + 1;
    const D = date.getDate();
    const H = date.getHours();
    const MM = date.getMinutes();

    return { Y, M, D, H, MM };
}

// 获取当前时间戳
function getCurrentTimestamp() {
    return Date.now();
}

/* const timestamp = getCurrentTimestamp();
console.log(timeParser(timestamp));
 */

export { timeParser, getCurrentTimestamp };