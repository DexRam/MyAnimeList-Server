import { register, login } from '../operations/userOperations';
import HyperExpress from 'hyper-express';

export const userRoutes = (webserver: HyperExpress.Server) => {
    webserver.post('/register', async (request, response) => {
        try {
            const { email, username, password } = await request.json();
            const registrationResult = await register({ email, username, password });

            return response.json({
                message: registrationResult
            });
        } catch (error) {
            return response.status(500).json({ message: 'Registration failed' });
        }
    });

    webserver.post('/login', async (request, response) => {
        try {
            const { email, password } = await request.json();
            const loginResult = await login({ email, password });

            return response.json({
                message: loginResult
            });
        } catch (error) {
            return response.status(500).json({ message: 'Login failed' });
        }
    });
}