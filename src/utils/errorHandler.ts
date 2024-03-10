import { useAlertStore } from '@/stores/alert';

export default (err: any) => {
    const alertStore = useAlertStore();

    return new Promise((_, reject) => {
        switch (err.status) {
            case 400:
                alertStore.addAlert('ERROR', err.error || '잘못된 요청입니다. 다시 시도하십시오!');
                break;
            case 401:
                alertStore.addAlert('ERROR', err.error || '권한이 없습니다. 다시 로그인 해보십시오!');
                break;
            case 404:
                alertStore.addAlert('ERROR', err.error || '찾을 수 없습니다!');
                break;
        }
        if (err.status >= 500) {
            alertStore.addAlert('ERROR', '서버 오류! 다시 시도하거나 관리자에게 문의하십시오!');
        }
        if (err.status == 'CONERROR') {
            alertStore.addAlert('ERROR', err.error || '연결 오류가 발생했습니다. 다시 연결해 보십시오!');
        }
        reject(err);
    });
};
