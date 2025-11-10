<template>
    <div class="my-6">
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
                            :class="getPreviewCellClasses(component.config, rowIndex, colIndex)" class="p-3 align-top">
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
                                    <div v-else-if="section.type === 'input'" class="text-sm flex items-center gap-1">
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
                                        <p v-if="section.additionalText" class="pl-4 text-gray-700 dark:text-gray-300">
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
</template>

<script setup lang="ts">
defineProps(['component'])

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
</script>

<style lang="scss" scoped></style>