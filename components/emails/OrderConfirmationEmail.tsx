import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  confirmationToken: string;
  items: {
    productName: string;
    quantity: number;
    price: string;
    image?: string;
  }[];
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  totalAmount,
  confirmationToken,
  items,
}: OrderConfirmationEmailProps) => {
  const statusUrl = `${baseUrl}/checkout/order-confirmation/${confirmationToken}`;

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation #{orderNumber}</Preview>
      <Tailwind>
        <Body className='bg-slate-50 my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white'>
            <Section className='mt-[32px] text-center'>
              <Heading className='text-black text-[24px] font-semibold p-0 my-[30px] mx-0'>
                Order Confirmed!
              </Heading>
              <Text className='text-slate-600 text-[14px] leading-[24px]'>
                Hello {customerName},
              </Text>
              <Text className='text-slate-600 text-[14px] leading-[24px]'>
                Your order <strong>#{orderNumber}</strong> has been received and
                is being processed.
              </Text>
            </Section>

            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={statusUrl}
              >
                Track Your Order
              </Button>
            </Section>

            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />

            <Section>
              <Text className='text-black text-[16px] font-bold mb-4'>
                Order Summary
              </Text>
              {items.map((item, index) => (
                <Row key={index} className='mb-4'>
                  <Column className='w-[64px]'>
                    {item.image && (
                      <Img
                        src={item.image}
                        width='64'
                        height='64'
                        className='rounded object-cover'
                        alt={item.productName}
                      />
                    )}
                  </Column>
                  <Column className='pl-4'>
                    <Text className='text-[14px] font-semibold m-0'>
                      {item.productName}
                    </Text>
                    <Text className='text-[12px] text-slate-500 m-0 mt-1'>
                      Qty: {item.quantity} × ${item.price}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />

            <Section>
              <Row>
                <Column>
                  <Text className='text-[16px] font-bold m-0'>
                    Total Amount
                  </Text>
                </Column>
                <Column align='right'>
                  <Text className='text-[18px] font-bold m-0 text-black'>
                    ${totalAmount}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />

            <Section className='text-center'>
              <Text className='text-slate-400 text-[12px] leading-[24px]'>
                If you have any questions, simply reply to this email. <br />©
                2026 Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
