import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NotificationEmailProps {
  taskId?: string;
}

export const NotificationEmail = ({
  taskId = "1234",
}: NotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu ticket #{taskId} ha recibido una actualización</Preview>
      <Body style={main}>
        <Container style={container}>
          <img
            src="https://soporte.gestoru.com/gestoru-logo.webp"
            alt="Company Logo"
            style={logo}
          />
          <Heading style={heading}>
            Tu ticket #{taskId} ha recibido una actualización
          </Heading>
          <Section style={buttonContainer}>
            <Text style={text}>
              Tu ticket de soporte ha recibido un nuevo comentario.
            </Text>
            <Button
              style={button}
              href={`http://soporte.gestoru.com?ticket=${taskId}`}
            >
              Ver ticket
            </Button>
          </Section>
          <Text style={footer}>
            © {new Date().getFullYear()} Gestoru Software
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "600px",
  padding: "20px",
  textAlign: "center" as const,
};

const logo = {
  maxWidth: "80px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const heading = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "700",
  marginTop: "15px",
  marginBottom: "15px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "15px",
};

const buttonContainer = {
  marginTop: "15px",
  marginBottom: "15px",
};

const button = {
  backgroundColor: "#26AE60",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "700",
  padding: "12px 20px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  marginTop: "25px",
};
