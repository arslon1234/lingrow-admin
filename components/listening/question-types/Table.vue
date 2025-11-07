<template>
    <div class="space-y-4">
        <!-- Table Dimensions Control -->
        <div class="flex gap-3 items-end">
            <UFormGroup label="Rows" size="sm" class="w-24">
                <UInput 
                    type="number" 
                    :model-value="component.config.rows || 3"
                    @update:model-value="updateDimensions('rows', $event)"
                    :min="2" 
                    :max="10"
                    size="sm"
                />
            </UFormGroup>
            
            <UFormGroup label="Columns" size="sm" class="w-24">
                <UInput 
                    type="number" 
                    :model-value="component.config.columns || 3"
                    @update:model-value="updateDimensions('columns', $event)"
                    :min="2" 
                    :max="8"
                    size="sm"
                />
            </UFormGroup>

            <UButton 
                icon="i-heroicons-arrow-path" 
                color="gray" 
                variant="soft"
                size="sm"
                @click="resetTable"
            >
                Reset Table
            </UButton>
        </div>

        <!-- Table Style Options -->
        <div class="flex gap-3 items-center">
            <UCheckbox 
                :model-value="component.config.hasHeaderRow ?? true"
                @update:model-value="toggleHeaderRow"
                label="Header Row"
            />
            <UCheckbox 
                :model-value="component.config.hasHeaderColumn ?? false"
                @update:model-value="toggleHeaderColumn"
                label="Header Column"
            />
            <UCheckbox 
                :model-value="component.config.bordered ?? true"
                @update:model-value="toggleBordered"
                label="Bordered"
            />
        </div>

        <UDivider />

        <!-- Table Editor -->
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <tbody>
                    <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
                        <td 
                            v-for="(cell, colIndex) in row" 
                            :key="`cell-${rowIndex}-${colIndex}`"
                            :class="getCellClasses(rowIndex, colIndex)"
                        >
                            <!-- Header cells -->
                            <input 
                                v-if="isHeaderCell(rowIndex, colIndex)"
                                type="text"
                                :value="cell.content"
                                @input="updateCell(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                                class="w-full px-2 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-center border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Header"
                            />
                            
                            <!-- Regular cells with input field option -->
                            <div v-else class="flex items-center gap-2 p-2">
                                <!-- Toggle between text and input -->
                                <UButton
                                    :icon="cell.isInput ? 'i-heroicons-cursor-arrow-rays' : 'i-heroicons-pencil-square'"
                                    size="2xs"
                                    color="gray"
                                    variant="ghost"
                                    @click="toggleCellType(rowIndex, colIndex)"
                                    :title="cell.isInput ? 'Convert to text' : 'Convert to input field'"
                                />

                                <!-- Text input for cell content -->
                                <input
                                    v-if="!cell.isInput"
                                    type="text"
                                    :value="cell.content"
                                    @input="updateCell(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                                    class="flex-1 px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent"
                                    placeholder="Cell text"
                                />

                                <!-- Input field placeholder -->
                                <div v-else class="flex-1 flex items-center gap-2">
                                    <span class="text-xs text-gray-500">Q{{ cell.questionNumber || '?' }}:</span>
                                    <input
                                        type="text"
                                        :value="cell.placeholder || '___'"
                                        @input="updateCellPlaceholder(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                                        class="flex-1 px-2 py-1 text-sm border border-dashed border-gray-300 rounded bg-gray-50 dark:bg-gray-900"
                                        placeholder="Placeholder"
                                    />
                                </div>

                                <!-- Question number for input cells -->
                                <input
                                    v-if="cell.isInput"
                                    type="number"
                                    :value="cell.questionNumber || 1"
                                    @input="updateCellQuestionNumber(rowIndex, colIndex, parseInt(($event.target as HTMLInputElement).value))"
                                    class="w-12 px-1 py-1 text-xs border rounded"
                                    min="1"
                                    title="Question number"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Helper Text -->
        <UAlert
            icon="i-heroicons-information-circle"
            color="blue"
            variant="soft"
            title="Table Editor Tips"
            description="Click the icon to toggle between text and input field. Input fields will show as answer blanks in preview mode."
        />
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

interface TableCell {
    content: string
    isInput: boolean
    questionNumber?: number
    placeholder?: string
    correctAnswer?: string
}

const props = defineProps(['component'])
const listeningStore = useListeningStore()

// Initialize table data from component config
const tableData = ref<TableCell[][]>([])

const initializeTable = () => {
    const rows = props.component.config.rows || 3
    const columns = props.component.config.columns || 3
    const existingData = props.component.config.data || []
    
    tableData.value = Array.from({ length: rows }, (_, rowIndex) => 
        Array.from({ length: columns }, (_, colIndex) => {
            // Use existing data if available
            if (existingData[rowIndex]?.[colIndex]) {
                return { ...existingData[rowIndex][colIndex] }
            }
            // Default cell data
            return {
                content: '',
                isInput: false,
                questionNumber: 1,
                placeholder: '___',
                correctAnswer: ''
            }
        })
    )
}

// Initialize on mount
onMounted(() => {
    initializeTable()
})

// Watch for dimension changes
watch(() => [props.component.config.rows, props.component.config.columns], () => {
    initializeTable()
})

const isHeaderCell = (rowIndex: number, colIndex: number): boolean => {
    const hasHeaderRow = props.component.config.hasHeaderRow ?? true
    const hasHeaderColumn = props.component.config.hasHeaderColumn ?? false
    
    return (hasHeaderRow && rowIndex === 0) || (hasHeaderColumn && colIndex === 0)
}

const getCellClasses = (rowIndex: number, colIndex: number): string => {
    const classes = []
    const bordered = props.component.config.bordered ?? true
    
    if (bordered) {
        classes.push('border border-gray-300 dark:border-gray-700')
    }
    
    if (isHeaderCell(rowIndex, colIndex)) {
        classes.push('bg-gray-100 dark:bg-gray-800')
    }
    
    return classes.join(' ')
}

const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    tableData.value[rowIndex][colIndex].content = value
    saveTableData()
}

const toggleCellType = (rowIndex: number, colIndex: number) => {
    tableData.value[rowIndex][colIndex].isInput = !tableData.value[rowIndex][colIndex].isInput
    saveTableData()
}

const updateCellPlaceholder = (rowIndex: number, colIndex: number, value: string) => {
    tableData.value[rowIndex][colIndex].placeholder = value
    saveTableData()
}

const updateCellQuestionNumber = (rowIndex: number, colIndex: number, value: number) => {
    tableData.value[rowIndex][colIndex].questionNumber = value
    saveTableData()
}

const saveTableData = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        data: tableData.value
    })
}

const updateDimensions = (type: 'rows' | 'columns', value: string) => {
    const numValue = parseInt(value) || 3
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        [type]: numValue
    })
}

const toggleHeaderRow = (value: boolean) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        hasHeaderRow: value
    })
}

const toggleHeaderColumn = (value: boolean) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        hasHeaderColumn: value
    })
}

const toggleBordered = (value: boolean) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        bordered: value
    })
}

const resetTable = () => {
    listeningStore.updateComponent(props.component.id, {
        rows: 3,
        columns: 3,
        hasHeaderRow: true,
        hasHeaderColumn: false,
        bordered: true,
        data: []
    })
    initializeTable()
}
</script>

<style scoped>
table {
    table-layout: fixed;
}

td {
    min-width: 120px;
    vertical-align: top;
}
</style>