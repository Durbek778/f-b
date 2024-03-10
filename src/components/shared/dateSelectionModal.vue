<script setup lang="ts">
import 'v-calendar/dist/style.css';
import { ref, watch } from 'vue';
const props = defineProps(['isOpen', 'range', 'isSelected']);
const emit = defineEmits(['handleModal', 'selectDate']);

const range = ref();

function onSave() {
    if (!range) return;
    emit('selectDate', range.value);
    emit('handleModal', 'CLOSE', 'DATE');
}
function onClear() {
    range.value = null;
    emit('selectDate', null);
}
function onCancel() {
    range.value = null;
    emit('handleModal', 'CLOSE', 'DATE');
}
watch(
    () => range.value,
    () => {
        console.log(range.value);
    }
);
</script>

<template>
    <v-dialog persistent v-model="props.isOpen" max-width="500">
        <v-card>
            <v-card-title class="pa-4 bg-primary">
                <span class="title text-white">날짜선택</span>
            </v-card-title>

            <v-card-text>
                <v-divider class="pt-5"></v-divider>
                <v-date-picker class="w-100" v-model="range" is-range></v-date-picker>
            </v-card-text>

            <v-card-actions class="pa-4">
                <template v-if="props.isSelected">
                    <v-btn color="secondary" variant="flat" @click="onClear">지우기</v-btn>
                </template>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" @click="onCancel">취소</v-btn>
                <v-btn color="primary" variant="flat" @click="onSave">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>