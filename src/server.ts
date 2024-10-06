import HyperExpress from 'hyper-express';
import { userRoutes } from './routes/userRoutes';
import { animeRoutes } from './routes/animeRoutes';

export const webserver = new HyperExpress.Server();

userRoutes(webserver)
animeRoutes(webserver)

webserver.get('/', (request, response) => {
    response.send('Server is online');
});

webserver.listen(80)
    .then(() => console.log('Webserver started on port 80'))
    .catch((error) => console.log('Failed to start webserver on port 80', error));