import { IApi } from '../types';
import { IProductsResponse, IOrderData, IOrderResponse } from '../types';

export class LarekApi {
    constructor(private api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product');
    }

    postOrder(order: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}