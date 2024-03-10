import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IStore, IResponse, IPagination, IResponseItem } from '@/types/apiTypes';
interface IStoreStore {
    stores: IStore[];
    isLoading: boolean;
    store: IStore | null;
    count: number;
}
interface IStoreParams extends IPagination {
    storeName?:string
}
export const useStoreStore = defineStore({
    id: 'store',
    state: (): IStoreStore => ({
        stores: [],
        isLoading: false,
        store: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getStores(params?: IStoreParams) {
            this.isLoading = true;
            return await http
                .get(`/store${getParams(params)}`)
                .then((res: IResponse<IStore>) => {
                    this.isLoading = false;
                    this.stores = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.stores = [];
                    this.count = 0;
                    return   errorHandler(err);
 
                });
        },

        async getStore(userId: string) {
            this.isLoading = true;
            return await http
                .get(`/store/${userId}`)
                .then((res: IResponseItem<IStore>) => {
                    const usersArray: any = [res.data];
                    this.store = res.data;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.store = null;
                    return errorHandler(err);
                });
        },   
        async getStoreForSearch(storeId: number) {
            this.isLoading = true;
            return await http
                .get(`/store/${storeId}`)
                .then((res: IResponseItem<IStore>) => {
                    const usersArray: any = [res.data];
                    this.store = res.data;
                    this.stores = usersArray;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.store = null;
                    this.stores = [];
                    return errorHandler(err);
                });
        },   
        async postStore(data: IStore) {
            this.isLoading = true;
            return await http
                .post(`/store`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                    
                });
        },   
        async updateStore(data: IStore) {
            this.isLoading = true;
            const { storeId } = data;
            return await http
                .put(`/store/${storeId}`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                  
                    return  errorHandler(err);
                });
        },  
     
        async deleteStore(storeId: number) {
            this.isLoading = true;
            return await http
                .delete(`/store/${storeId}`)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return  errorHandler(err);

                });
        },

    }
});
