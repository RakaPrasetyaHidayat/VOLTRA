const API_BASE = process.env.API_URL || 'http://localhost:3000/api/auth';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  try {
    console.log('Testing register...');
    const registerResp = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `testuser${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'Test User'
      }),
    });

    const registerJson = await registerResp.json();
    console.log('Register response:', registerResp.status, registerJson);

    if (!registerResp.ok) return;

    const { token } = registerJson.data;

    await sleep(200);

    console.log('Testing login (using email/password)...');
    const loginResp = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerJson.data.user.email,
        password: 'Password123!'
      }),
    });

    const loginJson = await loginResp.json();
    console.log('Login response:', loginResp.status, loginJson);

    console.log('Testing /me with token from login...');
    const meResp = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${loginJson.data.token}` },
    });
    console.log('Me status:', meResp.status, await meResp.json());

    console.log('Done');
  } catch (err) {
    console.error('Test failed:', err);
  }
};

run();
