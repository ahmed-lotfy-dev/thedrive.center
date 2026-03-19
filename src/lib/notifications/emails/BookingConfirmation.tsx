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
} from "@react-email/components";

interface BookingConfirmationProps {
  customerName: string;
  serviceType: string;
  date: string;
}

export function BookingConfirmationEmail({
  customerName,
  serviceType,
  date,
}: BookingConfirmationProps) {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>تم استلام طلب حجزك في The Drive Center</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>The Drive Center 🚗</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>أهلاً يا {customerName} 👋</Heading>
            <Text style={paragraph}>
              وصلنا طلب حجزك وإحنا بنراجعه دلوقتي. هنتواصل معك لتأكيد الموعد.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailRow}>
                <strong>الخدمة:</strong> {serviceType}
              </Text>
              <Text style={detailRow}>
                <strong>التاريخ المطلوب:</strong> {date}
              </Text>
              <Text style={detailRow}>
                <strong>الحالة:</strong> قيد المراجعة ⏳
              </Text>
            </Section>

            <Text style={paragraph}>
              لو عندك أي استفسار، تقدر تتواصل معنا على واتساب في أي وقت.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>The Drive Center — أفضل خدمة لعربيتك</Text>
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

const hr = {
  borderColor: "#222",
  margin: "24px 0 16px",
};

const footer = {
  color: "#52525b",
  fontSize: "12px",
  textAlign: "center" as const,
};
