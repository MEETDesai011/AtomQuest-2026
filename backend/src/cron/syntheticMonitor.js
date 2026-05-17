const cron = require('node-cron');
const axios = require('axios');
const logger = require('../utils/logger');

// Run synthetic monitoring every 5 minutes
const startSyntheticMonitor = () => {
  cron.schedule('*/5 * * * *', async () => {
    logger.info('[SYNTHETIC MONITOR] Starting health ping sequence...');
    
    try {
      const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
      
      // 1. API Health Ping
      const healthRes = await axios.get(`${baseUrl}/api/v1/health`);
      if (healthRes.status !== 200 || !healthRes.data.success) {
        throw new Error('API Health Check Failed');
      }
      logger.info('✅ [SYNTHETIC MONITOR] Core API Health: PASS');

      // 2. Auth Flow Ping (Attempt login with bad credentials to test DB and Auth path)
      try {
        await axios.post(`${baseUrl}/api/v1/auth/login`, {
          email: 'synthetic_ping@atomquest.com',
          password: 'wrongpassword'
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logger.info('✅ [SYNTHETIC MONITOR] Auth Flow Verification: PASS');
        } else {
          throw new Error('Auth Flow Verification Failed (Unexpected status code)');
        }
      }

      // 3. Websocket Uptime Verification
      // In a real environment, we'd use a ws:// client. Here we just verify the HTTP upgrade port is open.
      const wsRes = await axios.get(`${baseUrl}/socket.io/?EIO=4&transport=polling`);
      if (wsRes.status !== 200) {
        throw new Error('WebSocket Polling Endpoint Unavailable');
      }
      logger.info('✅ [SYNTHETIC MONITOR] WebSocket Transport: PASS');

    } catch (error) {
      logger.error(`❌ [SYNTHETIC MONITOR] FAILED: ${error.message}`);
      // In production, this would trigger PagerDuty / OpsGenie
    }
  });
};

module.exports = { startSyntheticMonitor };
