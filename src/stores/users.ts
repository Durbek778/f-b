import { defineStore } from 'pinia';
import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';
import getParams from '@/utils/getParams';
import type { IUser, IResponse, IPagination, IResponseItem } from '@/types/apiTypes';
interface IUserStore {
    users: IUser[];
    isLoading: boolean;
    user: IUser | null;
    count: number;
}
interface IPassword {
    password:String,
    userId:String
}
export const useUsersStore = defineStore({
    id: 'users',
    state: (): IUserStore => ({
        users: [],
        isLoading: false,
        user: null,
        count: 0
    }),
    getters: {},
    actions: {
        async getUsers(params?: IPagination) {
            this.isLoading = true;
            return await http
                .get(`/user${getParams(params)}`)
                .then((res: IResponse<IUser>) => {
                    this.isLoading = false;
                    this.users = res.data.items;
                    this.count = res.data.count;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.users = [];
                    this.count = 0;
                    return   errorHandler(err);
 
                });
        },

        async getUser(userId: string) {
            this.isLoading = true;
            return await http
                .get(`/user/${userId}`)
                .then((res: IResponseItem<IUser>) => {
                    const usersArray: any = [res.data];
                    this.user = res.data;
                    this.users = usersArray;
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    this.user = null;
                    this.users = [];
                    return errorHandler(err);
                });
        },   
        async postUser(data: IUser) {
            this.isLoading = true;
            const { userId } = data;
            return await http
                .post(`/user/${userId}`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                    
                });
        },   
        async updateUser(data: IUser) {
            this.isLoading = true;
            const { userId } = data;
            return await http
                .put(`/user/${userId}`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                  
                    return  errorHandler(err);
                });
        },  
        async updatePassword(data: IPassword) {
            this.isLoading = true;
            const { userId } = data;
            return await http
                .post(`/user/${userId}/change-password`, data)
                .then((res: any) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err: Error) => {
                    this.isLoading = false;
                    return errorHandler(err);
                });
        },
        async deleteUser(userId: String) {
            this.isLoading = true;
            return await http
                .delete(`/user/${userId}`)
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
