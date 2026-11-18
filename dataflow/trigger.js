const triggerConfig = [
    { name: 'LightID', nodes: ['PLANT'], groups: ['G11', 'G12', 'G13', 'G21', 'G22', 'G23', 'G31', 'G32', 'G33', 'G41', 'G42', 'G43'], keys: ['ID'] },
    { name: 'LightMode', nodes: ['PLANT'], groups: ['G11', 'G12', 'G13', 'G21', 'G22', 'G23', 'G31', 'G32', 'G33', 'G41', 'G42', 'G43'], keys: ['MODE'] },
    { name: 'LightK', nodes: ['PLANT'], groups: ['G11', 'G12', 'G13', 'G21', 'G22', 'G23', 'G31', 'G32', 'G33', 'G41', 'G42', 'G43'], keys: ['K'] },
]

const asArray = (v) => (Array.isArray(v) ? v : [])

const makeTrigger = ({ name, ...config }) => {
    const nodes = asArray(config.nodes)
    if (nodes.length === 0) {
        throw new Error(`Trigger [${name}] 的 nodes 不能为空`)
    }
    const groups = asArray(config.groups)
    const keys = asArray(config.keys)

    return (data) => {
        if (!data || typeof data !== 'object') return false
        const nodeMatch = nodes.includes(data.node)
        const groupMatch = groups.length === 0 || groups.includes(data.group)
        const keysMatch = keys.length === 0
            || keys.some(k => data.values && Object.prototype.hasOwnProperty.call(data.values, k))
        return nodeMatch && groupMatch && keysMatch
    }
}

const triggers = {}
triggerConfig.forEach(cfg => { triggers[cfg.name] = makeTrigger(cfg) })

export const { LightID, LightMode, LightK } = triggers
