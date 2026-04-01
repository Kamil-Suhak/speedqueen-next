import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nowe pytanie od: {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>
              Zostało wysłane nowe pytanie poprzez formularz kontaktowy
            </Text>
            
            <Text style={paragraph}>
              <strong>Imię i nazwisko:</strong> {name}
            </Text>
            
            <Text style={paragraph}>
              <strong>E-mail:</strong> {email}
            </Text>
            
            <Text style={paragraph}>
              <strong>Wiadomość:</strong>
            </Text>
            <Text style={messageBox}>
              {message}
            </Text>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              Aby odpowiedzieć na pytanie, napisz maila na adres: {email} lub kliknij 'Odpowiedz'
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const heading = {
  fontSize: "20px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};

const messageBox = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
  backgroundColor: "#f4f4f4",
  padding: "16px",
  borderRadius: "8px",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
};

export default ContactFormEmail;

