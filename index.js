// helper to allow "require" in imports
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

const fs = require('fs');

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

// Assumes there are no inner brackets!
function removeFirstBracketedSubstring(inputString) {
  const openingBracketIndex = inputString.indexOf('[');
  if (openingBracketIndex === -1) {
    console.log("!! No opening square bracket found !!");
    return "";
  }

  const closingBracketIndex = inputString.indexOf(']');
  if (closingBracketIndex === -1) {
    console.log("!! No closing square bracket found !!");
    return "";
  }

  // If the opening bracket is not the first character, find the index of the character before it
  let startIndex = openingBracketIndex;
  if (startIndex !== 0) {
    startIndex = openingBracketIndex - 1;
  }

  // If the closing bracket is not the last character, find the index of the character after it
  let endIndex = closingBracketIndex;
  if (endIndex !== inputString.length - 1) {
    endIndex = closingBracketIndex + 1;
  }

  // Extract the substring between the opening and closing brackets
  return inputString.substring(startIndex, endIndex);  
}

function extractList(input) {
  const list = input
                .trim()
                .replace('[', '')
                .replace(']', '')
                .split(" ");  
  list.shift();
  return list;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
}

function processUserInput(callback) {
  readline.question("> ", (userInput)=> {
    if (userInput[0] == '[') {
      if (userInput == '[quit]') {
        userContinue = false;
        callback("Goodbye");
      }
      // [load /Users/quintinb/Sandbox/BigQuery/schema.json] What does schema.json describe?
      if (userInput.includes('[load')) {        
        const inputStr = removeFirstBracketedSubstring(userInput);
        const fileList = extractList(inputStr);

        console.log("LOAD STRING: " + inputStr);
        console.log("FILE LIST:   " + fileList);

        let loadedData = "";
        for (let index in fileList) {
          loadedData += "The contents of " + fileList[index] + " is :\n" + readFile(fileList[index]) + "\n end of " + fileList[index] +"\n";
          // console.log("FILE NAME    : " + fileList[index]);
          // console.log("FILE CONTENTS: \n" + readFile(fileList[index]));
        }
        const newUserInput = loadedData + userInput.replace(inputStr, '');        

        callback(newUserInput);
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
