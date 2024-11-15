import HyperExpress from "hyper-express";
import {
  securityHeaders,
  corsHeaders,
  defaultContentType,
  rateLimiter,
} from "./middleware";
import initializeDatabase from "./dbConnector/initialisation";
import docsRoutes from "./routes/docsRoutes";
import userRoutes from "./routes/userRoutes";
import animeRoutes from "./routes/animeRoutes";

const PORT = Number(process.env.PORT) || 1024;
export const webserver = new HyperExpress.Server();

webserver.use(securityHeaders);
webserver.use(corsHeaders);
webserver.use(defaultContentType);
webserver.use(rateLimiter);

const routes = [docsRoutes, userRoutes, animeRoutes];
routes.forEach((route) => route(webserver));

webserver.get("/", (request, response) => {
  try {
    response.send(
      "Server is online. You can navigate to /docs to see the Swagger UI or to /docs-json to see the JSON specification."
    );
  } catch (error) {
    response.status(500).send(`Internal Server Error ${error}`);
  }
});

const startServer = async () => {
  try {
    await initializeDatabase();
    await webserver.listen(PORT);
    console.log(`Webserver started on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
