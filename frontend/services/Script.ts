import api from "./api"
import ScriptModel from "../models/Script"
import TryOut from "@/models/TryOut"

class ScriptService {

    async create(data: ScriptModel) {
        return api.post("/scripts", data)
    }

    async tryOut(data: TryOut) {
        const response = await api.post("/try-out-scripts", data)
        return response.data
    }
}

export default ScriptService