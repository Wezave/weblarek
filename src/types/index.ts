export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "cash" | "card";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse extends IBuyer {
  items: IProduct[];
  total: number;
}

export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export type IBuyerValidate = Partial<Record<keyof IBuyer, string>>;
