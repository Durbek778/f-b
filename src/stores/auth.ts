import { defineStore } from 'pinia';
import { router } from '@/router';

import http from '@/http/http';
import errorHandler from '@/utils/errorHandler';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        // @ts-ignore
        user: JSON.parse(localStorage.getItem('user')),
        isLoading: false,
        returnUrl: null
    }),
    actions: {
        async register(userId: string, userName: string, email: string, password: string, phoneNumber: string) {
            this.isLoading = true;
            await http.post('/auth/sign-up', { userId, userName, email, password, phoneNumber }).then(
                (res) => {
                    console.log(res);
                    this.isLoading = false;
                    this.login(userId, password);
                },
                (err) => {
                    this.isLoading = false;
                    return Promise.reject(err);
                }
            );
        },
        async login(username: string, password: string) {
            this.isLoading = true;
            return await http.post(`/auth/log-in`, { userId: username, password }).then(
                (res) => {
                    this.user = res.data;

                    localStorage.setItem('Authorization', res.data.token);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    router.push(this.returnUrl || '/');
                    this.isLoading = false;
                    return Promise.resolve(res);
                },
                (err) => {
                    this.isLoading = false;
                    console.log('ERROR', err);
                    return Promise.reject(err.error);
                }
            );
        },
        async verifyUserId(userId: string) {
            this.isLoading = true;
            return await http
                .post(`/auth/verify-user-id`, { userId: userId })
                .then((res) => {
                    this.isLoading = false;
                    return res;
                })
                .catch((err) => {
                    this.isLoading = false;
                    errorHandler(err);
                });
        },
        async findId(email: string) {
            this.isLoading = true;
            return await http.post('/auth/find-id', { email }).then(
                (res) => {
                    this.isLoading = false;
                    return res;
                },
                (err) => {
                    this.isLoading = false;
                    errorHandler(err);
                }
            );
        },
        async sendVerificationToken(userId: string) {
            this.isLoading = true;
            return await http.post('/auth/send-verification-code', { userId }).then(
                (res) => {
                    this.isLoading = false;
                    return res;
                },
                (err) => {
                    this.isLoading = false;
                    errorHandler(err);
                }
            );
        },
        async changePassword(verificationCode: string, userId: string, password: string) {
            this.isLoading = true;

            return await http.post('/auth/change-password', { verificationCode, userId, password }).then(
                (res) => {
                    this.isLoading = false;
                    return res;
                },
                (err) => {
                    this.isLoading = false;
                    return Promise.reject(err);
                }
            );
        },
        logout() {
            this.user = null;
            localStorage.removeItem('Authorization');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    }
});
