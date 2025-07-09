import 'dotenv/config';
import OpenAI from 'openai';
import Parser from 'rss-parser';
import { NewsItem, OpenAIMessage } from '../types';
import { AI_NEWS_CONFIG, RSS_CONFIG, RELEVANT_KEYWORDS } from '../config';

const parser = new Parser();
const openai = new OpenAI({ 
  apiKey: process.env['OPENAI_API_KEY'] 
});

function isRelevant(headline: NewsItem): boolean {
  return RELEVANT_KEYWORDS.some(keyword =>
    headline.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

async function getTodayRelevantHeadlines(): Promise<string[]> {
  try {
    const feed = await parser.parseURL(RSS_CONFIG.url);
    
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return feed.items
      .filter(item => {
        if (!item.pubDate) return false;
        const pubDate = new Date(item.pubDate).toISOString().slice(0, 10);
        return (pubDate === today || pubDate === yesterday) && isRelevant(item as NewsItem);
      })
      .slice(0, RSS_CONFIG.maxItems)
      .map(item => `- ${item.title} (${item.link})`);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}

export async function generateAINews(): Promise<string> {
  try {
    const headlines = await getTodayRelevantHeadlines();
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    if (headlines.length === 0) {
      console.log("No relevant dev-focused AI news found today.");
      return `AI News for ${today}: No relevant AI/full-stack news today.`;
    }

    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides concise, engaging AI and dev-focused news summaries. Format responses as a single paragraph starting with 'AI News for [DATE]' where [DATE] will be provided. Keep the entire message under 500 characters. Focus only on relevant advancements in AI, dev tools, model launches, frameworks, APIs, and software engineering."
      },
      {
        role: "user",
        content:
          `Summarize these headlines into a single paragraph starting with 'AI News for ${today}' (max ${AI_NEWS_CONFIG.maxCharacters} characters total). Only cover today's news and ignore anything irrelevant to devs:\n\n${headlines.join("\n")}`
      }
    ];

    const response = await openai.chat.completions.create({
      model: AI_NEWS_CONFIG.model,
      messages,
      max_tokens: AI_NEWS_CONFIG.maxTokens,
      temperature: AI_NEWS_CONFIG.temperature,
    });

    const newsContent = response.choices[0]?.message?.content;
    if (!newsContent) {
      throw new Error('No content received from OpenAI');
    }
    
    console.log('Generated Dev-Focused AI News:\n', newsContent);
    console.log(`\nCharacter count: ${newsContent.length}`);
    return newsContent;
  } catch (error) {
    console.error('Error generating AI news:', error);
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `AI News for ${today}: Unable to fetch AI news at the moment.`;
  }
}

if (require.main === module) {
  generateAINews();
} 