import canvasRoutes from './canvasRoutes.js';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';
import configRoutes from './configRoutes.js';

/**
 * Mount all route modules on the Express app.
 * @param {Object} app - Express application instance.
 */
export default (app) => {
  app.use('/api/canvas', canvasRoutes);
  app.use('/api/health', healthRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/config', configRoutes);
};
