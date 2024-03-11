#!/bin/sh

# Currently this is hardcoded, it's used in index.js

MODEL_SOURCE=https://huggingface.co/TheBloke/CapybaraHermes-2.5-Mistral-7B-GGUF/resolve/main/capybarahermes-2.5-mistral-7b.Q4_K_M.gguf

nodeenv env
. env/bin/activate

NODE_VERSION=$(node -v)
echo " --> Current node version is [$NODE_VERSION]. Recommended is at least [v21.7.0]"

echo " --> Creating model folder"
mkdir -p models
cd models
echo " --> Downloading "
npx ipull https://huggingface.co/TheBloke/CapybaraHermes-2.5-Mistral-7B-GGUF/resolve/main/capybarahermes-2.5-mistral-7b.Q4_K_M.gguf
cd ..

echo " --> Setup successful"
deactivate_node