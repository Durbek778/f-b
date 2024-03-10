<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'v-calendar/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import { watch, computed } from 'vue';
import moment from 'moment';
import { useAlertStore } from '@/stores/alert';
import Banner1 from '@/components/widgets/banners/Banner1.vue';
import Panel from '@/components/dashboards/notice/panel.vue';
import { useNoticeStore } from '@/stores/notice';
import Pagination from '@/components/shared/pagination2.vue';
import AddModal from '@/components/dashboards/notice/addModal.vue';
import EditModal from '@/components/dashboards/notice/editModal.vue';
import type { IStore } from '@/types/apiTypes';
import StoreSelectionModal from '@/components/shared/StoreSelectionModal.vue';
//store
const alertStore = useAlertStore();
const page = ref({ title: '공지사항' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/'
    },
    {
        text: '공지사항',
        disabled: true,
        href: '#'
    }
]);
const noticeStore = useNoticeStore();
const addModalOpen = ref(false);
const editModalOpen = ref(false);
const selectedNotice = ref(null);
const storeSelectOpen = ref(false)
const selectedStore = ref<number | null>(null)
const listLimit = 20;
const currentPage = ref(1);
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit;
});

const params = computed(() => {
    const params: any = {
        limit: listLimit,
        offset: offset.value
    };

    return params;
});
const getNotices = () => {
    if(selectedStore.value){
        noticeStore.getNotices({...params.value,storeId:selectedStore.value});
    }else{
    noticeStore.getNotices(params.value);
    }
};
const handleModals = (action: 'OPEN' | 'CLOSE' = 'CLOSE', modalName: 'EDIT' | 'ADD'|'STORE', data?: any) => {
    if (action == 'OPEN' && modalName == 'EDIT') {
        selectedNotice.value = data;
    }

    const modalMap = {
        ADD: addModalOpen,
        EDIT: editModalOpen,
        STORE: storeSelectOpen
    };

    const modal = modalMap[modalName];

    if (modal !== undefined) {
        modal.value = action === 'OPEN';
    }
};
function nextPage() {
    currentPage.value = ++currentPage.value;
    getNotices();
}
function setPage(page: any) {
    currentPage.value = page;
    getNotices();
}
function prevPage() {
    if (currentPage.value == 1) return;
    currentPage.value = --currentPage.value;
    getNotices();
}
function editNotice(data: any) {
    handleModals('OPEN', 'EDIT', data);
}
function afterDelete(){
    alertStore.addAlert('SUCCESS', `공지가 삭제되었습니다`);
    getNotices();
}
function deleteNotice(notice: any) {
    if (noticeStore.notices.length == 1) {
        confirm('이 공지를 삭제하시겠습니까?') &&
            noticeStore.deleteNotice(notice.noticeId).then(() => {
                afterDelete()
                prevPage();
            });
    } else {
        confirm('이 공지를 삭제하시겠습니까?') && noticeStore.deleteNotice(notice.noticeId).then(() => afterDelete());
    }
}
function save(modal: 'ADD' | 'EDIT') {
    handleModals('CLOSE', modal);
    getNotices();
}
function selectStore (store: IStore) {
    selectedStore.value = Number(store.storeId);
    handleModals('CLOSE', 'STORE');
};
function checkSelectedStore(){
    if(selectedStore.value) return true
    alertStore.addAlert("ERROR","매장을 먼저 선택하십시오")
    return false

}
onMounted(() => {
    getNotices();
});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <EditModal :is-open="editModalOpen" :notice="selectedNotice" @handle-modal="handleModals" @save="save"></EditModal>
    <AddModal :selectedStore="Number(selectedStore)" :is-open="addModalOpen" @handle-modal="handleModals" @save="save"></AddModal>
    <StoreSelectionModal @handle-modal="handleModals" @select-store="selectStore" :is-open="storeSelectOpen"></StoreSelectionModal>
    <v-row>
        <v-col cols="12" class="d-flex align-center gap-3">
            <template v-if="selectedStore">
                <v-select clearable :items="[selectedStore]" v-model="selectedStore" hide-details></v-select
            ></template>
            <v-btn color="primary" variant="tonal" class="h-100 py-3" @click="handleModals('OPEN', 'STORE')">매장선택</v-btn>
            <v-spacer></v-spacer>
            <v-btn-group>
                
                <v-btn color="secondary"  variant="tonal" @click="checkSelectedStore() && handleModals('OPEN', 'ADD')">공지사항 추가</v-btn>
                <v-btn color="primary" variant="tonal" @click="getNotices()">검색</v-btn>
            </v-btn-group>
        </v-col>
        <v-col cols="12">
            <v-expansion-panels>
                <template v-for="notice in noticeStore.notices">
                    <Panel @delete="deleteNotice" @edit="editNotice" :notice="notice" />
                </template>
            </v-expansion-panels>
        </v-col>
    </v-row>
    <Pagination
        @set-page="setPage"
        @next="nextPage"
        @prev="prevPage"
        :is-loading="noticeStore.isLoading"
        :count="noticeStore.count"
        :list-limit="listLimit"
        :current-page="currentPage"
        :show-btn="false"
        message="아직 공지가 없습니다"
    ></Pagination>
</template>
<style scoped lang="scss"></style>