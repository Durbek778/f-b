<script setup lang="ts">
import { computed, ref } from 'vue';
import { watch } from 'vue';
import { useStoreStore } from '@/stores/store';
import type { IStore } from '@/types/apiTypes';
const props = defineProps(['isOpen', 'dialogTitle']);
const emit = defineEmits(['handleModal', 'selectStore']);
const storeStores= useStoreStore()
const filteredList = computed<IStore[]>(() => {
    return storeStores.stores
});
const listLimit = 10;
const offset = computed(() => (pagination.value - 1) * listLimit);
const pagination = ref(1);
const isFirstRequest = ref(true)

function getUsers() {
    storeStores.getStores({offset:offset.value,limit:listLimit});
}

watch(()=>pagination.value,()=>{
    if(props.isOpen){
        getUsers()
    }
})

watch(()=>props.isOpen,()=>{
    if(props.isOpen && isFirstRequest.value){
    getUsers()
    isFirstRequest.value=false
    }
})
</script>

<template>
    <v-dialog persistent v-model="isOpen" max-width="800">
        <v-card>
            <v-card-title class="pa-4 bg-primary">
                <span class="title text-white">{{ props.dialogTitle || '매장선택' }}</span>
            </v-card-title>

            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">매장 ID</th>
                            <th class="text-subtitle-1 font-weight-semibold">매장 이름</th>
                            <th class="text-subtitle-1 font-weight-semibold">매장 주소</th>
                            <th class="text-subtitle-1 font-weight-semibold">매장 전화번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="storeStores.count != 0">
                            <tr
                                class="users__row"
                                v-ripple
                                v-for="(item, i) in listLimit"
                                :key="filteredList[i]?.storeId"
                                @click="filteredList[i] && emit('selectStore', filteredList[i])"
                            >
                                <template v-if="filteredList[i]">
                                    <td class="text-subtitle-1">{{ filteredList[i].storeId }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].storeName }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].storeAddress }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].storePhoneNumber }}</td>
                                </template>
                                <template v-if="!filteredList[i]">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </template>
                            </tr>
                        </template>
                    </tbody>
                </v-table>
                <v-row>
                    <v-col cols="12">
                        <v-pagination v-model="pagination" :length="Math.ceil(storeStores.count / listLimit)"></v-pagination>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" @click="emit('handleModal', 'CLOSE', 'STORE')">취소</v-btn>
                <!-- <v-btn color="primary" variant="flat" @click="emit('handleModal', 'CLOSE', 'STORE')">저장</v-btn> -->
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>