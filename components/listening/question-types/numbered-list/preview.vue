<template>
    <div class="my-6">
        <!-- List Title -->
        <div v-if="component.config.title" class="mb-4">
            <p class="font-semibold text-gray-800 dark:text-gray-200">
                {{ component.config.title }}
            </p>
        </div>

        <!-- List Items -->
        <div class="space-y-3">
            <div v-for="(item, index) in component.config.items" :key="`preview-item-${index}`"
                class="flex items-start gap-3">
                <!-- Question Number -->
                <span class="font-bold text-gray-800 dark:text-gray-200 min-w-[2rem] mt-2">
                    {{ (component.config.startNumber || 1) + index }}.
                </span>

                <!-- TEXT ONLY -->
                <div v-if="item.type === 'text'" class="flex-1 pt-2">
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {{ item.text }}
                    </p>
                </div>

                <!-- INPUT FIELD -->
                <div v-else-if="item.type === 'input'" class="flex-1 space-y-1">
                    <label v-if="item.label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ item.label }}
                    </label>
                    <input type="text" :placeholder="item.placeholder"
                        class="w-full border-b-2 border-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500" />
                </div>

                <!-- TEXT WITH INPUT -->
                <div v-else-if="item.type === 'text_input'" class="flex-1 pt-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span v-if="item.beforeText" class="text-gray-700 dark:text-gray-300">
                            {{ item.beforeText }}
                        </span>
                        <input type="text" :placeholder="item.placeholder"
                            class="border-b-2 border-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500 min-w-[150px]" />
                        <span v-if="item.afterText" class="text-gray-700 dark:text-gray-300">
                            {{ item.afterText }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!component.config.items || component.config.items.length === 0"
            class="text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-lg">
            No items in this numbered list
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['component']);
</script>

<style lang="scss" scoped></style>