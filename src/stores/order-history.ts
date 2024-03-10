import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IHistory, IResponse, IResponseItem, IPagination } from '@/types/apiTypes';

interface IOrdHistoryStore {
    orderHistories: IHistory[];
    isLoading: boolean;
    orderHistory: IHistory | null;
    count: number;
}
export interface IOrdHistoriesParam extends IPagination {
    after: string;
    before: string;
}

export const useOrderHistoryStore = defineStore({
    id: 'orderHistory',
    state: (): IOrdHistoryStore => ({
        orderHistories: [],
        isLoading: false,
        orderHistory: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getOrderHistories(params?: IOrdHistoriesParam) {
            this.isLoading = true;
            console.log('params', getParams(params));
            return await http
                .get(`/order-history${getParams(params)}`)
                .then((res: IResponse<IHistory>) => {
                    this.isLoading = false;
                    this.orderHistories = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: any) => {
                    this.isLoading = false;
                    this.orderHistories = [];
                    this.count = 0;
                    return errorHandler(err);
                });
        },

        async getOrderHistory(orderHistoryId?: string) {
            this.isLoading = true;
            return await http
                .get(`/order-history/${orderHistoryId}`)
                .then((res: IResponseItem<IHistory>) => {
                    this.isLoading = false;
                    this.orderHistory = res.data;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.orderHistory = null;
                    return errorHandler(err);
                });
        }
    }
});
