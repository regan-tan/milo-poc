/**
 * Health check endpoint.
 * GET /api/health
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};
