
const generate = (httpUrl) => {
    return `${process.env.URL_TRIGGER_CRONJOB_VIA_HTTP}${httpUrl.id}?key=${httpUrl.key}`
}

module.exports= {
    generate
}