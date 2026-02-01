import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'; // using the dotenv package from dependencies

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Checking path:', envPath);

if (fs.existsSync(envPath)) {
    console.log('File exists.');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        console.log(`Key found: "${k}"`);
        if (k === 'GOOGLE_API_KEYS') {
            const val = envConfig[k];
            console.log(`Value length: ${val.length}`);
            console.log(`Starts with: ${val.substring(0, 5)}...`);
        }
    }
} else {
    console.log('File does NOT exist.');
}
