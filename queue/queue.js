function newQueue(config = {}) {
    const {
        name = 'default',
        maxSize = 1000,        // 队列长度上限
        defaultTimeout = 5000, // 默认超时（从入队开始算）
    } = config;

    const q = {
        name,
        maxSize,
        defaultTimeout,

        // 供查询的状态（直接挂在对象上）
        items: [],   // { mission, enqueuedAt, expireAt }
        head: 0,     // 当前读取位置

        // 添加任务：超长时丢弃最旧的
        add(mission, timeout = defaultTimeout) {
            const now = Date.now();
            // 队列满了：丢弃最旧的未消费项
            while (q.items.length - q.head >= maxSize) {
                q.head++;
            }
            q.items.push({
                mission,
                enqueuedAt: now,
                expireAt: now + timeout,
            });
            // 压缩：消费完时重置数组，避免无限增长
            if (q.head > 0 && q.head === q.items.length) {
                q.items = [];
                q.head = 0;
            }
            return q.items.length - q.head;
        },

        // 获取下一个未过期任务，过期项顺手丢弃
        work() {
            const now = Date.now();
            while (q.head < q.items.length) {
                const item = q.items[q.head];
                q.head++;
                if (now <= item.expireAt) {
                    return item.mission;
                }
                // 过期，继续看下一个
            }
            // 全部消费完，压缩
            if (q.head > 0 && q.head === q.items.length) {
                q.items = [];
                q.head = 0;
            }
            return undefined;
        },
    };

    return q;
}

export { newQueue }


/* 
// 创建 4 条总线的队列
const busQueues = [
  newQueue({ name: 'bus1', maxSize: 500, defaultTimeout: 1000 }),
  newQueue({ name: 'bus2', maxSize: 500, defaultTimeout: 1000 }),
  newQueue({ name: 'bus3', maxSize: 500, defaultTimeout: 1000 }),
  newQueue({ name: 'bus4', maxSize: 500, defaultTimeout: 1000 }),
];

// 生产者：单向推入
busQueues[0].add({ type: 'broadcast', frame: [0x01, 0x06, 0x00, 0x01, 0x00, 0x01] }, 500);

// 消费者：循环取任务执行
async function busWorker(queue, client) {
  while (true) {
    const mission = queue.work();
    if (mission) {
      await executeTask(client, mission); // 广播后内部 await sleep(10)
    } else {
      await sleep(5);
    }
  }
}

// 查询：直接读对象属性
console.log(busQueues[0].items.length - busQueues[0].head); // 待处理数量（含已过期未清理的）
console.log(busQueues[0].items);                            // 全部原始项 

*/