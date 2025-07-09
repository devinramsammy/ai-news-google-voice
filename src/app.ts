import { generateAINews } from './services/ai-news-generator';
import { GoogleVoiceAutomation } from './services/google-voice-automation';
import { GOOGLE_VOICE_CONFIG } from './config';

export class AINewsApp {
  private googleVoice: GoogleVoiceAutomation;

  constructor() {
    this.googleVoice = new GoogleVoiceAutomation();
  }

  async run(): Promise<void> {
    try {
      console.log('🤖 Starting AI News Application...');
      
      console.log('📰 Generating AI news...');
      const newsMessage = await generateAINews();
      
      if (!newsMessage || newsMessage.includes('Unable to fetch AI news')) {
        console.log('❌ Failed to generate news. Exiting.');
        return;
      }

      console.log('📱 Initializing Google Voice...');
      await this.googleVoice.initialize();
      
      const isLoggedIn = await this.googleVoice.checkLogin();
      if (!isLoggedIn) {
        console.log('❌ Not logged in to Google Voice. Please log in manually first.');
        await this.googleVoice.close();
        return;
      }

      console.log('📤 Sending AI news via Google Voice...');
      const success = await this.googleVoice.sendMessage(
        GOOGLE_VOICE_CONFIG.phoneNumber, 
        newsMessage
      );

      if (success) {
        console.log('✅ AI news sent successfully!');
      } else {
        console.log('❌ Failed to send AI news.');
      }

    } catch (error) {
      console.error('❌ Application error:', error);
    } finally {
      await this.googleVoice.close();
    }
  }
}

if (require.main === module) {
  const app = new AINewsApp();
  app.run().catch(console.error);
} 