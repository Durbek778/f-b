<script setup lang="ts">
import { useHistoryStore } from '@/stores/history';
import { useOrderHistoryStore } from '@/stores/order-history';
import Currency from '@/utils/formatCurrency';
import { sortBy, sortByDate } from '@/utils/sortTable';
import moment from 'moment';
import type { IOrderCurrentMenu, IOrderHistory } from '@/types/apiTypes';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TrashIcon } from 'vue-tabler-icons';
const orderHistoryStore = useOrderHistoryStore();

const parentProps = defineProps(['products', 'limit', 'currentPage']);
const emit = defineEmits(['to', 'setPage', 'setLimit']);

const headers = [
    { text: '히스토리 Id', value: 'orderHistoryId', sortable: true },
    { text: '저장된 ID', value: 'storeId' },
    { text: '주문표', value: 'orderTableId' },
    { text: '주문가격', value: 'orderPrice' },
    { text: '주문현황', value: 'orderStatus' },

    // there is no order memo for no
    // { text: '메노 주문', value: 'orderMeno' },
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
        return sortByDate(serverOptions.value, orderHistoryStore.orderHistories, 'historyId');
    }
    return sortBy(serverOptions.value, orderHistoryStore.orderHistories, 'historyId');
});
const route = useRoute();
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

function clickRow(val: IOrderHistory) {
    emit('to', val);
    console.log('you clicked f#cker');
}
</script>
<template>
    <EasyDataTable
        @clickRow="clickRow"
        :headers="headers"
        :loading="orderHistoryStore.isLoading"
        :items="sortedData"
        :rows-items="[10, 25, 50, 100]"
        rows-per-page-message=""
        table-class-name="customize-table"
        :theme-color="themeColor"
        v-model:server-options="serverOptions"
        :server-items-length="orderHistoryStore.count"
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
