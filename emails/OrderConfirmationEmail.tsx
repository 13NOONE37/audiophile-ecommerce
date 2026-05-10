// emails/OrderConfirmationEmail.tsx
import { formatPrice } from '@/lib/formatters';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Row,
  Column,
  Hr,
} from '@react-email/components';

type OrderItem = {
  productName: string;
  quantity: number;
  priceAtPurchase: number;
};

type Props = {
  orderNumber: string;
  firstName: string;
  items: OrderItem[];
  totalAmount: number;
  address: {
    street: string;
    zip: string;
    city: string;
  };
};

export function OrderConfirmationEmail({
  orderNumber,
  firstName,
  items,
  totalAmount,
  address,
}: Props) {
  return (
    <Html lang='en'>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            padding: '32px',
          }}
        >
          <Heading>Thank you for your order, {firstName}!</Heading>
          <Text>
            Order number: <strong>#{orderNumber}</strong>
          </Text>

          <Hr />

          <Heading as='h2' style={{ fontSize: '18px' }}>
            Order summary
          </Heading>

          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: '8px' }}>
              <Column>
                {item.productName} × {item.quantity}
              </Column>
              <Column style={{ textAlign: 'right' }}>
                {formatPrice(item.priceAtPurchase * item.quantity)}
              </Column>
            </Row>
          ))}

          <Hr />

          <Row>
            <Column>
              <strong>Total</strong>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <strong>{formatPrice(totalAmount)}</strong>
            </Column>
          </Row>

          <Hr />

          <Heading as='h2' style={{ fontSize: '18px' }}>
            Shipping address
          </Heading>
          <Text>
            {address.street}
            <br />
            {address.zip} {address.city}
          </Text>

          <Hr />

          <Text style={{ color: '#888', fontSize: '12px' }}>
            If you have any questions, contact us at
            support@audiophile-ecommerce-bice.vercel.app
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
export default OrderConfirmationEmail;
