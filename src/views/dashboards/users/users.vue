<script setup lang="ts">
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import UsersTable from '@/components/dashboards/users/usersTable.vue';
import { onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import AddDialog from '@/components/dashboards/users/addDialog.vue';
import EditDialog from '@/components/dashboards/users/editDialog.vue';
import EditPasswordDialog from '@/components/dashboards/users/editPasswordDialog.vue';
import { useRoute } from 'vue-router';
import type { IUser } from '@/types/apiTypes';
import { useAlertStore } from '@/stores/alert';
//store
const userStore = useUsersStore();
//states

const page = ref({ title: '사용자' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        to: '/'
    },
    {
        text: '사용자',
        disabled: true,
        href: '#'
    }
]);
let selectedUser = ref<IUser>({
    userId: '',
    userName: '',
    phoneNumber: '',
    email: '',
    userType: 0,
    userMemo: '',
    deletedFlag: 1
});
const route = useRoute();
const listLimit = ref(10);
const currentPage = ref(route.query.page ? Number(route.query.page) : 1);

const getUsers = () => {
    userStore.getUsers({
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
    getUsers();
};
const setLimit = (limit: number) => {
    listLimit.value = limit;
    getUsers();
};
const filteredList = computed<IUser[]>(() => {
    return userStore.users.filter((user: IUser) => {
        return user;
    });
});
const offset = computed(() => {
    return (currentPage.value - 1) * listLimit.value;
});
onMounted(() => {
    getUsers();
});
function toUserDetail(user: IUser) {
    router.push(`/users/${user.userId}`);
}
function editUserFromTable(item: IUser) {
    selectedUser.value = item;

    handleEditDialog('OPEN');
}
function editPassword(item: IUser) {
    selectedUser.value = item;
    handleEditPasswordDialog('OPEN');
}
function deleteUser(item: IUser) {
    if (userStore.users.length == 1) {
        userStore.deleteUser(item.userId).then((res) => {
            useAlertStore().addAlert('SUCCESS', '사용자가 삭제되었습니다');
            let currentPageCopy = currentPage.value;
            currentPageCopy = --currentPageCopy;
            setPage(currentPageCopy == 0 ? 1 : currentPageCopy);
        });
    } else {
        userStore.deleteUser(item.userId).then((res) => {
            useAlertStore().addAlert('SUCCESS', '사용자가 삭제되었습니다');
            getUsers();
        });
    }
}
function save() {
    getUsers();
    handleEditDialog('CLOSE');
}
function savePassword() {
    handleEditPasswordDialog('CLOSE');
}
function saveUser() {
    getUsers();
    handleAddDialog('CLOSE');
}
//Edit dialog
const dialogTitle = '사용자 편집';
const dialogPasswordTitle = '사용자 비밀번호 편집';
const addDialogTitle = '사용자 추가';

const editDialog = ref(false);
const addDialog = ref(false);
const editPasswordDialog = ref(false);
const handleEditPasswordDialog = (action: 'OPEN' | 'CLOSE' = 'OPEN') => {
    editPasswordDialog.value = action == 'OPEN' ? true : false;
};
const handleEditDialog = (action: 'OPEN' | 'CLOSE' = 'OPEN') => {
    editDialog.value = action == 'OPEN' ? true : false;
};
const handleAddDialog = (action: 'OPEN' | 'CLOSE' = 'OPEN') => {
    addDialog.value = action == 'OPEN' ? true : false;
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <AddDialog :is-open="addDialog" :dialog-title="addDialogTitle" @handle-edit-dialog="handleAddDialog" @save="saveUser"></AddDialog>
    <EditDialog
        :is-open="editDialog"
        :user="selectedUser"
        :dialog-title="dialogTitle"
        @handle-edit-dialog="handleEditDialog"
        @save="save"
    ></EditDialog>
    <EditPasswordDialog
        :user="selectedUser"
        :is-open="editPasswordDialog"
        :dialog-title="dialogPasswordTitle"
        @handle-edit-dialog="handleEditPasswordDialog"
        @save="savePassword"
    ></EditPasswordDialog>
    <v-row>
        <v-col cols="12" lg="12" md="12" class="d-flex gap-4">
       <v-btn-group class="mr-0 ml-auto">
        <v-btn class="h-100" color="secondary" variant="tonal" @click="handleAddDialog('OPEN')">사용자 추가</v-btn>
        <v-btn class="h-100" color="primary" variant="tonal" @click="getUsers">검색</v-btn>
       </v-btn-group>
        </v-col>
    </v-row>
    <UsersTable
        :limit="listLimit"
        :currentPage="currentPage"
        @set-page="setPage"
        @set-limit="setLimit"
        @to="toUserDetail"
        @edit="editUserFromTable"
        @edit-password="editPassword"
        @delete="deleteUser"
        :list="filteredList"
    ></UsersTable>
</template>