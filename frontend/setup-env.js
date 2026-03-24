const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const isProduction = process.env.NODE_ENV === 'production';

const targetPath = path.join(envDir, 'environment.ts');
const devPath = path.join(envDir, 'environment.development.ts');

const envConfigFile = `export const environment = {
  production: ${isProduction},
  baseApiUrl: '${process.env.BASE_API_URL || 'http://localhost:8081/api'}',
  authTokenApiUrl: '${process.env.AUTH_TOKEN_API_URL || 'http://localhost:8081/api/auth'}',
  otpApiUrl: '${process.env.OTP_API_URL || 'http://localhost:8081/api/otp'}',
  coinGeckoApiKey: '${process.env.COINGECKO_API_KEY || 'CG-kv5kqyziJ1A3TCzhyQV25XNQ'}',
  chatBotApiUrl: '${process.env.CHATBOT_API_URL || 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ=='}'
};
`;

console.log('Generating environment files...');

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(devPath, envConfigFile);

console.log(`Environment files generated at ${targetPath} and ${devPath}`);
