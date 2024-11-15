import HyperExpress from "hyper-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "../../swaggerсonfig";
import getSwaggerHtml from "../swagger";

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export const docsRoutes = (webserver: HyperExpress.Server) => {
  /**
   * @openapi
   * /docs-json:
   *   get:
   *     tags:
   *       - Docs
   *     summary: Получить JSON спецификацию OpenAPI
   *     responses:
   *       200:
   *         description: JSON спецификация OpenAPI
   */
  webserver.get("/docs-json", (request, response) => {
    try {
      response.json(swaggerSpec);
    } catch (error) {
      response.status(500).send(`Internal Server Error ${error}`);
    }
  });

  /**
   * @openapi
   * /docs:
   *   get:
   *     summary: Get Swagger OpenAPI Specification
   *     tags:
   *       - Docs
   *     responses:
   *       200:
   *         description: Swagger OpenAPI Specification
   */
  webserver.get("/docs", (request, response) => {
    try {
      response.type("text/html");
      response.send(getSwaggerHtml());
    } catch (error) {
      response.status(500).send(`Internal Server Error ${error}`);
    }
  });
};

export default docsRoutes;
