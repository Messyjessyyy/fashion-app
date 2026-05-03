const http = require('http');
const url = require('url');

// In-memory data
const users = [];
const clothing = [
  { id: 1, name: 'White T-Shirt', price: 29.99, category: 'tops', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80' },
  { id: 2, name: 'Blue Jeans', price: 59.99, category: 'bottoms', image: 'https://images.unsplash.com/photo-1542584411-b2eab56c6321?w=300&q=80' },
  { id: 3, name: 'Summer Dress', price: 49.99, category: 'dresses', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80' },
  { id: 4, name: 'Denim Jacket', price: 79.99, category: 'outerwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&q=80' },
  { id: 5, name: 'Red Blazer', price: 89.99, category: 'outerwear', image: 'https://images.unsplash.com/photo-1539533057440-7814bbb299d0?w=300&q=80' },
  { id: 6, name: 'Black Skirt', price: 44.99, category: 'bottoms', image: 'https://images.unsplash.com/photo-1606856110002-d0991ce78250?w=300&q=80' },
  { id: 7, name: 'Casual Sweater', price: 54.99, category: 'tops', image: 'https://images.unsplash.com/photo-1556821552-cb06b8e504a7?w=300&q=80' },
  { id: 8, name: 'Leather Boots', price: 129.99, category: 'accessories', image: 'https://images.unsplash.com/photo-1548062407-2d48c45fc556?w=300&q=80' },
];

// Helper to parse JSON from request body
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch (e) {
      callback(null);
    }
  });
}

// Helper to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    sendJSON(res, 200, { status: '✅ Server is running' });
    return;
  }

  // Get all clothing
  if (pathname === '/api/clothing' && method === 'GET') {
    sendJSON(res, 200, clothing);
    return;
  }

  // Register user
  if (pathname === '/api/auth/register' && method === 'POST') {
    parseBody(req, (data) => {
      if (!data || !data.email || !data.password) {
        sendJSON(res, 400, { error: 'Email and password required' });
        return;
      }
      const user = { id: users.length + 1, email: data.email, password: data.password, profile: {}, measurements: {} };
      users.push(user);
      sendJSON(res, 201, { message: '✅ User registered', user: { id: user.id, email: user.email } });
    });
    return;
  }

  // Login user
  if (pathname === '/api/auth/login' && method === 'POST') {
    parseBody(req, (data) => {
      if (!data || !data.email || !data.password) {
        sendJSON(res, 400, { error: 'Email and password required' });
        return;
      }
      const user = users.find(u => u.email === data.email && u.password === data.password);
      if (!user) {
        sendJSON(res, 401, { error: 'Invalid credentials' });
        return;
      }
      sendJSON(res, 200, { message: '✅ Login successful', user: { id: user.id, email: user.email } });
    });
    return;
  }

  // Get user profile
  if (pathname.match(/^\/api\/users\/\d+\/profile$/) && method === 'GET') {
    const userId = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === userId);
    if (!user) {
      sendJSON(res, 404, { error: 'User not found' });
      return;
    }
    sendJSON(res, 200, { id: user.id, email: user.email, profile: user.profile, measurements: user.measurements });
    return;
  }

  // Update user profile
  if (pathname.match(/^\/api\/users\/\d+\/profile$/) && method === 'PUT') {
    const userId = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === userId);
    if (!user) {
      sendJSON(res, 404, { error: 'User not found' });
      return;
    }
    parseBody(req, (data) => {
      if (!data) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return;
      }
      user.profile = { ...user.profile, ...data };
      sendJSON(res, 200, { message: '✅ Profile updated', profile: user.profile });
    });
    return;
  }

  // Update measurements
  if (pathname.match(/^\/api\/users\/\d+\/measurements$/) && method === 'PUT') {
    const userId = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === userId);
    if (!user) {
      sendJSON(res, 404, { error: 'User not found' });
      return;
    }
    parseBody(req, (data) => {
      if (!data) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return;
      }
      user.measurements = { ...user.measurements, ...data };
      sendJSON(res, 200, { message: '✅ Measurements updated', measurements: user.measurements });
    });
    return;
  }

  // Not found
  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(3000);
console.log('🚀 Fashion App API running on port 3000');
console.log('📍 Local: http://localhost:3000');
console.log('✅ Endpoints:');
console.log('   GET  /api/health');
console.log('   GET  /api/clothing');
console.log('   POST /api/auth/register');
console.log('   POST /api/auth/login');
console.log('   GET  /api/users/:userId/profile');
console.log('   PUT  /api/users/:userId/profile');
console.log('   PUT  /api/users/:userId/measurements');