import api from "./api"
import ScriptModel from "../models/Script"
import TryOut from "@/models/TryOut"

class ScriptService {

    async create(data: ScriptModel) {
        const response = await api.post("/scripts", data)
        return response.data;
    }

    async tryOut(data: TryOut) {
        const response = await api.post("/try-out-scripts", data)
        return response.data
    }

    async getAll() {
        const response = await api.get("/scripts")
        return response.data.data
    }

    async getLast10ExectuionsByScriptId(scriptId: String) {
        const response = await api.get(`/scripts/${scriptId}/executions`)
        return response.data.data

    }
}

export default ScriptService