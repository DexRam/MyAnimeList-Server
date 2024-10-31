import HyperExpress from "hyper-express";
import { top, anime } from "../operations/animeOperations";

const animeRoutes = (webserver: HyperExpress.Server) => {
  /**
   * @openapi
   * /top:
   *   get:
   *     summary: Get Top Anime
   *     tags:
   *       - Anime
   *     responses:
   *       200:
   *         description: Top was parsed successfully
   */
  webserver.get("/top", async (request, response) => {
    try {
      const topResult = await top();
      return response.send(topResult);
    } catch (error) {
      return response.status(500).send(`Unable to get Top ${error}`);
    }
  });
  /**
   * @openapi
   * /anime/:animeID:
   *   get:
   *     summary: Get Anime by ID
   *     tags:
   *       - Anime
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               animeID:
   *                 type: number
   *                 description: The ID of the Anime
   *                 example: "52991"
   *     responses:
   *       200:
   *         description: Anime was parsed successfully
   */
  webserver.get(`/anime/:animeID`, async (request, response) => {
    try {
      const animeID = Number(request.params.animeID);
      const animeResult = await anime(animeID);
      return response.send(animeResult);
    } catch (error) {
      return response.status(500).send(`Unable to get Anime ${error}`);
    }
  });
};

export default animeRoutes;
