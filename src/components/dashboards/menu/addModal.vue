<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useAlertStore } from '@/stores/alert';
import type { IMenu } from '@/types/apiTypes';
const emit = defineEmits(['handleModal', 'save']);
const menuStore = useMenuStore();
const alertStore = useAlertStore();
const form: any = ref(null);
const handleModal = async (action: 'CLOSE' | 'SAVE') => {
    if (action == 'CLOSE') {
        emit('handleModal', 'CLOSE', 'ADD');
    } else {
        const { valid } = await form.value.validate();
        
        if (valid) {
        const  {menuName,menuCategory, menuDiscountPrice, menuMemo,menuPrice,menuTotalPrice, menuImgUrl } = menu.value
            if(imageEdit.value){

                menuStore
                .postMenu({menuName,menuCategory, menuDiscountPrice, menuMemo,menuPrice,menuTotalPrice })
                .then(() => {
                    alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 업데이트되었습니다`);
                    emit('save', 'ADD');
                });
            }else{
                menuStore
                .postMenu({ menuName,menuCategory,menuDiscountPrice:+menuDiscountPrice, menuMemo,menuPrice:+menuPrice,menuTotalPrice:+menuTotalPrice,menuImgUrl, storeId:props.storeId })
                .then(() => {
                    alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 업데이트되었습니다`);
                    emit('save', 'ADD');
                });
}
        }
    }
};
const props = defineProps<{
  formTitle: string,
  isOpen: boolean,
  storeId:number
}>();


const menu = ref<IMenu>({
    menuName: "",
    menuCategory: "",
    menuDiscountPrice: 0,
    menuImgUrl:"",
    menuPrice: 0,
    menuMemo:"",
    menuTotalPrice:0,
    storeId:0,
    menuId:0
    
});
const promotionNameRules = ref([(v: string) => !!v || '프로모션 이름이 필요합니다']);
const discountValueRules = ref([(v: string) => !!v || '할인 값이 필요합니다']);
const isOpen = ref(props.isOpen);
const imageEdit = ref(false)
watch(
    () => props.isOpen,
    () => {

        isOpen.value = props.isOpen;

    }
);
watch(
    () => isOpen.value,
    () => {
        if (isOpen.value == false) {
            handleModal('CLOSE');
        }
    }
);
</script>
<template>
    <v-dialog v-model="isOpen" width="700">
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ props.formTitle }}</span>
            </v-card-title>

            <v-card-text class="h-100">
                <v-form ref="form" lazy-validation>
                    <v-row class="pt-2">
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="메뉴 이름"
                                v-model="menu.menuName"
                                variant="outlined"
                                class="users__input"
                                hide-details
                                :rules="promotionNameRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select
                                label="메뉴 카테고리"
                                v-model="menu.menuCategory"
                                variant="outlined"
                                class="users__input"
                                :items="[
                                    { key: '빵', value: '빵'},
                                    { key: '디저트', value: '디저트' }
                                ]"
                                item-title="key"
                                item-value="value"
                                hide-details
                            ></v-select>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field
                                label="가격"
                                v-model="menu.menuPrice"
                                variant="outlined"
                                class="users__input"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field
                                label="할인 가격"
                                v-model="menu.menuDiscountPrice"
                                variant="outlined"
                                class="users__input"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="메뉴 총가격"
                                v-model="menu.menuTotalPrice"
                                variant="outlined"
                                class="users__input"
                                :rules="discountValueRules"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea
                                label="메뉴 메모"
                                v-model="menu.menuMemo"
                                variant="outlined"
                                class="users__input"
                                :rules="discountValueRules"
                                hide-details
                            ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" class="d-flex">
                        <v-checkbox v-model="imageEdit" label="이미지도 편집할 건가요?"></v-checkbox>

                            <v-file-input
                            v-if="imageEdit"
                             label="이미지"
                             prepend-icon="mdi-camera"
                             variant="filled"
                        ></v-file-input>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" @click="handleModal('CLOSE')">취소</v-btn>

                <v-btn color="secondary" variant="flat" @click="handleModal('SAVE')">저장</v-btn>
            </v-card-actions>
        </v-card></v-dialog
    >
</template>