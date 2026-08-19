# 🤖 Free & Local LLM Models — Living Document

> Last updated: 2026-08-19
> This document tracks free-tier LLM models and sources that auto-update.

## 🌐 Cloud Providers with Free Tiers

| Provider          | Model                                 | Free Tier | Limits        | API               | Notes                                                                       |
| ----------------- | ------------------------------------- | --------- | ------------- | ----------------- | --------------------------------------------------------------------------- |
| **Google Gemini** | gemini-2.0-flash                      | ✅ Yes    | 1,500 req/day | Gemini API        | Free API key from [Google AI Studio](https://aistudio.google.com)           |
| **Google Gemini** | gemini-2.0-flash-lite                 | ✅ Yes    | 1,500 req/day | Gemini API        | Faster, cheaper, slightly less capable                                      |
| **Google Gemini** | gemini-2.0-flash-thinking             | ✅ Yes    | 1,500 req/day | Gemini API        | Experimental reasoning                                                      |
| **Groq**          | llama-3.3-70b                         | ✅ Yes    | Rate limited  | OpenAI-compatible | Free API key from [console.groq.com](https://console.groq.com)              |
| **Groq**          | mixtral-8x7b-32768                    | ✅ Yes    | Rate limited  | OpenAI-compatible |                                                                             |
| **Groq**          | gemma2-9b-it                          | ✅ Yes    | Rate limited  | OpenAI-compatible |                                                                             |
| **Groq**          | llama-3.1-8b-instant                  | ✅ Yes    | Rate limited  | OpenAI-compatible |                                                                             |
| **DeepSeek**      | deepseek-chat                         | ✅ Yes    | 500 req/day   | OpenAI-compatible | Free registration at [platform.deepseek.com](https://platform.deepseek.com) |
| **OpenRouter**    | meta-llama/llama-3.2-3b-instruct:free | ✅ Yes    | 20 req/min    | OpenAI-compatible | Free via [openrouter.ai](https://openrouter.ai)                             |
| **OpenRouter**    | google/gemma-2-9b-it:free             | ✅ Yes    | 20 req/min    | OpenAI-compatible |                                                                             |
| **OpenRouter**    | mistralai/mistral-7b-instruct:free    | ✅ Yes    | 20 req/min    | OpenAI-compatible |                                                                             |
| **OpenRouter**    | microsoft/phi-3-mini-128k:free        | ✅ Yes    | 20 req/min    | OpenAI-compatible |                                                                             |
| **Mistral**       | mistral-small-latest                  | ✅ Yes    | 1 req/sec     | OpenAI-compatible | Free tier via [console.mistral.ai](https://console.mistral.ai)              |
| **Cohere**        | command-r7b                           | ✅ Yes    | 100 req/month | Cohere API        | Free tier via [dashboard.cohere.com](https://dashboard.cohere.com)          |

## 🖥️ Local Models (No API Key Needed)

### Lightweight but Good (≤ 8B params, runs on 8GB RAM)

| Model            | Size | Quality | Use Case                           | Ollama Command            |
| ---------------- | ---- | ------- | ---------------------------------- | ------------------------- |
| **Gemma 2 2B**   | 2B   | ★★★★    | Fast chat, simple code             | `ollama pull gemma2:2b`   |
| **Llama 3.2 3B** | 3B   | ★★★★☆   | General purpose, good for its size | `ollama pull llama3.2:3b` |
| **Phi-3 Mini**   | 3.8B | ★★★★☆   | Reasoning, coding                  | `ollama pull phi3:mini`   |
| **Qwen 2.5 3B**  | 3B   | ★★★★    | Coding, multilingual               | `ollama pull qwen2.5:3b`  |
| **Mistral 7B**   | 7B   | ★★★★    | General, balanced                  | `ollama pull mistral`     |
| **Llama 3.1 8B** | 8B   | ★★★★★   | Best all-around <8B                | `ollama pull llama3.1:8b` |

### Mid-weight (8-14B, needs 12-16GB RAM)

| Model                      | Size | Quality | Use Case               | Ollama Command                      |
| -------------------------- | ---- | ------- | ---------------------- | ----------------------------------- |
| **Qwen 2.5 14B**           | 14B  | ★★★★★   | Coding, reasoning      | `ollama pull qwen2.5:14b`           |
| **Phi-4 14B**              | 14B  | ★★★★★   | Reasoning, math        | `ollama pull phi4`                  |
| **DeepSeek Coder V2 Lite** | 16B  | ★★★★★   | Best coding model <20B | `ollama pull deepseek-coder-v2:16b` |

### Heavy (needs 24GB+ VRAM)

| Model               | Size | Quality | Use Case           | Ollama Command                |
| ------------------- | ---- | ------- | ------------------ | ----------------------------- |
| **Llama 3.3 70B**   | 70B  | ★★★★★   | Production quality | `ollama pull llama3.3:70b`    |
| **Qwen 2.5 72B**    | 72B  | ★★★★★   | Top-tier coding    | `ollama pull qwen2.5:72b`     |
| **DeepSeek R1 32B** | 32B  | ★★★★★   | Reasoning          | `ollama pull deepseek-r1:32b` |

## 🔍 Auto-Scanning Sources

These URLs are checked periodically for new free models:

| Source                     | URL                                                                               | What It Provides                     |
| -------------------------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| **OpenRouter Free Models** | `https://openrouter.ai/api/v1/models`                                             | Filter by `price: 0` for free models |
| **GitHub Awesome List**    | `https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md` | Curated free API list                |
| **Ollama Library**         | `https://ollama.com/library`                                                      | All downloadable local models        |
| **HuggingFace Trending**   | `https://huggingface.co/models?pipeline_tag=text-generation&sort=trending`        | Newest models                        |
| **Google AI Studio**       | `https://aistudio.google.com`                                                     | Gemini free tier status              |

## 📋 How to Scan for New Models

The app includes a model scanner that can check these sources:

1. **OpenRouter**: `GET https://openrouter.ai/api/v1/models` → filter `data[].pricing.prompt === "0"`
2. **Ollama local**: `GET http://localhost:11434/api/tags` → returns installed models
3. **GitHub**: Parse the awesome-list markdown for new entries

To enable auto-scanning, open the Chat IA panel → Providers → "Scan for new models".

## 🛠️ LM Studio / Jan AI / llama.cpp

These local servers provide OpenAI-compatible APIs:

- **Ollama**: `http://localhost:11434/v1` (OpenAI-compatible endpoint available)
- **LM Studio**: `http://localhost:1234/v1`
- **Jan AI**: `http://localhost:1337/v1`
- **llama.cpp server**: `http://localhost:8080/v1`
- **LiteLLM Proxy**: `http://localhost:4000/v1`
- **vLLM**: `http://localhost:8000/v1`
- **LocalAI**: `http://localhost:8080/v1`
- **Text-Gen-WebUI**: `http://localhost:5000/v1`

The app auto-detects any of these running on your machine.
