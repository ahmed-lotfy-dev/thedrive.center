# Title (English)

The Drive Center - Automotive Service Platform

# Title (Arabic)

ذا درايف سنتر - منصة خدمات السيارات

# Slug

the-drive-center

# Short Description (English)

A full-stack Arabic-first platform for a specialized automotive service center in Egypt. Combines booking, customer vehicle tracking, admin operations, showcase gallery, notifications, and local SEO into one connected digital system.

# Short Description (Arabic)

منصة كاملة الوظائف مخصصة لمركز خدمة سيارات متخصص في المحلة الكبرى، مصر. تجمع بين الحجز وتتبع مركبات العملاء والعمليات الإدارية ومعرض العمل والإشعارات وSEO المحلي في نظام رقمي متصل واحد.

# Content (English)

# The Challenge

The Drive Center had strong offline credibility as a specialized automotive service center in Al Mahalla Al Kubra, Egypt. They focused on wheel alignment, tire balancing, comprehensive inspection before sale/purchase, power steering coding, suspension work, and tire services.

However, their digital workflow was fragmented:

- Bookings were handled manually through phone calls
- Customer vehicle records were scattered and hard to manage over time
- Service history was difficult to retrieve
- Completed work was not being turned into reusable public proof
- Operational content updates depended on code changes
- There was no strong admin workflow for daily operations
- The website did not fully support local discovery through search

The challenge was to build something that would help the business run better, not just look better.

# The Solution

I built a complete product around the center's real workflow:

## Public Surface

- Premium Arabic-first landing page
- Clear service positioning
- Online appointment booking flow
- Showcase pages for completed work
- Stronger local SEO structure

## Customer Surface

- Authentication with Better Auth
- Onboarding flow
- Garage-style dashboard
- Vehicle linking and tracking
- Service history visibility

## Admin Surface

- Dashboard with KPIs and charts
- Appointments management
- Customer cars management
- Service history tracking
- Showcase CMS
- Notification settings and logs
- Hero image management
- Advice/content management

## Technical Stack

- Next.js 16 (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- Better Auth
- Cloudflare R2 (media storage)
- Resend (email delivery)
- React Email (email templates)
- WhatsApp API integration
- Self-hosted via Dokploy on VPS

## Key Features

### Booking System

- Guest and authenticated booking
- Service type selection
- Vehicle type selection
- Date and time booking
- Duplicate same-day protection
- Email and WhatsApp confirmations

### Notification System

- Outbox-style notification events
- Email delivery via Resend
- WhatsApp delivery (official API)
- Admin-configurable settings
- Delivery status tracking
- Scheduled reminders

### Content Management

- Hero image management with client-side resizing
- Signed upload to Cloudflare R2
- Showcase gallery with filtering
- Advice popup system
- Dynamic site settings

### SEO & Discovery

- Route metadata
- JSON-LD for local business
- Sitemap generation
- Open Graph tags
- Arabic keyword optimization

### Background Automation

- Cron-protected notification processing
- Google Business stats sync
- Automated maintenance reminders

# Content (Arabic)

# المشكلة

ذا درايف سنتر كان لديه مصداقية قوية كمركز خدمة سيارات متخصص في المحلة الكبرى، مصر. كانوا متخصصين في تعديل المحاذاة، وموازنة الإطارات، والفحص الشامل قبل البيع أو الشراء، وبرمجة Direction Steering، والعمل على التعليق، وخدمات الإطارات.

لكن سير العمل الرقمي كان مجزأ:

- الحجوزات كانت تتم يدوياً عبر المكالمات الهاتفية
- سجلات مركبات العملاء كانت متناثرة ويصعب إدارتها بمرور الوقت
- كان من الصعب استرجاع تاريخ الخدمة
- العمل المنجز لم يُحوّل إلى محتوى عام قابل لإعادة الاستخدام
- تحديثات المحتوى التشغيلي كانت تعتمد على تغييرات الكود
- لم يكن هناك سير عمل قوي للأدمن للعمليات اليومية
- الموقع لم يدعم الاكتشاف المحلي من خلال البحث بالكامل

التحدي كان بناء شيء يساعد العمل على العمل بشكل أفضل، وليس فقط الظهور بشكل أفضل.

# الحل

بنيت منتجاً كاملاً حول سير العمل الحقيقي للمركز:

## السطح العام

- صفحة هبوط عربية أولاً ومر premium
- موقع خدمة واضح
- تدفق حجز المواعيد عبر الإنترنت
- صفحات المعرض للعمل المنجز
- هيكل SEO المحلي أقوى

## سطح العميل

- المصادقة مع Better Auth
- تدفق الإعداد الأولي
- لوحة نمط Garage
- ربط وتتبع المركبات
- رؤية تاريخ الخدمة

## سطح الأدمن

- لوحة بيانات مع KPIs ورسوم بيانية
- إدارة المواعيد
- إدارة سيارات العملاء
- تتبع تاريخ الخدمة
- إدارة معرض المحتوى
- سجل وإعدادات الإشعارات
- إدارة صورة Hero
- إدارة النصائح والمحتوى

## التقنيات المستخدمة

- Next.js 16 (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- Better Auth
- Cloudflare R2 للتخزين
- Resend لتسليم البريد الإلكتروني
- React Email للقوالب البريدية
- WhatsApp API للتكامل
- النشر الذاتي عبر Dokploy على VPS

## الميزات الرئيسية

### نظام الحجز

- حجز الضيف والمصادق
- اختيار نوع الخدمة
- اختيار نوع المركبة
- حجز التاريخ والوقت
- حماية التكرار في نفس اليوم
- تأكيدات البريد الإلكتروني و WhatsApp

### نظام الإشعارات

- نمط صندوق الإشعارات الخارجي
- تسليم البريد الإلكتروني عبر Resend
- تسليم WhatsApp عبر API الرسمي
- إعدادات قابلة للتكوين من الأدمن
- تتبع حالة التسليم
- تذكيرات مجدولة

### إدارة المحتوى

- إدارة صورة Hero مع تغيير الحجم من جانب العميل
- رفع موقيع إلى Cloudflare R2
- معرض مع التصفية
- نظام نصيحة Popup
- إعدادات ديناميكية للموقع

### SEO والاكتشاف

- البيانات التعريفية للمسار
- JSON-LD للأعمال المحلية
- توليد sitemap
- tags Open Graph
- تحسين الكلمات الرئيسية بالعربية

### الأتمتة الخلفية

- معالجة الإشعارات المحمية بـ Cron
- مزامنة إحصائيات Google Business
- تذكيرات الصيانة الآلية

# Categories

Next.js, TypeScript, PostgreSQL, Drizzle ORM, React, Tailwind CSS, Full-Stack

# Repo Link

https://github.com/ahmed-lotfy-dev/thedrive.center

# Live Link

https://thedrive.center
