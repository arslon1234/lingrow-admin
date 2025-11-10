<template>
    <div class="my-6">
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
</template>

<script setup lang="ts">
defineProps(['component']);

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

<style lang="scss" scoped>

</style>