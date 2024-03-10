<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOptionMenuStore } from '@/stores/option-menu';
import { useAlertStore } from '@/stores/alert';
import type { IOptionMenu } from '@/types/apiTypes';
const emit = defineEmits(['handleModal', 'save']);
const optionMenuStore = useOptionMenuStore();
const alertStore = useAlertStore();
const form: any = ref(null);
const handleModal = async (action: 'CLOSE' | 'SAVE') => {
    if (action == 'CLOSE') {
        emit('handleModal', 'CLOSE', 'EDIT');
    } else {
        const { valid } = await form.value.validate();
        
        if (valid) {
        const  {optionMenuId,optionMenuName,optionMenuCategory, optionMenuDiscountPrice, optionMenuMemo,optionMenuPrice,optionMenuTotalPrice, optionMenuImgUrl } = menu.value
            if(imageEdit.value){

                optionMenuStore
                .updateOptionMenu({optionMenuId,optionMenuName,optionMenuCategory, optionMenuDiscountPrice, optionMenuMemo,optionMenuPrice,optionMenuTotalPrice, optionMenuImgUrl } )
                .then(() => {
                    alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 업데이트되었습니다`);
                    emit('save', 'EDIT');
                });
            }else{
                optionMenuStore
                .updateOptionMenu({optionMenuId,optionMenuName,optionMenuCategory, optionMenuDiscountPrice, optionMenuMemo,optionMenuPrice,optionMenuTotalPrice, optionMenuImgUrl})
                .then(() => {
                    alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 업데이트되었습니다`);
                    emit('save', 'EDIT');
                });
}
        }
    }
};
const props = defineProps<{
  menu: IOptionMenu,
  formTitle: string,
  isOpen: boolean
}>();

const menu = ref<IOptionMenu>({
    menuId: 0,
    optionMenuId: 0,
    optionMenuCategory: "",
    optionMenuName: "",
    optionMenuDiscountPrice: 0,
    optionMenuPrice: 0,
    optionMenuTotalPrice: 0,
    optionMenuImgUrl: "",
    optionMenuMemo: "",
    
});
const promotionNameRules = ref([(v: string) => !!v || '프로모션 이름이 필요합니다']);
const discountValueRules = ref([(v: string) => !!v || '할인 값이 필요합니다']);
const isOpen = ref(props.isOpen);
const imageEdit = ref(false)
watch(
    () => props.isOpen,
    () => {
        console.log(props.menu)
        isOpen.value = props.isOpen;
        if (props.isOpen) {
            menu.value = {
                optionMenuName: props?.menu?.optionMenuName,
                optionMenuCategory: props?.menu?.optionMenuCategory,
                optionMenuDiscountPrice: props?.menu?.optionMenuDiscountPrice,
                optionMenuImgUrl:props?.menu?.optionMenuImgUrl,
                optionMenuPrice: props?.menu?.optionMenuPrice,
                optionMenuMemo:props?.menu?.optionMenuMemo,
                optionMenuTotalPrice:props?.menu?.optionMenuTotalPrice,
                menuId:props?.menu?.menuId,
                optionMenuId:props?.menu?.optionMenuId
            };
        }
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
                                v-model="menu.optionMenuName"
                                variant="outlined"
                                class="users__input"
                                hide-details
                                :rules="promotionNameRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select
                                label="메뉴 카테고리"
                                v-model="menu.optionMenuCategory"
                                variant="outlined"
                                class="users__input"
                                :items="[
                                    { key: '빵', value: '빵' },
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
                                v-model="menu.optionMenuPrice"
                                variant="outlined"
                                class="users__input"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field
                                label="할인 가격"
                                v-model="menu.optionMenuDiscountPrice"
                                variant="outlined"
                                class="users__input"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                label="메뉴 총가격"
                                v-model="menu.optionMenuTotalPrice"
                                variant="outlined"
                                class="users__input"
                                :rules="discountValueRules"
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea
                                label="메뉴 메모"
                                v-model="menu.optionMenuMemo"
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