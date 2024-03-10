import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IMenu, IResponse, IPagination, IResponseItem } from '@/types/apiTypes';

export interface IMenuStore{
    menus:IMenu[],
    menu:IMenu | null,
    count:number,
    isLoading:boolean
}
export interface IMenuParams extends IPagination{
    storeId?:number
}
export const useMenuStore = defineStore({
    id: 'menu',
    state: ():IMenuStore => ({
        menus: [],
        isLoading: false,
        menu: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getMenus(params?: IMenuParams) {
            this.isLoading = true;
            return await http
                .get(`/menu${getParams(params)}`)
                .then((res: IResponse<IMenu>) => {
                    this.isLoading = false;
                    this.menus = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.menus = [];
                    this.count = 0;
                    return   errorHandler(err);
 
                });
        },

        async getMenu(menuId: number) {
            this.isLoading = true;
            return await http
                .get(`/menu/${menuId}`)
                .then((res: IResponseItem<IMenu>) => {
                    this.menu = res.data;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.menu = null;
                    return errorHandler(err);
                });
        },   
        async postMenu(data: IMenu) {
            this.isLoading = true;
            return await http
                .post(`/menu`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                    
                });
        },   
        async updateMenu(data: IMenu) {
            this.isLoading = true;
            const { menuId, ...others } = data;
            return await http
                .put(`/menu/${menuId}`, others)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                  
                    return  errorHandler(err);
                });
        },      
        async deleteMenu(menuId: number) {
            this.isLoading = true;
            return await http
                .delete(`/menu/${menuId}`)
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
