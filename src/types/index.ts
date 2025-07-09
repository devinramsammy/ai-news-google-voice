export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
}

export interface RSSFeed {
  items: NewsItem[];
  title?: string;
  description?: string;
  link?: string;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GoogleVoiceConfig {
  phoneNumber: string;
  headless: boolean;
  userDataDir: string;
  executablePath: string;
}

export interface AINewsConfig {
  maxTokens: number;
  temperature: number;
  model: string;
  maxCharacters: number;
} 