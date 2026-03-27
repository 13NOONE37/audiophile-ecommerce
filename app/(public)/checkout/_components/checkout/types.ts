export interface CheckoutFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  paymentMethod: string;
  eMoneyNumber: string;
  eMoneyPin: string;
}

export type FormErrors = Partial<Record<keyof CheckoutFormState, string>>;

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
