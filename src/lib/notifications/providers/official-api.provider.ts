import { WhatsAppProvider } from "../whatsapp.provider";

export class OfficialApiProvider implements WhatsAppProvider {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion = "v21.0";

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  async initialize(): Promise<void> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.warn("WhatsApp Official API credentials missing. Messages will not be sent.");
    }
  }

  isReady(): boolean {
    return !!(this.accessToken && this.phoneNumberId);
  }

  async sendMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: "Provider not configured" };
    }

    // Normalize phone number (ensure no + and correct format)
    const cleanTo = to.replace(/\D/g, "");

    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanTo,
            type: "text",
            text: { body: message },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error?.message || "Failed to send message via WhatsApp Cloud API" 
        };
      }

      return { 
        success: true, 
        messageId: data.messages?.[0]?.id 
      };
    } catch (error: any) {
      console.error("WhatsApp API Error:", error);
      return { success: false, error: error.message };
    }
  }
}
