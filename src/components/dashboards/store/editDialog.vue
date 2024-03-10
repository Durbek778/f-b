<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import { watch } from 'vue';
import { reactive, ref } from 'vue';
import type { IStore } from '@/types/apiTypes';
import { useStoreStore } from '@/stores/store';
import type { PropType } from 'vue';
const storeStore = useStoreStore();
const props = defineProps({
  isOpen: { type: Boolean },
  dialogTitle: { type: String },
  store: { type: Object as PropType<IStore>, required: true }
});
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
            storeStore
                .updateStore(store.value)
                .then((res) => {
                    useAlertStore().addAlert('SUCCESS', '매장이 추가되었습니다');
                    emit('save');
                });
        }
    }
};
const store = ref<IStore>({
    storeId:0,
  storeName: '',
  storeAddress: '',
  storePhoneNumber: '',
  storeMemo: '',
  deletedFlag:1
})


const storeNameRules = ref([(v: string) => !!v || '이름이 필요합니다']);
const storephoneNumberRules = ref([
    (v: string) => !!v || '전화번호가 필요합니다',
    (v: string) => /^010\d{8}$/.test(v) || '전화번호는 010으로 시작하고 유효해야 합니다'
]);

const isOpen = ref(props.isOpen);
watch(
    () => props.isOpen,
    () => {
        isOpen.value = props.isOpen;
        if (isOpen.value) {
            store.value.storeId = props?.store.storeId;

            store.value.storeName = props?.store.storeName;
            store.value.storeAddress =props?.store.storeAddress;
            store.value.storePhoneNumber =props?.store.storePhoneNumber;
            store.value.storeMemo = props?.store.storeMemo;
            

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
                                label="매장 이름"
                                v-model="store.storeName"
                                :rules="storeNameRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="매장 전화번호"
                                v-model="store.storePhoneNumber"
                                :rules="storephoneNumberRules"
                                variant="outlined"
                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="매장 주소"
                                v-model="store.storeAddress"
                                variant="outlined"

                                class="users__input"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="매장 메모"
                                v-model="store.storeMemo"
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