import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
const toast = useToast();
export const useAlertStore = defineStore<any, any, any, any>({
    id: 'alert',
    state: () => {
        return {
            // initialize state from local storage to enable user to stay logged in
            // @ts-ignore
            alerts: []
        };
    },
    actions: {
        addAlert(type: 'ERROR' | 'SUCCESS' | 'WARNING', message: String) {
            if (type == 'SUCCESS') {
                toast.success(message);
            } else if (type == 'ERROR') {
                toast.error(message);
            } else if (type == 'WARNING') {
                toast.warning(message);
            } else {
                toast(message);
            }
        }
    }
});
