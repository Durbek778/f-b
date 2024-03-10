<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';

/*Social icons*/
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/facebook-icon.svg';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const isPassword = ref(true);
const password = ref('');
const username = ref('');
const passwordRules = ref([
    (v: string) => !!v || '비밀번호가 필요합니다',
    (v: string) => (v && v.length <= 10) || '비밀번호는 10자 미만이어야 합니다'
]);
const userId = ref([(v: string) => !!v.trim() || '사용자 ID가 필요합니다']);

function validate(values: any, { setErrors }: any) {
    if (username.value.trim() && password.value) {
        const authStore = useAuthStore();
        return authStore
            .login(username.value, password.value)
            .then((res) => {
                setErrors({ success: '로그인 성공!' });
            })
            .catch((error) => {
                setErrors({ apiError: error });
            });
    } else {
        setErrors({ validationError: '사용자 ID 또는 비밀번호가 올바르지 않습니다!' });
    }
}
const togglePassword = () => {
    isPassword.value = !isPassword.value;
};
</script>

<template>
    <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
        <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">사용자 ID</v-label>
        <VTextField v-model="username" :rules="userId" class="mb-8" required hide-details="auto"></VTextField>
        <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">비밀번호</v-label>
        <VTextField
            v-model="password"
            :append-inner-icon="isPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            required
            @click:append-inner="togglePassword"
            hide-details="auto"
            :type="isPassword ? 'password' : 'text'"
            class="pwdInput"
        ></VTextField>
        <div class="d-flex flex-wrap align-center my-3 ml-n2">
            <div class="ml-sm-auto">
                <RouterLink to="/auth/forgot-password" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                    >비밀번호를 잊었습니까?</RouterLink
                >
            </div>
        </div>
        <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>로그인</v-btn>
        <div v-if="errors.apiError" class="mt-2">
            <v-alert color="error">{{ errors.apiError }}</v-alert>
        </div>
        <div v-if="errors.validationError" class="mt-2">
            <v-alert color="warning">{{ errors.validationError }}</v-alert>
        </div>
        <div v-if="errors.success" class="mt-2">
            <v-alert color="success">{{ errors.success }}</v-alert>
        </div>
    </Form>
</template>
