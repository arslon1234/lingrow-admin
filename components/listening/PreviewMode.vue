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

            <!-- QuestionPreview.vue - IMAGE Preview -->
            <div v-else-if="component.type === 'IMAGE'" class="my-6">
                <UCard v-if="component.config.url">
                    <NuxtImg :src="component.config.url" :alt="component.config.alt || 'Question image'"
                        class="w-full rounded-lg" loading="lazy" />
                    <template v-if="component.config.caption" #footer>
                        <p class="text-sm text-gray-600 dark:text-gray-400 text-center italic">
                            {{ component.config.caption }}
                        </p>
                    </template>
                </UCard>

                <UAlert v-else icon="i-heroicons-photo" color="red" variant="subtle" title="No image available"
                    description="Image will be displayed here once uploaded" />
            </div>

            <!-- TABLE_GRID Preview -->
            <div v-else-if="component.type === 'TABLE_GRID'" class="my-6">
                <!-- Table Title/Instruction -->
                <div v-if="component.config.title" class="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap">
                        {{ component.config.title }}
                    </p>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="w-full" :class="{ 'border-collapse': component.config.bordered ?? true }">
                        <tbody>
                            <tr v-for="(row, rowIndex) in component.config.data" :key="`preview-row-${rowIndex}`">
                                <td v-for="(cell, colIndex) in row" :key="`preview-cell-${rowIndex}-${colIndex}`"
                                    :class="getPreviewCellClasses(component.config, rowIndex, colIndex)"
                                    class="p-3 align-top">
                                    <!-- Header cells -->
                                    <div v-if="isPreviewHeaderCell(component.config, rowIndex, colIndex)"
                                        class="font-semibold text-center">
                                        {{ cell.content }}
                                    </div>

                                    <!-- Regular cells with sections -->
                                    <div v-else class="space-y-2">
                                        <template v-for="(section, sectionIndex) in cell.sections"
                                            :key="`section-${sectionIndex}`">
                                            <!-- TEXT ONLY -->
                                            <p v-if="section.type === 'text'" class="text-sm whitespace-pre-wrap">
                                                {{ section.text }}
                                            </p>

                                            <!-- TEXT WITH INPUT -->
                                            <div v-else-if="section.type === 'text_input'"
                                                class="text-sm flex flex-wrap items-center gap-1">
                                                <span v-if="section.beforeText">{{ section.beforeText }}</span>
                                                <span class="font-bold">{{ section.questionNumber }}</span>
                                                <input type="text" :placeholder="section.placeholder"
                                                    class="border-b border-gray-400 px-1 py-0.5 bg-transparent focus:outline-none focus:border-primary-500 min-w-[120px] inline-block" />
                                                <span v-if="section.afterText">{{ section.afterText }}</span>
                                            </div>

                                            <!-- INPUT ONLY -->
                                            <div v-else-if="section.type === 'input'"
                                                class="text-sm flex items-center gap-1">
                                                <span class="font-bold">{{ section.questionNumber }}</span>
                                                <input type="text" :placeholder="section.placeholder"
                                                    class="border-b border-gray-400 px-1 py-0.5 bg-transparent focus:outline-none focus:border-primary-500 flex-1" />
                                            </div>

                                            <!-- BULLET POINT -->
                                            <div v-else-if="section.type === 'bullet'" class="text-sm space-y-1">
                                                <div class="flex flex-wrap items-center gap-1">
                                                    <span v-if="section.beforeText">{{ section.beforeText }}</span>
                                                    <span class="font-bold">{{ section.questionNumber }}</span>
                                                    <input type="text" :placeholder="section.placeholder"
                                                        class="border-b border-gray-400 px-1 py-0.5 bg-transparent focus:outline-none focus:border-primary-500 min-w-[100px] inline-block"
                                                        readonly />
                                                    <span v-if="section.afterText">{{ section.afterText }}</span>
                                                </div>
                                                <p v-if="section.additionalText"
                                                    class="pl-4 text-gray-700 dark:text-gray-300">
                                                    {{ section.additionalText }}
                                                </p>
                                            </div>
                                        </template>

                                        <!-- Empty cell -->
                                        <p v-if="!cell.sections || cell.sections.length === 0"
                                            class="text-gray-400 text-xs italic">
                                            Empty cell
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <!-- NUMBERED_LIST Preview -->
            <div v-else-if="component.type === 'NUMBERED_LIST'" class="my-6">
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
defineProps(['components'])

const isPreviewHeaderCell = (config: any, rowIndex: number, colIndex: number): boolean => {
    const hasHeaderRow = config.hasHeaderRow ?? true
    const hasHeaderColumn = config.hasHeaderColumn ?? false

    return (hasHeaderRow && rowIndex === 0) || (hasHeaderColumn && colIndex === 0)
}

const getPreviewCellClasses = (config: any, rowIndex: number, colIndex: number): string => {
    const classes = []
    const bordered = config.bordered ?? true

    if (bordered) {
        classes.push('border border-gray-300 dark:border-gray-700')
    }

    if (isPreviewHeaderCell(config, rowIndex, colIndex)) {
        classes.push('bg-gray-100 dark:bg-gray-800')
    } else {
        classes.push('bg-white dark:bg-gray-950')
    }

    return classes.join(' ')
}

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