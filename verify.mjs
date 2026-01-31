import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const models = ['gemini-1.5-pro-latest', 'gemini-1.5-flash', 'gemini-pro'];

async function main() {
    for (const modelId of models) {
        try {
            console.log(`Testing model: ${modelId}...`);
            const result = streamText({
                model: google(modelId),
                prompt: 'Hello',
            });

            process.stdout.write(`Response from ${modelId}: `);
            for await (const chunk of result.textStream) {
                process.stdout.write(chunk);
            }
            console.log('\nSuccess!');
            return;
        } catch (error) {
            console.error(`Failed with ${modelId}:`, error.message);
        }
    }
    console.log('All models failed.');
}

main();
