<script setup lang="ts">
import { watchEffect } from 'vue';
import { watch } from 'vue';
import { computed, ref } from 'vue';

const props = defineProps<{
    currentPage:number,
    count:number,
    listLimit:number,
    isLoading:boolean,
    showBtn:boolean,
    message:string
}>();
const emit = defineEmits(['prev', 'next', 'setPage']);
const pageCount = computed(() => Math.ceil(props.count / props.listLimit));
const pages = computed(() => {
    const start = props.currentPage - 2;
    const end = props.currentPage + 3 > pageCount.value ? pageCount.value : props.currentPage + 3;

    const array = Array.from({ length: end - start + 1 }).map((_, i): any => {
        return i + start;
    });

    return array;
});
const previousPage = () => {
    emit('prev');
};
const nextPage = () => {
    emit('next');
};
const setPage = (item: any) => {
    emit('setPage', item);
};
</script>

<template>
    <template v-if="$props.isLoading">
        <v-row>
            <v-col cols="12">
                <div class="py-4 d-flex align-center justify-center">
                    <Loader2Icon class="pagination2__loading__icon" width="60" height="60" color="secondary"></Loader2Icon>
                </div>
            </v-col>
        </v-row>
    </template>
    <template v-else>
        <template v-if="pageCount > 1">
            <v-sheet class="py-4 mt-2 elevation-10 rounded-lg">
                <div class="pagination2__current__page__container">
                    <v-btn
                        class="mr-4"
                        variant="text"
                        :disabled="props.currentPage == 1"
                        @click="props.currentPage != 1 && previousPage()"
                        flat
                        ><CaretLeftIcon size="20" class="text-primary"
                    /></v-btn>
                    <div :class="pageCount == 2 ? `pagination2__current__page__pages__2` : `pagination2__current__page__pages`">
                        <template v-for="item in pages">
                            <template v-if="item > 0">
                                <span
                                    @click="props.currentPage != item ? setPage(item) : () => {}"
                                    :class="
                                        item == currentPage ? 'pagination2__current__page text-primary' : 'pagination2__current__page__not'
                                    "
                                >
                                    {{ item }}</span
                                >
                            </template>
                        </template>
                    </div>
                    <v-btn
                        :disabled="props.currentPage == pageCount"
                        @click="props.currentPage != pageCount && nextPage()"
                        class="ml-4"
                        variant="text"
                        flat
                        ><CaretRightIcon size="20" class="text-primary"
                    /></v-btn>
                </div>
            </v-sheet>
        </template>

        <template v-if="props.count == 0">
    <div class="d-flex justify-center align-center text-center h-100 w-100">
        <div>
            <img src="@/assets/images/backgrounds/errorimg.svg" width="500" alt="404" />
            <h4 class="text-h4 my-8">{{ props.message }}</h4>
            <v-btn v-if="props.showBtn" flat color="primary" class="mb-4" to="/store">되돌아가기</v-btn>
        </div>
       </div>
        </template>
    </template>
</template>

<style scoped lang="scss">
.pagination2 {
    &__loading {
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
    &__not__found {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__current__page__container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    &__current__page__pages {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 10%;
    }
    &__current__page__pages__2 {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 10%;
    }
    &__current__page {
        cursor: pointer;
        font-size: larger;
        font-weight: bold;
    }
    &__current__page__not {
        cursor: pointer;
    }
}
</style>