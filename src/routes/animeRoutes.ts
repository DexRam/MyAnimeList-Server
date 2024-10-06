import HyperExpress from 'hyper-express'
import { top } from "../operations/animeOperations";

const animeRoutes = (webserver: HyperExpress.Server) => {
    webserver.get('/top', async (request, response) => {
        try {
            const topResult = await top()
            return response.json({
                message: topResult
            })
        } catch (error) {
            return response.status(500).json({ message: 'Unable to get Top' })
        }
    });
}

export default animeRoutes