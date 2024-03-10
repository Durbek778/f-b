import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IOptionMenu, IResponse, IPagination, IResponseItem } from '@/types/apiTypes';

export interface IOptionMenuStore{
    option_menus:IOptionMenu[],
    option_menu:IOptionMenu | null,
    count:number,
    isLoading:boolean
}
export interface IOptionMenuParams extends IPagination{
    menuId?:number
}
export const useOptionMenuStore = defineStore({
    id: 'optionMenu',
    state: ():IOptionMenuStore => ({
        option_menus: [],
        isLoading: false,
        option_menu: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getOptionMenus(params?: IOptionMenuParams) {
            this.isLoading = true;
            return await http
                .get(`/option-menu${getParams(params)}`)
                .then((res: IResponse<IOptionMenu>) => {
                    this.isLoading = false;
                    this.option_menus = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.option_menus = [];
                    this.count = 0;
                    return   errorHandler(err);
 
                });
        },

        async getOptionMenu(optionMenuId: number) {
            this.isLoading = true;
            return await http
                .get(`/option-menu/${optionMenuId}`)
                .then((res: IResponseItem<IOptionMenu>) => {
                    this.option_menu = res.data;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.option_menu = null;
                    return errorHandler(err);
                });
        },   
        async postOptionMenu(data: IOptionMenu) {
            this.isLoading = true;
            return await http
                .post(`/option-menu`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                    
                });
        },   
        async updateOptionMenu(data: IOptionMenu) {
            this.isLoading = true;
            const { optionMenuId, ...others } = data;
            return await http
                .put(`/option-menu/${optionMenuId}`, others)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                  
                    return  errorHandler(err);
                });
        },      
        async deleteOptionMenu(optionMenuId: number) {
            this.isLoading = true;
            return await http
                .delete(`/option-menu/${optionMenuId}`)
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
