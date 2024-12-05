type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  verified: boolean;
  blocked: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentTransaction = {
  id: number;
  user: User;
  amount: number;
  txnRef: string | null;
  orderInfo: string | null;
  bankCode: string | null;
  transactionNo: string | null;
  transactionStatus: string | null;
  cardType: string;
  bankTranNo: string | null;
  paid_at: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponsePayment = {
  status: number;
  message: string;
  payload: PaymentTransaction[];
};
