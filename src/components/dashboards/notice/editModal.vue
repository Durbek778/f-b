<script setup lang="ts">
import UserSelectionModal from '@/components/shared/userSelectionModal.vue';
import { useNoticeStore } from '@/stores/notice';
import { useAlertStore } from '@/stores/alert';
import { useUsersStore } from '@/stores/users';
import { onMounted } from 'vue';
import { computed, ref, watch } from 'vue';
import type { INotice } from '@/types/apiTypes';
const props = defineProps(['isOpen', 'notice']);
const emit = defineEmits(['handleModal', 'save']);
const noticeStore = useNoticeStore();
const userStore = useUsersStore();
const form: any = ref(null);

const noticeEdit = ref<INotice>({
    noticeTitle: props?.notice?.noticeTitle,
    noticeContent: props?.notice?.noticeContent,
    noticeImgUrl:props?.notice?.noticeImgUrl,
    noticeId:props?.notice?.noticeId
});
const getUsers = () => {
    userStore.getUsers();
};
const handleDialog = async (action: 'CLOSE' | 'SAVE') => {
    console.log(action);
    if (action == 'CLOSE') {
        emit('handleModal', 'CLOSE', 'EDIT');
    } else {
        const { valid } = await form.value.validate();
        console.log(form.value);
        if (valid) {
            noticeStore
                .updateNotice({
                    noticeId: props.notice.noticeId,
                    noticeTitle: noticeEdit.value.noticeTitle,
                    noticeContent: noticeEdit.value.noticeContent,
                    noticeImgUrl:noticeEdit.value.noticeImgUrl
                })
                .then((res: any) => {
                    noticeEdit.value = {
                        noticeTitle: '',
                        noticeContent: '',
                        noticeImgUrl:'',
                        noticeId:0
                    };
                    useAlertStore().addAlert('SUCCESS', '공지가 편집되었습니다');
                    emit('save', 'EDIT');
                });
        }
    }
};
onMounted(() => {
    getUsers();
});
const noticeTitleRules = ref([(v: string) => !!v || '공지 제목이 필요합니다']);
const noticeContentRules = ref([(v: string) => !!v || '공지 내용이 필요합니다']);
const isOpen = ref(props.isOpen);
watch(
    () => props.isOpen,
    () => {
        isOpen.value = props.isOpen;
        if (props.isOpen) {
            noticeEdit.value = {
                noticeTitle: props?.notice?.noticeTitle,
                noticeContent: props?.notice?.noticeContent,
                noticeImgUrl:props?.notice?.noticeImgUrl,
                noticeId:props?.notice?.noticeId
            };
        }
    }
);
watch(
    () => isOpen.value,
    () => {
        if (isOpen.value == false) {
            handleDialog('CLOSE');
        }
    }
);
</script>

<template>
    <v-dialog v-model="isOpen" max-width="500">
        <v-card>
            <v-card-title class="pa-4 bg-primary">
                <span class="title text-white">편집</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                :rules="noticeTitleRules"
                                v-model="noticeEdit.noticeTitle"
                                label="공지 제목"
                                variant="outlined"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="d-flex align-center">
                            <v-textarea :rules="noticeContentRules" v-model="noticeEdit.noticeContent" label="내용"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" @click="handleDialog('CLOSE')">취소</v-btn>
                <v-btn color="primary" variant="flat" @click="handleDialog('SAVE')">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>