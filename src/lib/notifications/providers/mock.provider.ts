import { WhatsAppProvider } from "../whatsapp.provider";

export class MockWhatsAppProvider implements WhatsAppProvider {
  async initialize(): Promise<void> {
    console.log("[MockWhatsApp] Initialized. Messages will be logged to console.");
  }

  isReady(): boolean {
    return true;
  }

  async sendMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`[MockWhatsApp] To: ${to} | Message: ${message}`);
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}
