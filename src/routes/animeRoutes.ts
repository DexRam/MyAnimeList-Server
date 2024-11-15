import HyperExpress from "hyper-express";
import {
  top,
  anime,
  userAnimeList,
  changeStatusToPlanned,
  changeStatusToWatching,
  changeStatusToWatched,
} from "../operations/animeOperations";
import { Anime } from "../interfaces";

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
      return response.json({ data: topResult });
    } catch (error) {
      return response.status(500).send(`Unable to get Top: ${error}`);
    }
  });

  webserver.get(`/anime/:animeID`, async (request, response) => {
    /**
     * @openapi
     * /anime/{animeID}:
     *   get:
     *     summary: Get Anime by ID
     *     tags:
     *       - Anime
     *     parameters:
     *       - in: path
     *         name: animeID
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the Anime
     *     responses:
     *       200:
     *         description: Anime was parsed successfully
     */
    try {
      const animeID = Number(request.params.animeID);
      const animeResult = await anime(animeID);
      return response.json({ data: animeResult });
    } catch (error) {
      return response.status(500).send(`Unable to get Anime: ${error}`);
    }
  });

  /**
   * @openapi
   * /userAnimeList/{userID}:
   *   get:
   *     summary: Get User Anime List
   *     tags:
   *       - Anime
   *     parameters:
   *       - in: path
   *         name: userID
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the User
   *     responses:
   *       200:
   *         description: User Anime List was parsed successfully
   */
  webserver.get(`/userAnimeList/:userID`, async (request, response) => {
    try {
      const userID = Number(request.params.userID);
      const userAnimeListResult: Anime[] = await userAnimeList(userID);
      return response.json({ data: userAnimeListResult });
    } catch (error) {
      return response
        .status(500)
        .send(`Unable to get User Anime List: ${error}`);
    }
  });

  /**
   * @openapi
   * /changeUserAnimeStatus:
   *   post:
   *     summary: Change User Anime Status
   *     tags:
   *       - Anime
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userID:
   *                 type: number
   *                 description: The ID of the User
   *                 example: 1
   *               animeID:
   *                 type: number
   *                 description: The ID of the Anime
   *                 example: 52991
   *               statusID:
   *                 type: number
   *                 description: Status ID (1 - Planned, 2 - Watching, 3 - Watched)
   *                 example: 1
   *     responses:
   *       200:
   *         description: Status updated successfully
   *       500:
   *         description: Error updating status
   */
  webserver.post("/changeUserAnimeStatus", async (request, response) => {
    try {
      const { userID, animeID, statusID } = await request.json();
      if (statusID === 1) await changeStatusToPlanned(userID, animeID);
      else if (statusID === 2) await changeStatusToWatching(userID, animeID);
      else await changeStatusToWatched(userID, animeID);
      return response.status(200).send("Status updated successfully");
    } catch (error) {
      return response
        .status(500)
        .send(`Unable to change user anime status: ${error}`);
    }
  });
};

export default animeRoutes;
