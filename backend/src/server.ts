import app from './app';
import { config } from './config/index';

const start = async () => {
    try {
        app.listen(config.PORT, () => {
            console.log(`Backend server is running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

start();
