
const hasFunctionStart = (code) => {
    return /^(function start\s\(|function start\()/gm.test(code)
}

module.exports = { hasFunctionStart }