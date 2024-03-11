import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({    
    modelPath: path.join(__dirname, "models", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf")
});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

import * as rl from 'node:readline'; // Import the entire readline module or specific methods
const { stdin: input, stdout: output } = process;
const readline = rl.createInterface({ input, output });
var userContinue = true;

async function askGemma(prompt) {
  try {
    const response = await session.prompt(prompt);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null; // Or handle the error differently
  }
}

function processUserInput(callback) {
  readline.question("> ", (userInput)=> {
    if (userInput[0] == '[') {
      if (userInput == '[quit]') {
        userContinue = false;
        callback("Goodbye");
      }
      else { // always default back here
        callback(userInput);
      }
    } else {
      callback(userInput);
    }
  });
}

(async () => {
  while (userContinue) {
    try {
      console.log("");      
      const aiPrompt = await new Promise((resolve) => processUserInput(resolve));
      const response = await askGemma(aiPrompt);
      console.log("=".repeat(10) + " [GEMMA] " + "=".repeat(10));
      console.log(response);
      console.log("=".repeat(29));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Optionally close readline here if needed
      // readline.close();
    }
  }
  readline.close();
  return;
})(); // Self-invoking async function for immediate execution

readline.on('close', () => {
  console.log('~~ Termination complete! ~~');
});
