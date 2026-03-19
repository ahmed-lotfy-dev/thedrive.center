export const dynamic = "force-dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LayoutList, Settings2 } from "lucide-react";
import { NotificationLog } from "@/features/admin/components/NotificationLog";
import { NotificationSettings } from "@/features/admin/components/NotificationSettings";
import { getNotificationSettings, getNotificationLog } from "@/server/actions/notification-settings";

export default async function NotificationsPage() {
  const [settings, logResult] = await Promise.all([
    getNotificationSettings(),
    getNotificationLog(1, 30),
  ]);

  const notificationSettings = settings.success
    ? settings.data
    : {
        email_notifications_enabled: "true",
        whatsapp_notifications_enabled: "false",
        notification_from_email: "",
        maintenance_reminder_days: "3",
      };

  const events = logResult.success ? logResult.data : [];

  const whatsappApiConfigured =
    !!process.env.WHATSAPP_ACCESS_TOKEN &&
    !!process.env.WHATSAPP_PHONE_NUMBER_ID &&
    process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true";

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-emerald-500" />
        <div>
          <h1 className="text-2xl font-black font-cairo text-primary tracking-tight">الإشعارات</h1>
          <p className="text-muted-foreground text-sm mt-0.5">إدارة قنوات الإشعارات وسجل الإرسال</p>
        </div>
      </div>

      <Tabs defaultValue="log" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger value="log" className="gap-2 text-sm">
            <LayoutList className="h-4 w-4" />
            سجل الإشعارات
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 text-sm">
            <Settings2 className="h-4 w-4" />
            إعدادات القنوات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <NotificationLog events={events} />
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings
            settings={notificationSettings}
            whatsappApiConfigured={whatsappApiConfigured}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
