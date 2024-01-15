const queue = require("../config/Queue")("build_docker_image_completed")
const clientDB = require("../config/Database")

queue.process(async (job, done) => {
    const { id } = job.data;
    await clientDB("scripts")
    .update({
        enabled: true
    })
    .where("id", id)
    console.log(`Enabled script with id => ${id}`)
    done();
})