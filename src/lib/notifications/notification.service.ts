import { WhatsAppProvider } from "./whatsapp.provider";
import { OfficialApiProvider } from "./providers/official-api.provider";
import { MockWhatsAppProvider } from "./providers/mock.provider";

export class NotificationService {
  private static instance: NotificationService;
  private provider: WhatsAppProvider;
  private readonly deliveryEnabled: boolean;
  private readonly providerName: string;

  private constructor() {
    this.deliveryEnabled =
      process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true" &&
      !!process.env.WHATSAPP_ACCESS_TOKEN &&
      !!process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (this.deliveryEnabled) {
      this.provider = new OfficialApiProvider();
      this.providerName = "official_api";
    } else {
      this.provider = new MockWhatsAppProvider();
      this.providerName = process.env.NODE_ENV === "development" ? "mock" : "disabled";
    }

    this.provider.initialize();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public shouldAttemptDelivery() {
    return this.deliveryEnabled || process.env.NODE_ENV === "development";
  }

  public getProviderName() {
    return this.providerName;
  }

  /**
   * Sends a WhatsApp message to a user.
   * @param phone The user's phone number.
   * @param message The message content.
   */
  public async sendWhatsApp(
    phone: string,
    message: string,
  ): Promise<{ success: boolean; error?: string }> {
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
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
    }
  }

  /**
   * Specific notification for car history/service updates.
   */
  public async notifyServiceUpdate(
    phone: string,
    customerName: string,
    plateNumber: string,
    status: string,
  ) {
    return this.sendWhatsApp(
      phone,
      this.buildServiceUpdateMessage(customerName, plateNumber, status),
    );
  }

  /**
   * Notification for appointment confirmation.
   */
  public async notifyAppointment(
    phone: string,
    customerName: string,
    date: string,
    type: string,
  ) {
    return this.sendWhatsApp(
      phone,
      this.buildAppointmentConfirmationMessage(customerName, date, type),
    );
  }

  public buildAppointmentRequestReceivedMessage(
    customerName: string,
    date: string,
    type: string,
  ) {
    return `أهلاً يا ${customerName} 👋\n\nاستلمنا طلب حجزك لدى The Drive Center لخدمة: *${type}*.\nالتاريخ المطلوب: ${date}\n\nسنراجع الطلب ونتواصل معك لتأكيد الموعد.\nThe Drive Center 🚗`;
  }

  public buildAppointmentConfirmationMessage(
    customerName: string,
    date: string,
    type: string,
  ) {
    return `أهلاً يا ${customerName} 👋\n\nتم تأكيد موعدك لدى The Drive Center لخدمة: *${type}*.\nالموعد: ${date}\n\nنحن في انتظارك!\nThe Drive Center 🚗`;
  }

  public buildAppointmentStatusMessage(
    customerName: string,
    statusLabel: string,
    date: string,
    type: string,
  ) {
    return `أهلاً يا ${customerName} 👋\n\nتم تحديث حالة حجزك إلى: *${statusLabel}*.\nالخدمة: ${type}\nالموعد: ${date}\n\nلأي استفسار نحن معك عبر واتساب.\nThe Drive Center 🚗`;
  }

  public buildServiceUpdateMessage(
    customerName: string,
    plateNumber: string,
    status: string,
  ) {
    return `أهلاً يا ${customerName} 👋\n\nتم تحديث حالة سيارتك ذات اللوحة (${plateNumber}) إلى: *${status}*.\n\nيمكنك متابعة التفاصيل عبر حسابك في The Drive Center.\nThe Drive Center 🚗`;
  }

  public buildMaintenanceReminderMessage(
    customerName: string,
    reminderLabel: string,
    reminderDate: string,
    plateNumber: string,
  ) {
    return `أهلاً يا ${customerName} 👋\n\nتذكير من The Drive Center: موعد *${reminderLabel}* لسيارتك ذات اللوحة (${plateNumber}) اقترب.\nالتاريخ المقترح: ${reminderDate}\n\nيسعدنا مساعدتك في حجز الموعد المناسب.\nThe Drive Center 🚗`;
  }
}

export const notificationService = NotificationService.getInstance();
