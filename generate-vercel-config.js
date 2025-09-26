// generate-vercel-config.js

const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'app', 'api');
const config = { functions: {} };

// Recursively walk through each subfolder in app/api
fs.readdirSync(apiDir).forEach(folder => {
  const routePath = path.join(apiDir, folder, 'route.js');

  // Only add if route.js exists in the folder
  if (fs.existsSync(routePath)) {
  const configKey = `app/api/${folder}/route.js`;
    config.functions[configKey] = { memory: 256 };
  }
});

// Write to vercel.json
fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2));

console.log('✅ vercel.json generated successfully!');
