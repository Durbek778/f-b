<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'v-calendar/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { watch, computed } from 'vue';
import OptionMenuCard from '@/components/dashboards/option-menu/menu_card.vue';
import AddModal from '@/components/dashboards/option-menu/addModal.vue';
import EditModal from '@/components/dashboards/option-menu/editModal.vue';
import Pagination2 from '@/components/shared/pagination2.vue';
import { useAlertStore } from '@/stores/alert';
import { useOptionMenuStore, type IOptionMenuParams } from '@/stores/option-menu';
import type { IOptionMenu } from '@/types/apiTypes';
import { useStoreStore } from '@/stores/store';
import { useRoute } from 'vue-router';
//states
const route = useRoute()

const page = ref({ title: '옵션 메뉴' });
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
        text: '메뉴',
        disabled: false,
        to: `/store/${route.params.id}`
    },
    {
        text: '옵션 메뉴',
        disabled: true,
        href: '#'
    }
]);

const menuStore = useOptionMenuStore();
const alertStore = useAlertStore();
// const globalVariable = useGlobalVariables();
const currentPage = ref(1);
const listLimit = 12;
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit;
});

const selectedMenu = ref<IOptionMenu | null>(null);
const editModalOpen = ref(false);
const addModalOpen = ref(false);
const handleModals = (
    action: 'OPEN' | 'CLOSE' = 'CLOSE',
    modalName: 'ADD' | 'EDIT',
    data?: IOptionMenu
) => {
    if (modalName == 'EDIT'&& action == 'OPEN') {
        selectedMenu.value = data!;
    }
    const modalMap: any = {
        EDIT: editModalOpen,
        ADD: addModalOpen,
    };

    const modal = modalMap[modalName];

    if (modal !== undefined) {
        modal.value = action === 'OPEN';
    }
};
console.log("route:",route.params)

const params = computed(() => {
    const params: IOptionMenuParams = {
        limit: listLimit,
        offset: offset.value,
        menuId:Number(route.params.menuId)
    };

    return params;
});

const getMenus = () => {
    menuStore.getOptionMenus(params.value);
};
const search = ()=>{
   getMenus()
}
onMounted(() => {

  search()
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
function deletePromotion(optionMenu: IOptionMenu) {
    if (menuStore.option_menus.length == 1) {
        menuStore.deleteOptionMenu(optionMenu.optionMenuId as number).then(() => {
            alertStore.addAlert('SUCCESS', `옵션 메뉴가 성공적으로 삭제되었습니다`);
            previousPage();
        });
    } else {
        menuStore.deleteOptionMenu(optionMenu.optionMenuId as number).then(() => {
            alertStore.addAlert('SUCCESS', `옵션 메뉴가 성공적으로 삭제되었습니다`);
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
    <AddModal :menuId="+route.params.menuId" @save="save" v-if="addModalOpen" :is-open="addModalOpen" @handle-modal="handleModals" form-title="메뉴 추가"></AddModal>
    <EditModal
        @save="save"
        :is-open="editModalOpen"
        @handle-modal="handleModals"
        form-title="옵션 메뉴 편집"
        :menu="selectedMenu as IOptionMenu"
    ></EditModal>

    <v-row>
        <v-col cols="12" class="d-flex">
        <v-btn-group  class="mr-0 ml-auto">
            <v-btn color="secondary" variant="tonal" @click="handleModals('OPEN','ADD')">메뉴 추가</v-btn>
            <v-btn color="primary" variant="tonal" @click="search">검색</v-btn>
        </v-btn-group>
    </v-col>
        <v-col v-if="menuStore.count>0" cols="12" sm="6" md="6" lg="3" xl="3" class="h-100" v-for="menu in menuStore.option_menus">
            <OptionMenuCard
                @delete="deletePromotion"
                @handle-modal="handleModals"
                :menu="menu"
            ></OptionMenuCard>
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
        message="아직 옵션 메뉴가 없습니다"
    ></Pagination2>
</template>
<style scoped lang="scss"></style>