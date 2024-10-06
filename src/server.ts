import HyperExpress from 'hyper-express';
import { securityHeaders, corsHeaders, defaultContentType } from './middleware';
import docsRoutes from './routes/docsRoutes';
import userRoutes from './routes/userRoutes';
import animeRoutes from './routes/animeRoutes';

const PORT = Number(process.env.PORT) || 80;
export const webserver = new HyperExpress.Server();

webserver.use(securityHeaders);
webserver.use(corsHeaders);
webserver.use(defaultContentType);

const routes = [docsRoutes, userRoutes, animeRoutes];
routes.forEach((route) => route(webserver));

webserver.get('/', (request, response) => {
    try {
        response.send('Server is online. You can navigate to /docs-json to see the JSON specification or to /docs to see the Swagger UI.');
    } catch (error) {
        response.status(500).send('Internal Server Error');
    }
});



const startServer = async () => {
    try {
        await webserver.listen(PORT);
        console.log(`Webserver started on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start webserver:', error);
    }
};

startServer();
