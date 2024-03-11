# llama-node
A nodejs llamba cpp terminal client. Based off of [node-llama-cpp][0]

## Requirements

- [nodeenv][1] - A node virtual environment
- node v21.7.0 - I was using 18 and it just wouldn't work

## Running

### Installation

The [`./setup.sh`][2] script:
- Creates a virtual environment
- Creates a `models` folder
- Downloads a model (big file!)

### Execution

The [`./go`][3] script:
- Starts the virtual environment
- Runs the nodejs server
- Exits the virtual environment on completion

### Termination

You can use the [quit] command from the prompt or simply terminate the process.

### Environment variables

You can change the following elements from environment variables:

| Variable name | Default | 
|-|-|
| LLAMA_MODEL | capybarahermes-2.5-mistral-7b.Q4_K_M.gguf |
| LLAMA_MODEL_DIR | \models |

## Future work

- Allow files to be loaded.
```
# [load path] prompt
# Example
[load path\to\file.txt] Summarize this file
```
- Also allow [load ...] to download web pages

### Dynamic models
- Let the user choose from the models from the models folder at run time
- Allow users to download models from the 


[0]: https://withcatai.github.io/node-llama-cpp/guide/
[1]: https://github.com/ekalinin/nodeenv
[2]: setup.sh
[3]: go