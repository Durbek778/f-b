<script setup lang="ts">
import { ref, computed } from 'vue';

import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const checkbox = ref(false);
const valid = ref(true);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const passwordRules = ref([
    (v: string) => !!v || '비밀번호가 필요합니다',
    (v: string) => (v && v.length <= 10) || '비밀번호는 10자 미만이어야 합니다'
]);
const emailRules = ref([(v: string) => !!v || '이메일이 필요합니다', (v: string) => /.+@.+\..+/.test(v) || '이메일이 유효해야 합니다']);
const fname = ref('');
const fnameRules = ref([(v: string) => !!v || '이름이 필요합니다']);
const userId = ref('');
const userIdRules = ref([(v: string) => !!v || '사용자 ID가 필요합니다']);
const phoneNumber = ref('010');
const phoneNumberRules = ref([
    (v: string) => !!v || '전화번호가 필요합니다',
    (v: string) => /^010\d{8}$/.test(v) || '전화번호는 010으로 시작하고 유효해야 합니다'
]);
const userIdVericationError = ref<boolean>(false);
const isUserIdChecked = ref(false);
const form: any = ref(null);
const errors: any = ref({});
async function validate(value: any, formMethods: any) {
    const { valid } = await form.value.validate();
    if (!valid) {
        return;
    }
    if (!isUserIdChecked.value) {
        setErrors({ apiError: '먼저 사용자 ID를 확인해주시기 바랍니다.' });
        return;
    }
    return authStore.register(userId.value, fname.value, email.value, password.value, phoneNumber.value).catch((err) => {
        setErrors({ apiError: err.error });
    });
}
function setErrors(error: any) {
    errors.value = error;
}
function validateUserId() {
    authStore.verifyUserId(userId.value).then(({ data }: any) => {
        if (!data.isValid) {
            userIdVericationError.value = true;
            alertStore.addAlert('ERROR', '사용자 ID가 이미 사용되었습니다');
        }
        if (data.isValid) {
            isUserIdChecked.value = true;
            alertStore.addAlert('SUCCESS', '사용자 ID를 사용할 수 있습니다');
        }
    });
}
function clearUserIdError() {
    userIdVericationError.value = false;
    isUserIdChecked.value = false;
}
const getColor = computed(() => {
    let color = 'secondary';
    if (userIdVericationError.value) {
        color = 'error';
    }
    if (isUserIdChecked.value) {
        color = 'success';
    }
    return color;
});
</script>
<template>
    <v-form @submit.prevent="validate" ref="form" class="mt-5">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">사용자 이름</v-label>
        <VTextField v-model="fname" :rules="fnameRules" required></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">사용자 ID</v-label>

        <v-row>
            <v-col cols="9">
                <VTextField @input="clearUserIdError" v-model="userId" :rules="userIdRules" required></VTextField>
            </v-col>
            <v-col cols="3">
                <v-btn
                    :disabled="!(userId && userId.trim().length != 0)"
                    @click="validateUserId"
                    variant="tonal"
                    class="bg-surface"
                    :color="getColor"
                    size="large"
                    :loading="authStore.isLoading"
                    >중복확인</v-btn
                >
            </v-col>
        </v-row>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">이메일 주소</v-label>

        <VTextField v-model="email" :rules="emailRules" prepend-inner-icon="mdi-email" required></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">전화번호</v-label>
        <VTextField
            v-model="phoneNumber"
            :rules="phoneNumberRules"
            prepend-inner-icon="mdi-phone"
            hint="Example: 010 12345678"
            required
        ></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2">비밀번호</v-label>
        <VTextField
            v-model="password"
            :counter="10"
            :rules="passwordRules"
            required
            variant="outlined"
            type="password"
            color="primary"
        ></VTextField>
        <v-btn size="large" :loading="authStore.isLoading" type="submit" class="mt-2" :disabled="!valid" color="primary" block submit flat
            >등록</v-btn
        >
        <div v-if="errors.apiError" class="mt-2">
            <v-alert color="error">{{ errors.apiError }}</v-alert>
        </div>
        <div v-if="errors.validationError" class="mt-2">
            <v-alert color="warning">{{ errors.validationError }}</v-alert>
        </div>
        <div v-if="errors.userIdError" class="mt-2">
            <v-alert color="error">{{ errors.userIdError }}</v-alert>
        </div>
        <div v-if="errors.success" class="mt-2">
            <v-alert color="success">{{ errors.success }}</v-alert>
        </div>
    </v-form>
</template>
