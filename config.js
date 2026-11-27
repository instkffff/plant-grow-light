const S1 = '127.0.0.1'
const S2 = '127.0.0.1'
const S3 = '127.0.0.1'
const S4 = '127.0.0.1'

const G11 = [110, 111]
const G12 = [120, 121]
const G13 = [130, 131]

const G21 = [210, 211]
const G22 = [220, 221]
const G23 = [230, 231]

const G31 = [310]
const G32 = [320]
const G33 = [330]

const G41 = [410]
const G42 = [420]
const G43 = [430]

const GT = ['ID', 'MODE', 'K', 'R', 'B', 'W', 'TIMESTAMP']

const PLANT = [
    { name: 'G11', keys: GT },
    { name: 'G12', keys: GT },
    { name: 'G13', keys: GT },
    { name: 'G21', keys: GT },
    { name: 'G22', keys: GT },
    { name: 'G23', keys: GT },
    { name: 'G31', keys: GT },
    { name: 'G32', keys: GT },
    { name: 'G33', keys: GT },
    { name: 'G41', keys: GT },
    { name: 'G42', keys: GT },
    { name: 'G43', keys: GT },
]

const groupMap = {
    'G11': G11,
    'G12': G12,
    'G13': G13,
    'G21': G21,
    'G22': G22,
    'G23': G23,
    'G31': G31,
    'G32': G32,
    'G33': G33,
    'G41': G41,
    'G42': G42,
    'G43': G43,
}

export {
    S1, S2, S3, S4,
    G11, G12, G13, G21,
    G22, G23, G31, G32,
    G33, G41, G42, G43,
    PLANT, GT, groupMap
}
