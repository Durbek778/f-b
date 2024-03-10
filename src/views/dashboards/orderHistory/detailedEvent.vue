<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'v-calendar/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { watch, computed } from 'vue';
import MenuCard from '@/components/dashboards/menu/menu_card.vue';
import AddModal from '@/components/dashboards/menu/addModal.vue';
// import IssueModal from '@/components/dashboards/promotion/issueModal.vue';
// import EditCondition from '@/components/dashboards/promotion/editCondition.vue';
import EditModal from '@/components/dashboards/menu/editModal.vue';
// import EditImages from '@/components/dashboards/promotion/editImages.vue';
// import { usePromotionsStore } from '@/stores/promotion';
import Pagination2 from '@/components/shared/pagination2.vue';
import { useAlertStore } from '@/stores/alert';
import { useMenuStore, type IMenuParams } from '@/stores/menu';
import type { IMenu } from '@/types/apiTypes';
import { useStoreStore } from '@/stores/store';
import { useRoute } from 'vue-router';
//states

const page = ref({ title: '메뉴 datailed' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        to: '/'
    },
    {
        text: '매장',
        disabled: false,
        to: '/store'
    },
    {
        text: '메뉴 ',
        disabled: true,
        href: '#'
    }
]);

const menuStore = useMenuStore();
const alertStore = useAlertStore();
// const globalVariable = useGlobalVariables();
const currentPage = ref(1);
const listLimit = 12;
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit;
});

const selectedMenu = ref<IMenu | null>(null);
const editModalOpen = ref(false);
const addModalOpen = ref(false);
const route = useRoute();
const handleModals = (action: 'OPEN' | 'CLOSE' = 'CLOSE', modalName: 'ADD' | 'EDIT', data?: IMenu) => {
    if (modalName == 'EDIT' && action == 'OPEN') {
        selectedMenu.value = data!;
    }
    const modalMap: any = {
        EDIT: editModalOpen,
        ADD: addModalOpen
    };

    const modal = modalMap[modalName];

    if (modal !== undefined) {
        modal.value = action === 'OPEN';
    }
};

const params = computed(() => {
    const params: IMenuParams = {
        limit: listLimit,
        offset: offset.value,
        storeId: Number(route.params.id)
    };

    return params;
});

const getMenus = () => {
    menuStore.getMenus(params.value);
};
const search = () => {
    getMenus();
};
onMounted(() => {
    search();
});
function nextPage() {
    currentPage.value = ++currentPage.value;
    getMenus();
}
function setPage(page: number) {
    currentPage.value = page;
    getMenus();
}
function previousPage() {
    if (currentPage.value == 1) return;
    currentPage.value = --currentPage.value;
    getMenus();
}
function deletePromotion(menu: IMenu) {
    if (menuStore.menus.length == 1) {
        menuStore.deleteMenu(menu.menuId as number).then((res) => {
            alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 삭제되었습니다`);
            previousPage();
        });
    } else {
        menuStore.deleteMenu(menu.menuId as number).then((res) => {
            alertStore.addAlert('SUCCESS', `메뉴가 성공적으로 삭제되었습니다`);
            getMenus();
        });
    }
}

function save(modalName: 'ADD' | 'EDIT') {
    handleModals('CLOSE', modalName);
    getMenus();
}
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <AddModal
        :storeId="+route.params.id"
        @save="save"
        v-if="addModalOpen"
        :is-open="addModalOpen"
        @handle-modal="handleModals"
        form-title="메뉴 추가"
    ></AddModal>

    <EditModal
        @save="save"
        :is-open="editModalOpen"
        @handle-modal="handleModals"
        form-title="메뉴 편집"
        :menu="selectedMenu as IMenu"
    ></EditModal>

    <v-row>
        <v-col cols="12" class="d-flex">
            <v-btn-group class="mr-0 ml-auto">
                <v-btn color="secondary" variant="tonal" @click="handleModals('OPEN', 'ADD')">메뉴 추가</v-btn>
                <v-btn color="primary" variant="tonal" @click="search">검색</v-btn>
            </v-btn-group>
        </v-col>
        <v-col v-if="menuStore.count > 0" cols="12" sm="6" md="6" lg="3" xl="3" class="h-100" v-for="menu in menuStore.menus">
            <MenuCard @delete="deletePromotion" @handle-modal="handleModals" :menu="menu"></MenuCard>
        </v-col>
    </v-row>
    <Pagination2
        @next="nextPage"
        @set-page="setPage"
        @prev="previousPage"
        :list-limit="listLimit"
        :is-loading="menuStore.isLoading"
        :count="menuStore.count"
        :current-page="currentPage"
        :show-btn="true"
        message=""
    ></Pagination2>
</template>
<style scoped lang="scss"></style>
