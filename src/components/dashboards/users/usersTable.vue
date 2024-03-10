<script setup lang="ts">
import { useUsersStore } from '@/stores/users';
import { computed, onMounted, ref, watch } from 'vue';
import { sortBy } from '@/utils/sortTable';

import moment from 'moment';
import { useRoute } from 'vue-router';
import type { IUser } from '@/types/apiTypes';

const usersStore = useUsersStore();

const emit = defineEmits(['to', 'edit', 'editPassword', 'delete', 'setPage', 'setLimit']);
const parentProps = defineProps(['list', 'limit', 'currentPage']);
//PAGINATION
const listLimit = parentProps.limit;
const currentPage = ref(1);
const route = useRoute();

function check() {
    return confirm('이 사용자를 삭제하시겠습니까?');
}
const headers:any = [
    { text: '사용자 ID', value: 'userId' },
    { text: '사용자 이름', value: 'userName' },
    { text: '가입날짜', value: 'createdAt' },
    { text: '이메일', value: 'email' },
    { text: '사용자 유형', value: 'userType' },
    { text: '비밀번호 편집', value: 'passwordChange' },
    { text: '편집/삭제', value: 'change' }
];
const themeColor = ref('rgb(var(--v-theme-secondary))');
const serverOptions: any = ref({
    page: currentPage.value,
    rowsPerPage: listLimit
});
const sortedData = computed(() => sortBy(serverOptions.value, usersStore.users, 'userId'));
onMounted(() => {
    serverOptions.value.page = Number(route.query.page) ? Number(route.query.page) : 1;
});
watch(
    () => serverOptions.value.page,
    () => {
        console.log(serverOptions.value);
        emit('setPage', serverOptions.value.page);
    }
);
watch(
    () => serverOptions.value.rowsPerPage,
    () => {
        emit('setLimit', serverOptions.value.rowsPerPage);
    }
);
watch(
    () => parentProps.currentPage,
    () => {
        serverOptions.value.page = parentProps.currentPage;
    }
);
function clickRow(val: IUser) {
    emit('to', val);
}
</script>
<template>
    <EasyDataTable
        @clickRow="clickRow"
        class="mt-5"
        :headers="headers"
        :loading="usersStore.isLoading"
        :items="sortedData"
        table-class-name="customize-table"
        :theme-color="themeColor"
        :rows-items="[10, 25, 50, 100]"
        rows-per-page-message=""
        v-model:server-options="serverOptions"
        :server-items-length="usersStore.count"
    >
        <template #item-passwordChange="data">
            <v-tooltip text="비밀번호 편집">
                <template v-slot:activator="{ props }">
                    <v-btn icon flat @click.stop="emit('editPassword', data)" v-bind="props"
                        ><PencilIcon stroke-width="1.5" size="20" class="text-primary"
                    /></v-btn>
                </template>
            </v-tooltip>
        </template>
        <template #item-userType="data">
            <template v-if="data?.userType == 1 || data?.userType == 2">
                <v-chip color="secondary" size="small" label>{{ data?.userType == 2 ? 'User' : 'Admin' }}</v-chip>
            </template>
        </template>
        <template #item-change="data">
            <div class="d-flex align-center">
                <v-tooltip text="편집">
                    <template v-slot:activator="{ props }">
                        <v-btn icon flat @click.stop="emit('edit', data)" v-bind="props"
                            ><PencilIcon stroke-width="1.5" size="20" class="text-primary"
                        /></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="삭제">
                    <template v-slot:activator="{ props }">
                        <v-btn icon flat @click.stop="check() && emit('delete', data)" v-bind="props"
                            ><TrashIcon stroke-width="1.5" size="20" class="text-error"
                        /></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </template>

        <template #item-createdAt="{ createdAt }">
            {{ moment(createdAt).format('YYYY-MM-DD / HH:mm') }}
        </template>
        <template #empty-message>
            <h1>데이터가 없습니다.</h1>
        </template>
    </EasyDataTable>
  
</template>
<style scoped lang="scss">
.customize-table {
    --easy-table-row-border: 1px solid #dddddd;
    --easy-table-header-font-size: 14px;
    --easy-table-header-height: 50px;
    --easy-table-header-font-color: #777e89;

    --easy-table-header-item-padding: 10px 15px;

    --easy-table-body-row-height: 25px;
    --easy-table-body-row-font-size: 14px;

    --easy-table-body-item-padding: 10px 15px;
}
.users {
    &__row {
        cursor: pointer;
    }
    &__not__found {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__calendar {
        width: 100%;
    }
    &__card__actions {
        padding: 0;
    }
    &__table {
        position: relative;
        .text-subtitle-1 {
            white-space: nowrap;
        }
    }
    &__loading {
        width: 100%;
        height: 100%;
        opacity: 100%;
        background-color: #fff;
        position: absolute;
        top: 0%;
    }
    &__current__page__offset {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10%;
        justify-content: space-between;
    }
    &__current__page {
        padding-bottom: 5px;
        cursor: pointer;
        font-size: larger;
    }
    &__current__page__container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    &__current__page__not {
        cursor: pointer;
    }
    &__loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &__icon {
            animation: spinner 1s infinite linear;
            @keyframes spinner {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }
}
</style>