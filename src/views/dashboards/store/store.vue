<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import StoreTable from '@/components/dashboards/store/storeTable.vue';
import { onMounted } from 'vue';
import AddDialog from '@/components/dashboards/store/addDialog.vue';
import EditDialog from '@/components/dashboards/store/editDialog.vue';
import { useRoute } from 'vue-router';
import type { IStore, IUser } from '@/types/apiTypes';
import { useAlertStore } from '@/stores/alert';
import { useStoreStore } from '@/stores/store';
//store
const storeStore = useStoreStore();
//states

const page = ref({ title: '매장' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        to: '/'
    },
    {
        text: '매장',
        disabled: true,
        href: '#'
    }
]);
let selectedStore = ref<IStore>({
    storeId: 0,
    storeName: '',
    storeAddress: '',
    storePhoneNumber: '',
    storeMemo: ''
});
const route = useRoute();
const listLimit = ref(10);
const currentPage = ref(route.query.page ? Number(route.query.page) : 1);

const getStores = () => {
    storeStore.getStores({
        limit: listLimit.value,
        offset: offset.value
    });
};

const setPage = (page: number) => {
    if (currentPage.value == page) return;
    currentPage.value = page;
    console.log('OFFSET:', offset.value);
    console.log('CurrentPage:', offset.value);
    router.replace({ path: '/users', query: { page: Number(page) } });
    getStores();
};
const setLimit = (limit: number) => {
    listLimit.value = limit;
    getStores();
};

// here
const filteredList = computed<IStore[]>(() => {
    return storeStore.stores.filter((store: IStore) => {
        return store;
    });
});
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit.value;
});
onMounted(() => {
    getStores();
});

function editUserFromTable(item: IStore) {
    selectedStore.value = item;

    handleEditDialog('OPEN');
}

function deleteUser(item: IStore) {
    if (storeStore.stores.length == 1) {
        storeStore.deleteStore(Number(item.storeId)).then((res) => {
            useAlertStore().addAlert('SUCCESS', '매장이 삭제되었습니다');
            let currentPageCopy = currentPage.value;
            currentPageCopy = --currentPageCopy;
            setPage(currentPageCopy == 0 ? 1 : currentPageCopy);
        });
    } else {
        storeStore.deleteStore(Number(item.storeId)).then((res) => {
            useAlertStore().addAlert('SUCCESS', '매장이 삭제되었습니다');
            getStores();
        });
    }
}
function save() {
    getStores();
    handleEditDialog('CLOSE');
}

function saveUser() {
    getStores();
    handleAddDialog('CLOSE');
}
//Edit dialog
const dialogTitle = '매장 편집';
const dialogPasswordTitle = '사용자 비밀번호 편집';
const addDialogTitle = '매장 추가';

const editDialog = ref(false);
const addDialog = ref(false);

const handleEditDialog = (action: 'OPEN' | 'CLOSE' = 'OPEN') => {
    editDialog.value = action == 'OPEN' ? true : false;
};
const handleAddDialog = (action: 'OPEN' | 'CLOSE' = 'OPEN') => {
    addDialog.value = action == 'OPEN' ? true : false;
};
function toStoreDetail(store: IStore) {
    router.push(`/store/${store.storeId}`);
}
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <AddDialog :is-open="addDialog" :dialog-title="addDialogTitle" @handle-edit-dialog="handleAddDialog" @save="saveUser"></AddDialog>
    <EditDialog
        :is-open="editDialog"
        :store="selectedStore"
        :dialog-title="dialogTitle"
        @handle-edit-dialog="handleEditDialog"
        @save="save"
    ></EditDialog>

    <v-row>
        <v-col cols="12" lg="12" md="12" class="d-flex gap-4">
            <v-btn-group class="mr-0 ml-auto">
                <v-btn class="h-100" color="secondary" variant="tonal" @click="handleAddDialog('OPEN')">매장 추가</v-btn>
                <v-btn class="h-100" color="primary" variant="tonal" @click="getStores">검색</v-btn>
            </v-btn-group>
        </v-col>
    </v-row>
    <StoreTable
        :limit="listLimit"
        :currentPage="currentPage"
        @set-page="setPage"
        @set-limit="setLimit"
        @to="toStoreDetail"
        @edit="editUserFromTable"
        @delete="deleteUser"
        :list="filteredList"
    ></StoreTable>
</template>
