<script setup lang="ts">
import { useHistoryStore } from '@/stores/history';
import Currency from '@/utils/formatCurrency';
import { sortBy, sortByDate } from '@/utils/sortTable';
import moment from 'moment';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TrashIcon } from 'vue-tabler-icons';
const historyStore = useHistoryStore();

const parentProps = defineProps(['products', 'limit', 'currentPage']);
const emit = defineEmits(['setPage', 'setLimit']);

const headers = [
    { text: '히스토리 Id', value: 'historyId', sortable: true },
    { text: '사용자 ID', value: 'userId' },
    { text: '이벤트 이름', value: 'eventName' },
    { text: '로그 내용', value: 'logText' },
    { text: '날짜', value: 'timeStamp' }
];
const themeColor = ref('rgb(var(--v-theme-secondary))');
const serverOptions: any = ref({
    page: parentProps.currentPage,
    rowsPerPage: parentProps.limit,
    sortBy: 'historyId',
    sortType: 'desc'
});
const sortedData = computed(() => {
    console.log(serverOptions.value);
    if (serverOptions.value.sortBy == 'timeStamp') {
        return sortByDate(serverOptions.value, historyStore.histories, 'historyId');
    }
    return sortBy(serverOptions.value, historyStore.histories, 'historyId');
});
const route = useRoute()
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
</script>
<template>
    <EasyDataTable
        :headers="headers"
        :loading="historyStore.isLoading"
        :items="sortedData"
        :rows-items="[10, 25, 50, 100]"
        rows-per-page-message=""
        table-class-name="customize-table"
        :theme-color="themeColor"
        v-model:server-options="serverOptions"
        :server-items-length="historyStore.count"
    >
        <template #item-timeStamp="{ timeStamp }">
            {{ moment(timeStamp).format('YYYY-MM-DD / HH:mm') }}
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
</style>