<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UserSelectionModal from '@/components/shared/userSelectionModal.vue';
import DateSelectionModal from '@/components/shared/dateSelectionModal.vue';
import 'v-calendar/dist/style.css';
import Events from './orderEvents.vue';
// import { useGlobalVariables } from '@/stores/global_variables';
import moment from 'moment';
import { useOrderHistoryStore, type IOrdHistoriesParam } from '@/stores/order-history';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const page = ref({ title: '주문 내역' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        to: '/'
    },
    {
        text: '주문 내역',
        disabled: true,
        href: '#'
    }
]);
const router = useRouter();
const orderHistoryStore = useOrderHistoryStore();
const listLimit = ref(10);
const currentPage = ref(1);
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit.value;
});
const selectedUser = ref(null);
const selectedRangeDate: any = ref({ start: moment(new Date()).subtract(1, 'month'), end: moment(new Date()) });
const userSelectionModalOpen = ref(false);
const dateSelectionModalOpen = ref(false);
const editModalOpen = ref(false);

const dateRange = ref({
    start: '',
    end: ''
});
const selectUser = (user: any) => {
    selectedUser.value = user.userId;
    handleModals('CLOSE', 'USER');
};

const handleModals = (action: 'OPEN' | 'CLOSE' = 'CLOSE', modalName: 'USER' | 'DATE', data?: any) => {
    console.log(action);
    const modalMap = {
        DATE: dateSelectionModalOpen,
        USER: userSelectionModalOpen
    };

    const modal = modalMap[modalName];

    if (modal !== undefined) {
        modal.value = action === 'OPEN';
    }
};

const selectRangeDate = (date: any) => {
    selectedRangeDate.value = date;
};
const search = () => {
    orderHistoryStore.getOrderHistories({ ...params.value, offset: offset.value });
};
const setPage = (page: number) => {
    if (currentPage.value == page) return;
    currentPage.value = page;
    // below
    router.replace({ path: '/orderHistory', query: { page: Number(page) } });
    search();
};
const setLimit = (limit: number) => {
    listLimit.value = limit;
    search();
};
const params = computed(() => {
    const params: IOrdHistoriesParam = {
        offset: 0,
        limit: listLimit.value,
        after: moment(selectedRangeDate.value?.start).format('YYYY-MM-DD'),
        before: moment(selectedRangeDate.value?.end).add(1, 'day').format('YYYY-MM-DD')
    };

    return params;
});
watch(
    () => params.value,
    () => {
        currentPage.value = 1;
    }
);
onMounted(search);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <UserSelectionModal @select-user="selectUser" @handle-modal="handleModals" :isOpen="userSelectionModalOpen"></UserSelectionModal>
    <DateSelectionModal
        @select-date="selectRangeDate"
        :range="dateRange"
        @handle-modal="handleModals"
        :isOpen="dateSelectionModalOpen"
        :isSelected="!!selectedRangeDate"
    ></DateSelectionModal>
    <v-row class="mt-4">
        <v-col cols="12">
            <div class="d-flex align-center h-100 gap-4">
                <template v-if="selectedUser">
                    <v-select clearable :items="[selectedUser]" v-model="selectedUser" hide-details></v-select
                ></template>
                <v-btn-group class="ml-0">
                    <v-btn color="secondary" variant="tonal" class="h-100 py-3" @click="handleModals('OPEN', 'USER')">사용자선택</v-btn>

                    <v-btn color="primary" variant="tonal" class="h-100 py-3" @click="handleModals('OPEN', 'DATE')">
                        <template v-if="!selectedRangeDate"> 날짜 선택 </template>
                        <template v-else>
                            {{ moment(selectedRangeDate.start).format('YYYY-MM-DD') }} ~
                            {{ moment(selectedRangeDate.end).format('YYYY-MM-DD') }}
                        </template>
                    </v-btn>
                </v-btn-group>
                <v-btn color="primary" variant="tonal" class="h-100 ml-auto mr-0" @click="search">검색</v-btn>
            </div>
        </v-col>
        <v-col cols="12">
            <Events @set-page="setPage" @set-limit="setLimit" :current-page="currentPage" :limit="listLimit"></Events>
        </v-col>
    </v-row>
</template>
