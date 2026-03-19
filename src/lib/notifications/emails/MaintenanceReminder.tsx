import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface MaintenanceReminderProps {
  customerName: string;
  reminderLabel: string;
  reminderDate: string;
  plateNumber: string;
}

export function MaintenanceReminderEmail({
  customerName,
  reminderLabel,
  reminderDate,
  plateNumber,
}: MaintenanceReminderProps) {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>تذكير بموعد {reminderLabel} لسيارتك في The Drive Center</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>The Drive Center 🚗</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>أهلاً يا {customerName} 👋</Heading>
            <Text style={paragraph}>
              بفكرك إن موعد <strong>{reminderLabel}</strong> لسيارتك ذات اللوحة (<strong>{plateNumber}</strong>) قرب. الحفاظ على الصيانة الدورية بيضمن لك أفضل أداء وأمان لعربيتك.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailRow}>
                <strong>الخدمة المطلوبة:</strong> {reminderLabel}
              </Text>
              <Text style={detailRow}>
                <strong>التاريخ المقترح:</strong> {reminderDate}
              </Text>
              <Text style={detailRow}>
                <strong>السيارة:</strong> {plateNumber}
              </Text>
            </Section>

            <Text style={paragraph}>
              تقدر تحجز موعدك دلوقتي بضغطة واحدة من خلال الموقع أو تواصل معنا مباشرة عبر واتساب.
            </Text>

            <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
              <Link
                href="https://thedrive.center/book"
                style={button}
              >
                حجز موعد الآن
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              The Drive Center — شارع النزهة، مصر الجديدة
              <br />
              هاتف: 01001234567
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0a0a0a",
  fontFamily: "'Cairo', 'Segoe UI', sans-serif",
  direction: "rtl" as const,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const header = {
  backgroundColor: "#10b981",
  borderRadius: "12px 12px 0 0",
  padding: "24px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
  margin: "0",
};

const content = {
  backgroundColor: "#111111",
  padding: "32px",
  borderRadius: "0 0 12px 12px",
  border: "1px solid #222",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#a1a1aa",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};

const detailsBox = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  borderRight: "3px solid #10b981",
};

const detailRow = {
  color: "#e4e4e7",
  fontSize: "14px",
  margin: "6px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#222",
  margin: "24px 0 16px",
};

const footerSection = {
  textAlign: "center" as const,
};

const footer = {
  color: "#52525b",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "1.5",
};
