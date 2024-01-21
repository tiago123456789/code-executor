const clientDB = require("../config/Database");
const { TYPE_TRIGGER } = require("../utils/type");

class ScriptRepository {

    getAll() {
        return clientDB("scripts")
    }

    getLast10ExectuionsByScriptId(scriptId) {
        return clientDB("executions")
            .where("script_id", scriptId)
            .orderBy("id", "desc")
            .limit(10)
    }

    async create(data) {
        const register = await clientDB("scripts").insert(data).returning("*")
        return register[0]
    }

    async createHttpUrlTriggerScript(data) {
        const httpUrl = await clientDB("http_urls_trigger_scripts").insert(data).returning("*")
        return httpUrl[0] || null
    }

    async getHttpUrlTriggerById(id) {
        const register = await clientDB("http_urls_trigger_scripts")
            .where("id", id)
            .limit(1)

        return register[0] || null
    }

    async getScriptById(id) {
        const register = await clientDB("scripts")
            .where("id", id)
            .limit(1)

        return register[0] || null
    }

    saveLogExecution(data) {
        return clientDB("executions")
            .insert(data)
    }

    getScriptsToExecute() {
        return clientDB("scripts")
            .select([
                "id", "secret_manager_token"
            ])
            .where("enabled", true)
            .where("trigger", TYPE_TRIGGER.CRON)
            .whereRaw("extract(epoch from (CURRENT_TIMESTAMP - last_execution::timestamp)) >= interval_to_run")
    }

    updateMany(ids, dataModified) {
        return clientDB("scripts")
            .whereIn("id", ids)
            .update(dataModified)
    }


}

module.exports = ScriptRepository