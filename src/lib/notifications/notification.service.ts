import { WhatsAppProvider } from "./whatsapp.provider";
import { OfficialApiProvider } from "./providers/official-api.provider";
import { MockWhatsAppProvider } from "./providers/mock.provider";
import { sendEmail } from "./email.provider";
import { render } from "@react-email/components";
import { BookingConfirmationEmail } from "./emails/BookingConfirmation";
import { AppointmentStatusEmail } from "./emails/AppointmentStatus";
import { MaintenanceReminderEmail } from "./emails/MaintenanceReminder";
import { NewBookingAdminAlertEmail } from "./emails/NewBookingAdminAlert";


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

  public isEmailEnabled() {
    return !!process.env.RESEND_API_KEY;
  }

  public getProviderName() {
    return this.providerName;
  }

  public async sendWhatsApp(
    phone: string,
    message: string,
  ): Promise<{ success: boolean; error?: string }> {
    let normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.startsWith("01") && normalizedPhone.length === 11) {
      normalizedPhone = "20" + normalizedPhone.substring(1);
    } else if (normalizedPhone.startsWith("1") && normalizedPhone.length === 10) {
      normalizedPhone = "20" + normalizedPhone;
    }

    try {
      const result = await this.provider.sendMessage(normalizedPhone, message);
      return { success: result.success, error: result.error };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
    }
  }

  public async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ success: boolean; error?: string }> {
    return sendEmail({ to, subject, html });
  }

  public async sendBookingConfirmationEmail(
    to: string,
    customerName: string,
    serviceType: string,
    date: string,
  ): Promise<{ success: boolean; error?: string }> {
    const html = await render(
      BookingConfirmationEmail({ customerName, serviceType, date }),
    );
    return this.sendEmail(to, "تم استلام طلب حجزك — The Drive Center", html);
  }

  public async sendAppointmentStatusEmail(
    to: string,
    customerName: string,
    statusLabel: string,
    statusEmoji: string,
    serviceType: string,
    date: string,
  ): Promise<{ success: boolean; error?: string }> {
    const html = await render(
      AppointmentStatusEmail({ customerName, statusLabel, statusEmoji, serviceType, date }),
    );
    return this.sendEmail(to, `تحديث حجزك: ${statusLabel} — The Drive Center`, html);
  }

  public async sendMaintenanceReminderEmail(
    to: string,
    customerName: string,
    reminderLabel: string,
    reminderDate: string,
    plateNumber: string,
  ): Promise<{ success: boolean; error?: string }> {
    const html = await render(
      MaintenanceReminderEmail({ customerName, reminderLabel, reminderDate, plateNumber }),
    );
    return this.sendEmail(to, `تذكير: موعد ${reminderLabel} لسيارتك — The Drive Center`, html);
  }

  public async sendNewBookingAdminAlertEmail(
    to: string,
    customerName: string,
    phone: string,
    email: string,
    serviceType: string,
    date: string,
    plateNumber: string,
    adminUrl: string,
  ): Promise<{ success: boolean; error?: string }> {
    const html = await render(
      NewBookingAdminAlertEmail({
        customerName,
        phone,
        email,
        serviceType,
        date,
        plateNumber,
        adminUrl,
      }),
    );
    return this.sendEmail(to, "حجز جديد من الموقع — The Drive Center", html);
  }


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
