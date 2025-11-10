<template>
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div v-for="component in components" :key="component.id">
            <!-- Header -->
            <component v-if="component.type === 'HEADER'" :is="`h${component.config.level}`"
                class="font-bold mb-2 text-center">
                {{ component.config.text }}
            </component>

            <!-- Subheader -->
            <h4 v-else-if="component.type === 'SUBHEADER'" class="text-gray-700 mb-2 font-semibold">
                {{ component.config.text }}
            </h4>

            <!-- Paragraph or Text Line -->
            <p v-else-if="component.type === 'PARAGRAPH' || component.type === 'TEXT_LINE'" class="mb-2 text-gray-800">
                {{ component.config.text }}
            </p>

            <!-- Input Line -->
            <div v-else-if="component.type === 'INPUT_LINE'" class="mb-3">
                <label class="block text-sm font-medium mb-1">{{ component.config.label }}</label>
                <input type="text" :placeholder="component.config.placeholder"
                    class="w-full border rounded px-3 py-2 bg-gray-50" readonly />
            </div>

            <!-- Instruction Box -->
            <div v-else-if="component.type === 'INSTRUCTION_BOX'"
                class="mb-4 p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
                <p class="text-sm text-gray-700 italic">
                    {{ component.config.text }}
                </p>
            </div>

            <!-- Input Inline -->
            <p v-else-if="component.type === 'INPUT_INLINE'" class="mb-2">
                {{ component.config.beforeText }}
                <span class="font-bold">{{ component.config.questionNumber || 1 }}.</span>
                <input type="text" :placeholder="component.config.placeholder || '___'"
                    class="border-b-2 border-gray-400 px-2 py-1 mx-1 w-32 bg-gray-50" />
                {{ component.config.afterText }}
            </p>

            <!-- MCQ Options -->
            <div v-else-if="component.type === 'MCQ_OPTIONS'" class="mb-4">
                <!-- Question Text -->
                <p v-if="component.config.questionText" class="font-medium mb-3 text-gray-800">
                    <span class="font-bold">{{ component.config.questionNumber || 1 }}.</span> {{
                        component.config.questionText }}
                </p>

                <!-- Options -->
                <div class="space-y-2">
                    <label v-for="(option, idx) in component.config.options" :key="idx" class="flex items-center gap-2">
                        <input type="radio" :name="`mcq-${component.id}`" />
                        <span>{{ option }}</span>
                    </label>
                </div>
            </div>

            <!-- IMAGE Preview -->
            <image-preview v-else-if="component.type === 'IMAGE'" :component="component" />

            <!-- TABLE_GRID Preview -->
            <table-grid-preview v-else-if="component.type === 'TABLE_GRID'" :component="component" />


            <!-- NUMBERED_LIST Preview -->
            <numbered-list-preview v-else-if="component.type === 'NUMBERED_LIST'" :component="component" />

            <!-- BULLET_LIST Preview -->
            <div v-else-if="component.type === 'BULLET_LIST'" class="my-6">
                <!-- List Title -->
                <div v-if="component.config.title" class="mb-4">
                    <p class="font-medium text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {{ component.config.title }}
                    </p>
                </div>

                <!-- List Items -->
                <ul class="space-y-2" :class="getBulletListClass(component.config.bulletStyle || 'disc')">
                    <li v-for="(item, index) in component.config.items" :key="`preview-item-${index}`"
                        :class="{ 'ml-8': item.type === 'sub_bullet' }" class="flex items-start gap-2">
                        <!-- Bullet Symbol -->
                        <span class="mt-2 text-gray-600 dark:text-gray-400 select-none">
                            {{ getBulletSymbolPreview(component.config.bulletStyle || 'disc', item.type ===
                                'sub_bullet') }}
                        </span>

                        <!-- TEXT ONLY -->
                        <div v-if="item.type === 'text'" class="flex-1 pt-2">
                            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {{ item.text }}
                            </p>
                        </div>

                        <!-- INPUT FIELD ONLY -->
                        <div v-else-if="item.type === 'input'" class="flex-1 space-y-1">
                            <label v-if="item.label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ item.label }}
                            </label>
                            <div class="flex items-center gap-2">
                                <span class="font-bold">{{ item.questionNumber }}.</span>
                                <input type="text" :placeholder="item.placeholder"
                                    class="flex-1 border-b-2 border-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500"
                                    readonly />
                            </div>
                        </div>

                        <!-- TEXT WITH INPUT -->
                        <div v-else-if="item.type === 'text_input'" class="flex-1 pt-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <span v-if="item.beforeText" class="text-gray-700 dark:text-gray-300">
                                    {{ item.beforeText }}
                                </span>
                                <span class="font-bold">{{ item.questionNumber }}.</span>
                                <input type="text" :placeholder="item.placeholder"
                                    class="border-b-2 border-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500 min-w-[120px]"
                                    readonly />
                                <span v-if="item.afterText" class="text-gray-700 dark:text-gray-300">
                                    {{ item.afterText }}
                                </span>
                            </div>
                        </div>

                        <!-- SUB-BULLET -->
                        <div v-else-if="item.type === 'sub_bullet'" class="flex-1 pt-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <span v-if="item.beforeText" class="text-gray-700 dark:text-gray-300">
                                    {{ item.beforeText }}
                                </span>
                                <span class="font-bold">{{ item.questionNumber }}.</span>
                                <input type="text" :placeholder="item.placeholder"
                                    class="border-b-2 border-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500 min-w-[120px]"
                                    readonly />
                                <span v-if="item.afterText" class="text-gray-700 dark:text-gray-300">
                                    {{ item.afterText }}
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>

                <!-- Empty State -->
                <div v-if="!component.config.items || component.config.items.length === 0"
                    class="text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                    No items in this bullet list
                </div>
            </div>

            <!-- Default -->
            <div v-else class="text-gray-400 italic mb-2">
                [{{ component.type }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ImagePreview from './question-types/image/preview.vue';
import TableGridPreview from './question-types/table/preview.vue';
import NumberedListPreview from './question-types/numbered-list/preview.vue';

defineProps(['components'])

const getBulletListClass = (style: string): string => {
    return 'list-none'
}

const getBulletSymbolPreview = (style: string, isSubBullet: boolean): string => {
    if (isSubBullet) {
        return '○' // Sub-bullets always use circle
    }

    const symbols: Record<string, string> = {
        disc: '•',
        circle: '○',
        square: '▪',
        dash: '-'
    }
    return symbols[style] || '•'
}

</script>

<style lang="scss" scoped></style>