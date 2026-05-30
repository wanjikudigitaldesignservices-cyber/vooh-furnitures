import * as React from "react";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

interface OrderReceiptEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: string;
  deliveryAddress?: string;
  branchPickup?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vooh-furnitures.vercel.app";

export default function OrderReceiptEmail({
  orderId,
  customerName,
  items,
  subtotal,
  deliveryFee,
  total,
  deliveryMethod,
  deliveryAddress,
  branchPickup,
}: OrderReceiptEmailProps) {
  const shortOrderId = orderId.split('-')[0].toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Your Vooh Furnitures Order Receipt #{shortOrderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>VOOH FURNITURES</Text>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>Thank you for your order!</Heading>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              We've received your M-PESA payment and your order is now confirmed. We're getting everything ready for you.
            </Text>
            
            <Section style={orderInfoSection}>
              <Row>
                <Column>
                  <Text style={orderInfoLabel}>Order Number</Text>
                  <Text style={orderInfoValue}>#{shortOrderId}</Text>
                </Column>
                <Column>
                  <Text style={orderInfoLabel}>Date</Text>
                  <Text style={orderInfoValue}>{new Date().toLocaleDateString()}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            <Heading as="h3" style={sectionTitle}>Order Summary</Heading>
            
            <Section>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={{ width: '60px' }}>
                    {item.image ? (
                      <Img 
                        src={item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`} 
                        width="50" 
                        height="50" 
                        style={itemImage} 
                      />
                    ) : (
                      <div style={itemImagePlaceholder} />
                    )}
                  </Column>
                  <Column>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQty}>Qty: {item.qty}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={itemPrice}>KES {(item.price * item.qty).toLocaleString()}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            <Section style={totalsSection}>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Subtotal</Text></Column>
                <Column align="right"><Text style={totalValue}>KES {subtotal.toLocaleString()}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Delivery Fee</Text></Column>
                <Column align="right"><Text style={totalValue}>KES {deliveryFee.toLocaleString()}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={grandTotalLabel}>Total Paid</Text></Column>
                <Column align="right"><Text style={grandTotalValue}>KES {total.toLocaleString()}</Text></Column>
              </Row>
            </Section>

            <Hr style={divider} />

            <Heading as="h3" style={sectionTitle}>Delivery Details</Heading>
            <Section style={deliverySection}>
              <Text style={paragraph}>
                <strong>Method:</strong> {deliveryMethod === 'home' ? 'Home Delivery' : 'Store Pickup'}
              </Text>
              {deliveryMethod === 'home' ? (
                <Text style={paragraph}>
                  <strong>Address:</strong><br />
                  {deliveryAddress}
                </Text>
              ) : (
                <Text style={paragraph}>
                  <strong>Pickup Branch:</strong><br />
                  {branchPickup}
                </Text>
              )}
            </Section>

          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              Vooh Furnitures, Nairobi, Kenya
            </Text>
            <Text style={footerText}>
              If you have any questions, reply to this email or contact us at support@voohfurnitures.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#544031", // Walnut color
  padding: "30px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  textAlign: "center" as const,
};

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "2px",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  marginTop: "0",
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "0 0 16px",
};

const orderInfoSection = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "6px",
  marginTop: "24px",
};

const orderInfoLabel = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  color: "#6b7280",
  fontWeight: "bold",
  margin: "0 0 4px",
};

const orderInfoValue = {
  fontSize: "16px",
  color: "#111827",
  fontWeight: "bold",
  margin: "0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#111827",
  marginTop: "0",
  marginBottom: "20px",
};

const itemRow = {
  marginBottom: "16px",
};

const itemImage = {
  borderRadius: "4px",
  objectFit: "cover" as const,
};

const itemImagePlaceholder = {
  width: "50px",
  height: "50px",
  backgroundColor: "#f3f4f6",
  borderRadius: "4px",
};

const itemName = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#111827",
  margin: "0 0 4px",
};

const itemQty = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#111827",
  margin: "0",
};

const totalsSection = {
  width: "100%",
};

const totalRow = {
  marginBottom: "12px",
};

const totalLabel = {
  fontSize: "16px",
  color: "#4b5563",
  margin: "0",
};

const totalValue = {
  fontSize: "16px",
  color: "#111827",
  margin: "0",
};

const grandTotalLabel = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const grandTotalValue = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#544031", // Walnut
  margin: "0",
};

const deliverySection = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const footer = {
  padding: "32px 20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  lineHeight: "16px",
  color: "#9ca3af",
  margin: "0 0 8px",
};
