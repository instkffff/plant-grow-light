import { crc } from '../tool/CRC.js';

/* 
设置组中设备某个通道的光强 

函数名 setPWM

addr 00 广播 固定
func 10 写多个寄存器 固定
start 00 0B 寄存器起始地址 固定
len 00 02 寄存器数量 固定
bytes 00 04 目标字节数 固定
channel 00 02 通道号 uint16
pwm 00 03 光强值 uint16
modbus crc16 校验和

*/

function setPWM(channel, pwm) {
  const addr = 0x00;
  const func = 0x10;
  const start = 0x000B;
  const len = 0x0002;
  const bytes = 0x0004;

  const buf = Buffer.alloc(12);
  buf.writeUInt8(addr, 0);
  buf.writeUInt8(func, 1);
  buf.writeUInt16BE(start, 2);
  buf.writeUInt16BE(len, 4);
  buf.writeUInt16BE(bytes, 6);
  buf.writeUInt16BE(channel, 8);
  buf.writeUInt16BE(pwm, 10);

  const crcBuf = crc(buf);
  const result = Buffer.concat([buf, crcBuf]);
  return result;
}

/* console.log(setPWM(1, 125));

<Buffer 00 10 00 0b 00 02 00 04 00 01 00 7d 00 13> */

export { setPWM };