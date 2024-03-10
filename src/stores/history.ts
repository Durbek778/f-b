import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IHistory, IResponse, IResponseItem, IPagination } from '@/types/apiTypes';

interface IHistoryStore {
    histories: IHistory[];
    isLoading: boolean;
    history: IHistory | null;
    count: number;
}
export interface IHistoriesParam extends IPagination {
    after: string;
    before: string;
}

export const useHistoryStore = defineStore({
    id: 'history',
    state: (): IHistoryStore => ({
        histories: [],
        isLoading: false,
        history: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getHistories(params?: IHistoriesParam) {
            this.isLoading = true;
            console.log('params', getParams(params));
            return await http
                .get(`/history${getParams(params)}`)
                .then((res: IResponse<IHistory>) => {
                    this.isLoading = false;
                    this.histories = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: any) => {
                    this.isLoading = false;
                    this.histories = [];
                    this.count = 0;
                    return errorHandler(err);
                });
        },
        async deleteHistory(historyId?: string) {
            this.isLoading = true;
            return await http
                .delete(`/history/${historyId}`)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                });
        },
        async getHistory(historyId?: string) {
            this.isLoading = true;
            return await http
                .get(`/history/${historyId}`)
                .then((res: IResponseItem<IHistory>) => {
                    this.isLoading = false;
                    this.history = res.data;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.history = null;
                    return errorHandler(err);
                });
        },
        async putHistory(data: IHistory) {
            this.isLoading = true;
            const { historyId } = data;

            return await http
                .put(`/history/${historyId}`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                });
        },
        async postHistory(data: IHistory) {
            this.isLoading = true;
            return await http
                .post(`/history`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                });
        }
    }
});
