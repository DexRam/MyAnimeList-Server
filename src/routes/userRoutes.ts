import { register, login } from "../operations/userOperations";
import HyperExpress from "hyper-express";

const userRoutes = (webserver: HyperExpress.Server) => {
  /**
   * @openapi
   * /register:
   *   post:
   *     summary: Create new user
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email for the new user
   *                 example: "user@example.com"
   *               username:
   *                 type: string
   *                 description: The username for the new user
   *                 example: "User"
   *               password:
   *                 type: string
   *                 description: The password for the new user
   *     responses:
   *       200:
   *         description: User was successfully created
   */
  webserver.post("/register", async (request, response) => {
    console.log(await request.json());
    try {
      const { email, username, password } = await request.json();
      if (!email || !username || !password) {
        return response
          .status(400)
          .json({ message: "All fields are required." });
      }
      const registrationResult = await register({ email, username, password });
      return response.json({ data: registrationResult });
    } catch (error) {
      return response.status(500).send(`Registration failed ${error}`);
    }
  });

  /**
   * @openapi
   * /login:
   *   post:
   *     summary: User authentication
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email for the new user
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 description: The password for the new user
   *     responses:
   *       200:
   *         description: User was successfully authentificated
   */
  webserver.post("/login", async (request, response) => {
    try {
      const { email, password } = await request.json();
      const loginResult = await login({ email, password });
      if (loginResult.token) {
        response.setCookie("token", loginResult.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
      }
      return response.json({ data: loginResult.message });
    } catch (error) {
      return response.status(500).send(`Login failed ${error}`);
    }
  });
};

export default userRoutes;
