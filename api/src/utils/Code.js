
const hasFunctionStart = (code) => {
    return /^(async\sfunction start\s\(|async\sfunction start\(|function start\s\(|function start\()/gm.test(code)
}

module.exports = { hasFunctionStart }