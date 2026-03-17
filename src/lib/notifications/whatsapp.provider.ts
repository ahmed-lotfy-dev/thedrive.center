export interface WhatsAppProvider {
  /**
   * Sends a message to a specific phone number.
   * @param to The recipient's phone number (with country code, e.g., "201012345678").
   * @param message The text message to send.
   */
  sendMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;

  /**
   * Initializes the provider (e.g., connects to the API or starts the browser).
   */
  initialize(): Promise<void>;

  /**
   * Checks if the provider is ready to send messages.
   */
  isReady(): boolean;
}
