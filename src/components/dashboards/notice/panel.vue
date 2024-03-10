<script setup lang="ts">
import moment from 'moment';
const props = defineProps(['notice']);
const emit = defineEmits(['delete', 'edit']);
function handleEmit(expanded: any, notice: any) {
    if (expanded) {
        emit('edit', notice);
    } else {
        emit('delete', notice);
    }
}
</script>

<template>
    <v-expansion-panel elevation="10">
        <v-expansion-panel-title class="text-h6">
            {{ props.notice.noticeTitle }}
            <v-spacer></v-spacer>
            <v-chip color="secondary" class="mr-5">{{
                moment(props.notice.createdAt).subtract(9, 'hours').format('YYYY-MM-DD HH:mm')
            }}</v-chip>
            <template v-slot:actions="{ expanded }">
                <v-icon
                    @click.stop="handleEmit(expanded, props.notice)"
                    :color="!expanded ? 'error' : 'primary'"
                    :icon="expanded ? 'mdi-pencil' : 'mdi-delete'"
                ></v-icon>
            </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text style="white-space: pre-wrap">
            {{ props.notice.noticeContent }}
        </v-expansion-panel-text>
        <v-divider></v-divider>
    </v-expansion-panel>
</template>