import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL + '/v1';

const instance = axios.create({
    baseURL
});
let isCalled: boolean = false;

const obtainNewAccessToken = async () => {
    let refreshToken = localStorage.getItem('refreshToken');
    return await axios
        .post(baseURL + `/auth/refresh-token`, {
            refreshToken: refreshToken
        })
        .then((response) => {
            isCalled = false;

            return response;
        });
};
const refreshExpiredTokenClosure = () => {
    let runningPromise: any = undefined;
    return () => {
        if (isCalled) {
            return runningPromise;
        } else {
            isCalled = true;
            runningPromise = obtainNewAccessToken();
            return runningPromise;
        }
    };
};
const refreshExpiredToken = refreshExpiredTokenClosure();

instance.interceptors.request.use(
    function (config) {
        let token = localStorage?.getItem('Authorization');

        console.log(token);
        if (token !== null) {
            config['headers'] = {
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        console.log(response.data);
        return response;
    },

    async (error) => {
        if (error.code == 'ERR_NETWORK') {
            return Promise.reject({ error: 'Network Failed. Please check your connection!', status: 'CONERROR' });
        } else if (error.code == 'ECONNABORTED') {
            return Promise.reject({ error: 'Connection Time out. Please check your connection!', status: 'CONERROR' });
        } else {
            const {
                config,
                response: { status }
            } = error;
            const originalRequest = config;

            let resData: { code: any; error: any; data: any; status: any } = {
                code: null,
                error: null,
                data: null,
                status: null
            };

            // console.log(status)  // accessToken Check 401 code on expiration
            if (status === 401) {
                console.log('interceptor if 401 case');
                console.log('status: ');
                console.log(status);
                console.log(`error.response.data.message:`);
                console.log(error.response.data.message); //에러 메세지 확인
                let token = localStorage.getItem('Authorization'); // 로그인해서 토큰이 있었는지 확인
                console.log('Authorization: ');
                console.log(token);
                let refreshToken = localStorage.getItem('refreshToken'); // 리프레쉬토큰 변수에 저장
                console.log('refreshToken: ');
                console.log(refreshToken);
                let newData!: { accessToken: string; expiresIn: string; tokenType: string };
                if (token !== null) {
                    // 로그인했었다면 리프레쉬토큰으로 토큰재발행 요청
                    console.log('token !== null');
                    try {
                        const res = await refreshExpiredToken();
                        console.log('Response:', res);
                        newData = res.data;
                    } catch (error: any) {
                        console.log(`error.response.data:`);
                        console.log(error.response.data);
                        if (error.response.data.code === 'TOKEN_ERROR') {
                            localStorage.removeItem('Authorization');
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('user');
                            location.href = '/auth/login';
                        }
                    }

                    console.log('newData:', newData);
                    if (newData.accessToken !== null) {
                        // 토큰 재발행 요청 성공시
                        console.log('data.accessToken !== null: ');
                        console.log('data.accessToken: ');
                        console.log(newData.accessToken);
                        localStorage.setItem('Authorization', newData.accessToken); // 로컬스토리지에 엑세스토큰 저장

                        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('Authorization')}`;
                        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('Authorization')}`;
                        console.log(`Bearer setting: `);
                        console.log(`Bearer ${localStorage.getItem('Authorization')}`);

                        return axios(originalRequest);
                    } else {
                        // 토큰 재발행 요청 실패 - 리프레쉬토큰 재발행 필요
                        resData.code = 'TOKEN_ERROR';
                        resData.status = status;
                        resData.error = 'refresh token error';
                        console.log('토큰 재발행에 실패하였습니다.1 \n다시 로그인해주세요.');

                        location.href = '/auth/login';
                    }
                } else {
                    // 로그인을 해서 로컬스토리지에 토큰을 저장한 적이 없음.
                    resData.code = 'STORAGE_ERROR';
                    resData.error = 'no data in storage';
                    resData.status = status;
                    console.log('토큰 재발행에 실패하였습니다.2 \n다시 로그인해주세요.');

                    location.href = '/auth/login';
                }
            } else {
                console.log(error);
                resData.code = error.response.data.code;
                resData.error = error.response.data.message;
                resData.status = status;
            }
            return Promise.reject(resData);
        }
    }
);

export default instance;
