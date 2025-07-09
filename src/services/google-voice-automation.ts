import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page, Browser } from 'puppeteer';
import { GOOGLE_VOICE_CONFIG } from '../config';

puppeteer.use(StealthPlugin());

export class GoogleVoiceAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: GOOGLE_VOICE_CONFIG.headless,
        executablePath: GOOGLE_VOICE_CONFIG.executablePath,
        userDataDir: GOOGLE_VOICE_CONFIG.userDataDir,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications'],
      });

      this.page = await this.browser.newPage();
      await this.page.goto('https://voice.google.com/u/0/messages', { 
        waitUntil: 'networkidle2' 
      });
    } catch (error) {
      console.error('Error initializing browser:', error);
      throw error;
    }
  }

  async checkLogin(): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      await this.page.waitForSelector('div[aria-label="Send new message"]', { timeout: 50000 });
      return true;
    } catch {
      console.log('You might need to log in manually first.');
      return false;
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      await this.page.click('div[aria-label="Send new message"]');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.enterPhoneNumber(phoneNumber);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.selectContactPill();
      
      await this.page.waitForSelector('textarea.message-input[placeholder="Type a message"]');
      await this.page.type('textarea.message-input[placeholder="Type a message"]', message);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Message sent successfully!');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  private async enterPhoneNumber(phoneNumber: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      await this.page.waitForSelector('input[aria-label="Type a name or phone number"]', { timeout: 2000 });
      await this.page.type('input[aria-label="Type a name or phone number"]', phoneNumber);
    } catch (error) {
      try {
        await this.page.waitForSelector('input[placeholder*="name"], input[placeholder*="phone"], input[placeholder*="number"]', { timeout: 3000 });
        const inputSelector = await this.page.$('input[placeholder*="name"], input[placeholder*="phone"], input[placeholder*="number"]');
        if (inputSelector) {
          await inputSelector.type(phoneNumber);
        } else {
          await this.page.keyboard.type(phoneNumber);
        }
      } catch (fallbackError) {
        await this.page.keyboard.type(phoneNumber);
      }
    }
  }

  private async selectContactPill(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      const pillSelector = 'div[role="button"].send-to-button';
      await this.page.waitForSelector(pillSelector, { timeout: 1000 });
      await this.page.click(pillSelector);
    } catch (error) {
      console.log('Pill not found, trying to select first result...');
      await this.page.keyboard.press('Enter');
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
} 