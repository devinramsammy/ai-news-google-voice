import { GoogleVoiceConfig, AINewsConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export const GOOGLE_VOICE_CONFIG: GoogleVoiceConfig = {
  phoneNumber: process.env['GOOGLE_VOICE_PHONE_NUMBER'] as string,
  // Typed incorrectly
  headless: 'new' as unknown as boolean, 
  userDataDir: process.env['GOOGLE_VOICE_USER_DATA_DIR'] as string,
  executablePath: process.env['GOOGLE_VOICE_EXECUTABLE_PATH'] as string
};

export const AI_NEWS_CONFIG: AINewsConfig = {
  maxTokens: 300,
  temperature: 0.7,
  model: 'gpt-4o',
  maxCharacters: 500
};

export const RSS_CONFIG = {
  url: 'https://news.google.com/rss/search?q=ai+OR+tech+OR+openai+OR+full+stack+OR+software+development&hl=en-US&gl=US&ceid=US:en',
  maxItems: 7
};

export const RELEVANT_KEYWORDS = [
  'gpt', 'chatgpt', 'gpt-4', 'gpt-4o', 'dall-e', 'claude', 'llama', 'gemini', 'mixtral',
  'transformer', 'diffusion model', 'multimodal', 'llm', 'openai', 'anthropic', 'mistral', 'cohere',
  'stability ai', 'midjourney', 'machine learning', 'deep learning', 'neural network', 'fine-tuning',
  'parameter-efficient', 'prompt engineering', 'embedding model', 'vector db', 'semantic search',
  'retrieval augmented generation', 'rag', 'auto-regressive', 'self-attention',

  'langchain', 'llamaindex', 'haystack', 'transformers.js', 'pytorch', 'tensorflow',
  'onnx', 'autogen', 'open source model', 'model weights', 'checkpoint', 'inference engine',
  'streamlit', 'gradio', 'hugging face', 'weights & biases', 'wandb',

  'sdk', 'api release', 'api launch', 'devkit', 'cli tool', 'terminal tool', 'code editor',
  'vs code', 'plugin', 'extension', 'linting', 'build tool', 'dev workflow',

  'full stack', 'frontend', 'backend', 'devops', 'javascript', 'typescript',
  'react', 'next.js', 'vue', 'svelte', 'astro', 'remix', 'node.js', 'express.js',
  'bun', 'deno', 'webassembly', 'wasm', 'tailwind', 'graphql', 'rest api', 'webhook',

  'kubernetes', 'docker', 'container', 'deployment', 'edge computing', 'serverless',
  'cloudflare workers', 'vercel', 'netlify', 'firebase', 'supabase', 'lambda',
  'model serving', 'ai inference', 'endpoint', 'scaling model',

  'azure', 'aws', 'sagemaker', 'bedrock', 'gcp', 'vertex ai', 'cloud ai', 'model garden',
  'huggingface hub', 'colab', 'replicate', 'modal', 'baseten', 'runpod', 'vllm',

  'framework release', 'library launch', 'tooling update', 'beta release', 'stable release',
  'version update', 'new module', 'new package', 'npm package', 'open-source release',

  'safety', 'alignment', 'red teaming', 'evals', 'model card', 'license change', 'copyright model',

  'launches', 'announces', 'introduces', 'debuts', 'now available', 'preview release',
  'developer preview', 'generally available', 'open source', 'public repo', 'early access'
]; 