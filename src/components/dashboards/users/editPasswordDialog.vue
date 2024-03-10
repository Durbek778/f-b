<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import { useUsersStore } from '@/stores/users';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { onUpdated } from 'vue';
import { reactive, ref } from 'vue';
const usersStore = useUsersStore();
const props = defineProps(['isOpen', 'dialogTitle', 'user']);
const emit = defineEmits(['handleEditDialog', 'save']);
const form: any = ref(null);
const handleDialog = async (action: 'CLOSE' | 'SAVE') => {
    if (action == 'CLOSE') {
        emit('handleEditDialog', 'CLOSE');
    } else {
        const { valid } = await form.value.validate();
        console.log(form.value);
        if (valid) {
            usersStore
                .updatePassword({
                    userId: props?.user?.userId,
                    password: password.value
                })
                .then((res) => {
                    useAlertStore().addAlert('SUCCESS', '사용자가 업데이트되었습니다');
                    emit('save');
                });
        }
    }
};
const password = ref('');
const passwordRules = ref([(v: string) => !!v || '새 비밀번호가 필요합니다다']);
const isOpen = ref(props.isOpen);
watch(
    () => props.isOpen,
    () => {
        isOpen.value = props.isOpen;
        password.value=""
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
                                label="새 비밀번호"
                                v-model="password"
                                :rules="passwordRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
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