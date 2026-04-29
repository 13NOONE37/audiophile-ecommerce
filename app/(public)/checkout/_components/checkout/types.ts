export interface CheckoutFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
}

export type FormErrors = Partial<Record<keyof CheckoutFormState, string>>;
