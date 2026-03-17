import { WhatsAppProvider } from "./whatsapp.provider";
import { OfficialApiProvider } from "./providers/official-api.provider";
import { MockWhatsAppProvider } from "./providers/mock.provider";

export class NotificationService {
  private static instance: NotificationService;
  private provider: WhatsAppProvider;

  private constructor() {
    // Choose provider based on environment
    const useMock = process.env.NODE_ENV === "development" || !process.env.WHATSAPP_ACCESS_TOKEN;
    
    if (useMock) {
      this.provider = new MockWhatsAppProvider();
    } else {
      this.provider = new OfficialApiProvider();
    }
    
    this.provider.initialize();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Sends a WhatsApp message to a user.
   * @param phone The user's phone number.
   * @param message The message content.
   */
  public async sendWhatsApp(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
    // Basic Egyptian number normalization
    let normalizedPhone = phone.replace(/\D/g, "");
    
    // If it starts with 01, prepend 20 (Egypt)
    if (normalizedPhone.startsWith("01") && normalizedPhone.length === 11) {
      normalizedPhone = "20" + normalizedPhone.substring(1);
    } 
    // If it starts with 1, prepend 20 (Egypt)
    else if (normalizedPhone.startsWith("1") && normalizedPhone.length === 10) {
      normalizedPhone = "20" + normalizedPhone;
    }

    try {
      const result = await this.provider.sendMessage(normalizedPhone, message);
      return { success: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Specific notification for car history/service updates.
   */
  public async notifyServiceUpdate(phone: string, customerName: string, plateNumber: string, status: string) {
    const message = `أهلاً يا ${customerName} 👋\n\nتم تحديث حالة سيارتك ذات اللوحة (${plateNumber}) إلى: *${status}*.\n\nيمكنك متابعة التفاصيل عبر حسابك في المركز الهندسي.\nThe Drive Center 🚗`;
    return this.sendWhatsApp(phone, message);
  }

  /**
   * Notification for appointment confirmation.
   */
  public async notifyAppointment(phone: string, customerName: string, date: string, type: string) {
    const message = `أهلاً يا ${customerName} 👋\n\nتم تأكيد موعدك في المركز الهندسي لخدمة: *${type}*.\nالموعد: ${date}\n\nنحن في انتظارك!\nThe Drive Center 🚗`;
    return this.sendWhatsApp(phone, message);
  }
}

export const notificationService = NotificationService.getInstance();
