import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NewBookingAdminAlertEmailProps {
  customerName: string;
  phone: string;
  email: string;
  serviceType: string;
  date: string;
  plateNumber: string;
  adminUrl: string;
}

export function NewBookingAdminAlertEmail({
  customerName,
  phone,
  email,
  serviceType,
  date,
  plateNumber,
  adminUrl,
}: NewBookingAdminAlertEmailProps) {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>حجز جديد من الموقع — The Drive Center</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>The Drive Center Admin</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>تم استلام حجز جديد من الموقع</Heading>

            <Section style={detailsBox}>
              <Text style={detailRow}>
                <strong>العميل:</strong> {customerName}
              </Text>
              <Text style={detailRow}>
                <strong>الهاتف:</strong> {phone}
              </Text>
              <Text style={detailRow}>
                <strong>الإيميل:</strong> {email}
              </Text>
              <Text style={detailRow}>
                <strong>الخدمة:</strong> {serviceType}
              </Text>
              <Text style={detailRow}>
                <strong>التاريخ:</strong> {date}
              </Text>
              <Text style={detailRow}>
                <strong>رقم اللوحة:</strong> {plateNumber}
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={adminUrl} style={button}>
                فتح لوحة الحجوزات
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>تنبيه داخلي تلقائي من The Drive Center</Text>
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
  margin: "0 0 20px",
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
  margin: "8px 0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginTop: "24px",
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

const footer = {
  color: "#52525b",
  fontSize: "12px",
  textAlign: "center" as const,
};
