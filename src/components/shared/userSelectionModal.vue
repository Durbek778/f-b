<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUsersStore } from '@/stores/users';
import { onMounted } from 'vue';
import type { IUser } from '@/types/apiTypes';
const props = defineProps(['isOpen', 'dialogTitle']);
const emit = defineEmits(['handleModal', 'selectUser']);
const usersStore = useUsersStore();
const searchedUserId = ref('');
const filteredList = computed<IUser[]>(() => {
    return usersStore.users
});
//PAGINATION
const pagination = ref(1);
const listLimit:number =10
const isFirstRequest = ref(true)
const offset = computed(() => {
    return (pagination.value - 1) * listLimit;
});
function getUsers() {
    usersStore.getUsers({
            limit: listLimit,
            offset: offset.value
        });
}
function searchUser() {
    if (searchedUserId.value) usersStore.getUser(searchedUserId.value);
    else getUsers();
}

watch(()=>props.isOpen,()=>{
    if(props.isOpen && isFirstRequest.value){
        getUsers()
        isFirstRequest.value=false
    }
})
watch(()=>pagination.value,()=>{
    getUsers()
})


</script>

<template>
    <v-dialog persistent v-model="isOpen" max-width="800">
        <v-card>
            <v-card-title class="pa-4 bg-primary">
                <span class="title text-white">{{ props.dialogTitle || '사용자선택' }}</span>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col cols="12" class="d-flex aling-center gap-4">
                        <v-text-field hide-details label="사용자 ID" v-model="searchedUserId"></v-text-field>
                        <v-btn variant="tonal" color="primary" class="h-100" @click="searchUser">검색</v-btn>
                    </v-col>
                </v-row>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">사용자 ID</th>
                            <th class="text-subtitle-1 font-weight-semibold">사용자 이름</th>
                            <th class="text-subtitle-1 font-weight-semibold">이메일</th>
                            <th class="text-subtitle-1 font-weight-semibold">전화번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="usersStore.count != 0">
                            <tr
                                class="users__row"
                                v-ripple
                                v-for="(item, i) in listLimit"
                                :key="filteredList[i]?.userId"
                                @click="filteredList[i] && emit('selectUser', filteredList[i])"
                            >
                                <template v-if="filteredList[i]">
                                    <td class="text-subtitle-1">{{ filteredList[i].userId }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].userName }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].email }}</td>
                                    <td class="text-subtitle-1">{{ filteredList[i].phoneNumber }}</td>
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
                        <v-pagination v-model="pagination" :length="Math.ceil(usersStore.count / listLimit)"></v-pagination>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" @click="emit('handleModal', 'CLOSE', 'USER')">취소</v-btn>
                <v-btn color="primary" variant="flat" @click="emit('handleModal', 'CLOSE', 'USER')">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>