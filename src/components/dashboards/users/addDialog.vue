<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import { useUsersStore } from '@/stores/users';
import { watch } from 'vue';
import { reactive, ref } from 'vue';
import moment from 'moment';
import type { IUser } from '@/types/apiTypes';
const usersStore = useUsersStore();
const props = defineProps(['isOpen', 'dialogTitle', 'user']);
const emit = defineEmits(['handleEditDialog', 'save']);
// const { daum }: any = window;
const form = ref<HTMLFormElement|null>(null);
const handleDialog = async (action: 'CLOSE' | 'SAVE') => {
    if (action == 'CLOSE') {
        emit('handleEditDialog', 'CLOSE');
    } else {
        const { valid } = await form?.value?.validate();
        console.log(form.value);
        if (valid) {
            usersStore
                .postUser(user.value)
                .then((res) => {
                    useAlertStore().addAlert('SUCCESS', '사용자가 추가되었습니다');
                    emit('save');
                });
        }
    }
};

const user = ref<IUser>({
  userId: '',
  userName: '',
  phoneNumber: '',
  email: '',
  userType: 2,
  userMemo: '',
})

const userIdRules = ref([(v: string) => !!v || '사용자 Id가 필요합니다']);
const userNameRules = ref([(v: string) => !!v || '이름이 필요합니다']);
const phoneNumberRules = ref([
    (v: string) => !!v || '전화번호가 필요합니다',
    (v: string) => /^010\d{8}$/.test(v) || '전화번호는 010으로 시작하고 유효해야 합니다'
]);
const emailRules = ref([
    (v: string) => !!v || '이메일이 필요합니다',
    (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || '이메일은 유효한 이메일이어야 합니다'
]);
const isOpen = ref(props.isOpen);
watch(
    () => props.isOpen,
    () => {
        isOpen.value = props.isOpen;
        if (isOpen.value) {
           user.value.userId = '';
            user.value.userName = '';
            user.value.phoneNumber = '010';
            isOpen.value = props.isOpen;
        }
    }
);
watch(
    () => isOpen.value,
    () => {
        console.log(isOpen.value);
        if (isOpen.value == false) {
            handleDialog('CLOSE');
        }
    }
);

</script>
<template>
    <v-dialog v-model="isOpen" max-width="500">
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ props.dialogTitle }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="사용자 Id"
                                v-model="user.userId"
                                :rules="userIdRules"
                                variant="outlined"
                                class="users__input"
                                placeholder=""
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="사용자 이름"
                                v-model="user.userName"
                                :rules="userNameRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="사용자 이메일"
                                v-model="user.email"
                                :rules="emailRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="사용자 전화번호"
                                v-model="user.phoneNumber"
                                variant="outlined"
                                :rules="phoneNumberRules"
                                class="users__input"
                            ></v-text-field>
                        </v-col>

                      
                     
                        <v-col cols="12" sm="12">
                            <v-select
                                label="사용자 유형"
                                v-model="user.userType"
                                :items="[
                                    { title: '관리자', value: 1 },
                                    { title: '사용자', value: 2 }
                                ]"
                                item-title="title"
                                item-value="value"
                                variant="outlined"
                                class="users__input"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="사용자 메모"
                                v-model="user.userMemo"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" sm="12">
                            <v-text-field
                                label="비밀번호"
                                v-model="password"
                                :rules="passwordRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col> -->
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" @click="handleDialog('CLOSE')">Cancel</v-btn>
                <v-btn color="secondary" variant="flat" @click="handleDialog('SAVE')">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>