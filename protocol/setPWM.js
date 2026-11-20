/* 
设置组中设备某个通道的光强 

函数名 setPWM

addr 00 广播 固定
func 10 写多个寄存器 固定
start 00 0B 寄存器起始地址 固定
len 00 02 寄存器数量 固定
bytes 04 目标字节数 固定
channel 00 02 通道号 uint16
pwm 00 03 光强值 uint16
modbus crc16 校验和

*/

import { crc } from '../tool/CRC.js';


function setPWM(channel, pwm) {
  const addr = 0x00;
  const func = 0x10;
  const start = 0x000B;
  const len = 0x0002;
  const bytes = 0x04;

  const buf = Buffer.alloc(11);
  buf.writeUInt8(addr, 0);
  buf.writeUInt8(func, 1);
  buf.writeUInt16BE(start, 2);
  buf.writeUInt16BE(len, 4);
  buf.writeUInt8(bytes, 6);
  buf.writeUInt16BE(channel, 7);
  buf.writeUInt16BE(pwm, 9);

  const crcBuf = crc(buf);
  const result = Buffer.concat([buf, crcBuf]);
  return result;
}

/* 
console.log(setPWM(1, 100));

<Buffer 00 10 00 0b 00 02 04 00 01 00 64 e6 cb> 
        00 10 00 0B 00 02 04 00 02 00 00 17 20
*/

export { setPWM };