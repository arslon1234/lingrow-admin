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
            <div v-else-if="component.type === 'TABLE_GRID'" class="my-6 overflow-x-auto">
                <table 
                    class="w-full"
                    :class="{ 'border-collapse': component.config.bordered ?? true }"
                >
                    <tbody>
                        <tr 
                            v-for="(row, rowIndex) in component.config.data" 
                            :key="`preview-row-${rowIndex}`"
                        >
                            <td 
                                v-for="(cell, colIndex) in row" 
                                :key="`preview-cell-${rowIndex}-${colIndex}`"
                                :class="getPreviewCellClasses(component.config, rowIndex, colIndex)"
                            >
                                <!-- Header cells -->
                                <div 
                                    v-if="isPreviewHeaderCell(component.config, rowIndex, colIndex)"
                                    class="font-semibold text-center py-2 px-3"
                                >
                                    {{ cell.content }}
                                </div>

                                <!-- Regular text cells -->
                                <div 
                                    v-else-if="!cell.isInput"
                                    class="py-2 px-3"
                                >
                                    {{ cell.content }}
                                </div>

                                <!-- Input field cells -->
                                <div 
                                    v-else
                                    class="py-2 px-3 flex items-center gap-2"
                                >
                                    <span class="font-bold text-sm">{{ cell.questionNumber }}.</span>
                                    <input 
                                        type="text" 
                                        :placeholder="cell.placeholder || '___'"
                                        class="flex-1 border-b-2 border-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
</script>

<style lang="scss" scoped></style>