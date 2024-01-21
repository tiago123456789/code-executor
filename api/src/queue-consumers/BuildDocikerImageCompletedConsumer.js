const { QUEUE_BUILD_DOCKER_IMAGE_COMPLETED } = require("../constants/Queue");
const queue = require("../config/Queue")(QUEUE_BUILD_DOCKER_IMAGE_COMPLETED)
const ScriptRepository = require("../repositories/ScriptRepository")

const scriptRepository = new ScriptRepository()

queue.process(async (job, done) => {
    try {
        const { id } = job.data;
        await scriptRepository.updateMany([id], {
            enabled: true
        })
        console.log(`Enabled script with id => ${id}`)
        done();
    } catch (error) {
        console.log(error);
        throw error
    }
})