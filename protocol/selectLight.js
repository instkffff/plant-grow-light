/* 
匹配组 

addr 00 广播 固定
func 10 写多个寄存器 固定
start 00 09 寄存器起始地址 固定
len 00 02 寄存器数量 固定
bytes 04 目标字节数 固定
data 00 00 00 00 匹配组号 uint32
modbus crc16 校验和

*/

import { crc } from '../tool/CRC.js';


function selLight(groupID) {

  const addr = 0x00;
  const func = 0x10;
  const start = 0x0009;
  const len = 0x0002;
  const bytes = 0x04;

  const buf = Buffer.alloc(11);
  buf.writeUInt8(addr, 0);
  buf.writeUInt8(func, 1);
  buf.writeUInt16BE(start, 2);
  buf.writeUInt16BE(len, 4);
  buf.writeUInt8(bytes, 6);
  buf.writeUInt32BE(groupID, 7);

  const crcResult = crc(buf);
  const result = Buffer.concat([buf, crcResult]);
  return result;
}

/* console.log(selLight(110));

<Buffer 00 10 00 09 00 02 04 00 00 00 6e b6 d5> 
        00 10 00 09 00 02 04 11 22 33 44 86 CC
*/

export { selLight };