<script setup lang="ts">
import moment from 'moment';
import { CalendarIcon, CashIcon, CurrencyDollarIcon, PencilIcon, TrashIcon } from 'vue-tabler-icons';
import type {  IOptionMenu } from '@/types/apiTypes';
import currency from '@/utils/formatCurrency';
import { useRouter } from 'vue-router';
const props = defineProps<{ menu: IOptionMenu }>();
const emit = defineEmits(['handleModal', 'show', 'delete']);
const router= useRouter()
function deleteItem(item: IOptionMenu) {
    emit('delete', item);
}
function handleModal( data?: IOptionMenu) {
    console.log(data)
            return emit('handleModal', 'OPEN', 'EDIT', data);
}

function confirmDelete(){
    return confirm("이 옵션으ㄹ 삭제하시겠습니까?")

}

console.log(props.menu)
</script>
<template>
    <v-hover v-slot="{ isHovering, props:props2 }">
    <v-card v-bind="props2" :elevation="isHovering?10: 0" rounded="lg" class="h-100 cursor-pointer">
        <v-card-item class="pa-0 promotion__card">
            <div class="w-100 h-100">
            
                <v-btn @click.stop="handleModal(props.menu)" :ripple="false" color="secondary" icon="" class="promotion__card__edit"
                ><PencilIcon></PencilIcon></v-btn>
                <v-btn @click.stop="confirmDelete() &&deleteItem(props.menu)" :ripple="false" color="error" icon="" class="promotion__card__delete__btn"
                    ><TrashIcon></TrashIcon
                ></v-btn>
                    <!-- <img :src="props.menu.menuImgUrl" class="w-100 promotion__card__img" /> -->
                    <img src="@/assets/images/backgrounds/errorimg.svg"/>
            </div>
            <div class="pa-5">
                <div>
                    <v-row class="align-center pb-2">
                        <v-col cols="12" class="d-flex align-center justify-space-between">
                            <v-tooltip :text="props.menu.optionMenuName">
                                <template v-slot:activator="{ props: props2 }">
                                    <span class="text-h5 cursor-pointer" v-bind="props2">
                                        {{
                                            props.menu.optionMenuName.length <= 20
                                                ? props.menu.optionMenuName
                                                : props.menu.optionMenuName.slice(0, 20) + '...'
                                        }}
                                    </span>
                                    
                                </template>
                            </v-tooltip>
                            <v-tooltip text="카테고리">
                                <template v-slot:activator="{ props: props2 }">
                                    <v-chip color="warning" variant="tonal" class="text-h5 cursor-pointer" v-bind="props2">
                                        {{
                                            props.menu.optionMenuCategory
                                        }}
                                    </v-chip>

                                </template>
                            </v-tooltip>
                        </v-col>
                    
                    </v-row>
                    <div class="d-flex align-center justify-space-between">
                        <div class="ml-2 d-flex flex-row-reverse"></div>
                    </div>
                </div>
                <div v-if="!props.menu.optionMenuDiscountPrice" class="d-flex align-center gap-2 pt-2">
                    <CashIcon color="grey"></CashIcon
                    ><span class="text-subtitle-1 text-primary">
                        {{ currency.format(props.menu.optionMenuPrice) }}
                    </span>
                </div>
                <div v-else class="d-flex align-center gap-2 pt-2">
                    <CashIcon color="grey"></CashIcon
                    ><span class="text-subtitle-1 text-decoration-line-through text-error">
                        {{ currency.format(props.menu.optionMenuPrice) }}        
                    </span>
                    <v-spacer></v-spacer>
                    <span  class="text-subtitle-1 text-primary">{{ currency.format(props.menu.optionMenuTotalPrice) }}</span>
                </div>
             
             
            </div>
         
        </v-card-item>
    </v-card>
</v-hover>
</template>

<style lang="scss">
.promotion__card {
    position: relative;
    &__img {
        height: 350px;
        object-fit: cover;
        img {
            width: 100%;
            height: 100%;
        }
    }
    &__enabled {
        position: absolute;
        top: 2.5%;
        right: 5%;
    }
    &__edit {
        position: absolute;
        top: 2.5%;
        left: 5%;
    }
    &__delete__btn {
        position: absolute;
        top: 2.5%;
        right: 5%;
    }
}
</style>