import http from 'k6/http';
import { check, sleep } from 'k6';

// Load testing strategy targeting 100 concurrent users for 30s
export const options = {
  stages: [
    { duration: '5s', target: 20 },  // Ramp up to 20 users
    { duration: '15s', target: 100 }, // Spike to 100 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    // 99% of requests must complete below 300ms SLA
    http_req_duration: ['p(99)<300'], 
    // Less than 1% error rate
    http_req_failed: ['rate<0.01'],   
  },
};

export default function () {
  const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api/v1';

  // 1. Check API Health
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health is 200': (r) => r.status === 200,
  });

  // 2. Simulate Authentication Attempt (Heavy DB Hash operation)
  const payload = JSON.stringify({
    email: 'admin@atomquest.com',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, payload, params);
  check(loginRes, {
    'login is successful or 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}
