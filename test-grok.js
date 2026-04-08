import { puter } from '@heyputer/puter.js';

const models = ["gpt-4o", "claude-3-5-sonnet", "gpt-4o-mini"];

async function diagnostic() {
  for (const model of models) {
    console.log(`--- Testing model: ${model} ---`);
    try {
      const response = await puter.ai.chat("Say 'working'", { model: model });
      console.log("SUCCESS! Full Response:", JSON.stringify(response, null, 2));
      console.log("Content:", response.message?.content || response.content);
      return; // Stop if we find a working model
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  console.log("All models failed.");
}

diagnostic();
