import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { INotice, IResponse, IPagination, IResponseItem } from '@/types/apiTypes';

export interface INoticeStore{
    notices:INotice[],
    notice:INotice | null,
    count:number,
    isLoading:boolean
}
export interface INoticeParams extends IPagination{
    storeId?:number
}
export const useNoticeStore = defineStore({
    id: 'notice',
    state: ():INoticeStore => ({
        notices: [],
        isLoading: false,
        notice: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getNotices(params?: INoticeParams) {
            this.isLoading = true;
            return await http
                .get(`/notice${getParams(params)}`)
                .then((res: IResponse<INotice>) => {
                    this.isLoading = false;
                    this.notices = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.notices = [];
                    this.count = 0;
                    return   errorHandler(err);
 
                });
        },

        async getNotice(noticeId: number) {
            this.isLoading = true;
            return await http
                .get(`/notice/${noticeId}`)
                .then((res: IResponseItem<INotice>) => {
                    this.notice = res.data;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.notice = null;
                    return errorHandler(err);
                });
        },   
        async postNotice(data: INotice,) {
            this.isLoading = true;
            return await http
                .post(`/notice`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                    
                });
        },   
        async updateNotice(data: INotice) {
            this.isLoading = true;
            const { noticeId, ...others } = data;
            return await http
                .put(`/notice/${noticeId}`, others)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                  
                    return  errorHandler(err);
                });
        },      
        async deleteNotice(noticeId: number) {
            this.isLoading = true;
            return await http
                .delete(`/notice/${noticeId}`)
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
