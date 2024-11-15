const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Anime List",
      version: "1.0.0",
      description: "My Anime List API",
    },
  },
  apis: ["./src/**/*.ts"],
};

export default swaggerOptions;
