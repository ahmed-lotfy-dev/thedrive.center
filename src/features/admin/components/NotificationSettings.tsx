"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MessageCircle, Clock, AlertTriangle } from "lucide-react";
import { updateNotificationSetting } from "@/server/actions/notification-settings";
import type { NotificationSettingKey } from "@/lib/constants";

interface NotificationSettingsProps {
  settings: {
    email_notifications_enabled: string;
    whatsapp_notifications_enabled: string;
    notification_from_email: string;
    maintenance_reminder_days: string;
  };
  whatsappApiConfigured: boolean;
}

export function NotificationSettings({ settings, whatsappApiConfigured }: NotificationSettingsProps) {
  const [isPending, startTransition] = useTransition();

  const [emailEnabled, setEmailEnabled] = useState(settings.email_notifications_enabled !== "false");
  const [fromEmail, setFromEmail] = useState(settings.notification_from_email);
  const [reminderDays, setReminderDays] = useState(settings.maintenance_reminder_days);
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    settings.whatsapp_notifications_enabled !== "false",
  );

  const handleToggle = (key: NotificationSettingKey, value: boolean) => {
    startTransition(async () => {
      const result = await updateNotificationSetting(key, value ? "true" : "false");
      if (result.success) {
        toast.success("تم حفظ الإعداد");
      } else {
        toast.error("فشل حفظ الإعداد");
      }
    });
  };

  const handleSaveText = (key: NotificationSettingKey, value: string) => {
    startTransition(async () => {
      const result = await updateNotificationSetting(key, value);
      if (result.success) {
        toast.success("تم الحفظ");
      } else {
        toast.error("فشل الحفظ");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="rounded-2xl border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-base">البريد الإلكتروني (Resend)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            إرسال إيميلات التأكيد والتذكير عبر Resend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">تفعيل الإيميل</Label>
            <Switch
              checked={emailEnabled}
              onCheckedChange={(val: boolean) => {
                setEmailEnabled(val);
                handleToggle("email_notifications_enabled", val);
              }}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">بريد المُرسِل</Label>
            <div className="flex gap-2">
              <Input
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="noreply@thedrive.center"
                className="text-sm h-8"
                dir="ltr"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleSaveText("notification_from_email", fromEmail)}
                disabled={isPending}
              >
                حفظ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">واتساب</CardTitle>
          </div>
          <CardDescription className="text-xs">
            إرسال رسائل واتساب (يتطلب إعداد API)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!whatsappApiConfigured && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300">
                لم يتم إعداد WhatsApp API بعد. الإشعارات عبر واتساب معطلة تلقائياً.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label className="text-sm">تفعيل واتساب</Label>
            <Switch
              checked={whatsappEnabled && whatsappApiConfigured}
              onCheckedChange={(val: boolean) => {
                if (!whatsappApiConfigured) {
                  toast.error("يجب إعداد WhatsApp API أولاً");
                  return;
                }
                setWhatsappEnabled(val);
                handleToggle("whatsapp_notifications_enabled", val);
              }}
              disabled={isPending || !whatsappApiConfigured}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            سيتم توصيل API لاحقاً إما عبر Meta Business أو BSP مثل 360dialog
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 bg-card/50 md:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-base">تذكير الصيانة</CardTitle>
          </div>
          <CardDescription className="text-xs">
            كم يوم قبل موعد الصيانة يُرسل التذكير
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              min={1}
              max={14}
              className="w-24 text-sm h-8"
              dir="ltr"
            />
            <span className="text-sm text-muted-foreground">أيام قبل الموعد</span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => handleSaveText("maintenance_reminder_days", reminderDays)}
              disabled={isPending}
            >
              حفظ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
