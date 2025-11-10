<template>
    <div class="space-y-3">
        <!-- Table Title -->
        <UFormGroup label="Table Title / Instruction" size="sm">
            <UTextarea 
                :model-value="component.config.title || ''"
                @update:model-value="updateTitle"
                placeholder="Write NO MORE THAN THREE WORDS for each answer"
                :rows="2"
                size="sm"
            />
        </UFormGroup>

        <UDivider />

        <!-- Table Dimensions Control -->
        <div class="flex gap-2 items-end flex-wrap">
            <UFormGroup label="Rows" size="sm" class="w-24">
                <UInput 
                    type="number" 
                    :model-value="component.config.rows || 3"
                    @update:model-value="updateDimensions('rows', $event)"
                    :min="2" 
                    :max="15"
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

        </div>

        <!-- Table Style Options -->
        <div class="flex gap-3 items-center flex-wrap">
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
                            class="align-top"
                        >
                            <!-- Header cells -->
                            <div v-if="isHeaderCell(rowIndex, colIndex)" class="p-3">
                                <input 
                                    type="text"
                                    :value="cell.content"
                                    @input="updateCellContent(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                                    class="w-full px-2 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-center border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                                    placeholder="Header"
                                />
                            </div>
                            
                            <!-- Regular cells with rich content editor -->
                            <div v-else class="p-3 space-y-3">
                                <!-- Add Content Section Button -->
                                <UButton
                                    icon="i-heroicons-plus"
                                    size="xs"
                                    color="primary"
                                    variant="soft"
                                    @click="addContentSection(rowIndex, colIndex)"
                                    block
                                >
                                    Add Content Section
                                </UButton>

                                <!-- Content Sections -->
                                <div 
                                    v-for="(section, sectionIndex) in cell.sections" 
                                    :key="`section-${sectionIndex}`"
                                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/50"
                                >
                                    <!-- Section Header -->
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-medium text-gray-600">
                                            Section {{ sectionIndex + 1 }}
                                        </span>
                                        <div class="flex gap-1">
                                            <UButton
                                                icon="i-heroicons-arrow-up"
                                                size="2xs"
                                                color="gray"
                                                variant="ghost"
                                                @click="moveSectionUp(rowIndex, colIndex, sectionIndex)"
                                                :disabled="sectionIndex === 0"
                                            />
                                            <UButton
                                                icon="i-heroicons-arrow-down"
                                                size="2xs"
                                                color="gray"
                                                variant="ghost"
                                                @click="moveSectionDown(rowIndex, colIndex, sectionIndex)"
                                                :disabled="sectionIndex === cell.sections.length - 1"
                                            />
                                            <UButton
                                                icon="i-heroicons-trash"
                                                size="2xs"
                                                color="red"
                                                variant="ghost"
                                                @click="removeSection(rowIndex, colIndex, sectionIndex)"
                                            />
                                        </div>
                                    </div>

                                    <!-- Section Type Selector -->
                                    <USelectMenu
                                        :model-value="section.type"
                                        @update:model-value="updateSectionType(rowIndex, colIndex, sectionIndex, $event)"
                                        :options="[
                                            { label: 'Text Only', value: 'text' },
                                            { label: 'Text with Input', value: 'text_input' },
                                            { label: 'Input Only', value: 'input' },
                                            { label: 'Bullet Point', value: 'bullet' }
                                        ]"
                                        value-attribute="value"
                                        option-attribute="label"
                                        size="xs"
                                        class="mb-2"
                                    />

                                    <!-- TEXT ONLY -->
                                    <div v-if="section.type === 'text'" class="space-y-2">
                                        <textarea
                                            :value="section.text"
                                            @input="updateSectionText(rowIndex, colIndex, sectionIndex, ($event.target as HTMLTextAreaElement).value)"
                                            class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                            placeholder="Enter text..."
                                            rows="2"
                                        />
                                    </div>

                                    <!-- TEXT WITH INPUT (like: "Easy to 11 ...........") -->
                                    <div v-else-if="section.type === 'text_input'" class="space-y-2">
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormGroup label="Text before" size="xs">
                                                <UInput
                                                    :model-value="section.beforeText"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'beforeText', $event)"
                                                    placeholder="Easy to"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Text after" size="xs">
                                                <UInput
                                                    :model-value="section.afterText"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'afterText', $event)"
                                                    placeholder="(optional)"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                        </div>

                                        <div class="grid grid-cols-3 gap-2">
                                            <UFormGroup label="Q#" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.questionNumber"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'questionNumber', parseInt($event))"
                                                    placeholder="11"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Placeholder" size="xs">
                                                <UInput
                                                    :model-value="section.placeholder"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'placeholder', $event)"
                                                    placeholder="..............."
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Max Words" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.maxWords"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'maxWords', parseInt($event))"
                                                    placeholder="3"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                        </div>

                                        <UFormGroup label="Correct Answer" size="xs">
                                            <UInput
                                                :model-value="section.correctAnswer"
                                                @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'correctAnswer', $event)"
                                                placeholder="Type correct answer..."
                                                size="xs"
                                                icon="i-heroicons-check-circle"
                                                color="green"
                                            />
                                        </UFormGroup>
                                    </div>

                                    <!-- INPUT ONLY (standalone input like "14 ...........") -->
                                    <div v-else-if="section.type === 'input'" class="space-y-2">
                                        <div class="grid grid-cols-3 gap-2">
                                            <UFormGroup label="Q#" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.questionNumber"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'questionNumber', parseInt($event))"
                                                    placeholder="14"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Placeholder" size="xs">
                                                <UInput
                                                    :model-value="section.placeholder"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'placeholder', $event)"
                                                    placeholder="..............."
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Max Words" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.maxWords"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'maxWords', parseInt($event))"
                                                    placeholder="3"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                        </div>

                                        <UFormGroup label="Correct Answer" size="xs">
                                            <UInput
                                                :model-value="section.correctAnswer"
                                                @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'correctAnswer', $event)"
                                                placeholder="Type correct answer..."
                                                size="xs"
                                                icon="i-heroicons-check-circle"
                                                color="green"
                                            />
                                        </UFormGroup>
                                    </div>

                                    <!-- BULLET POINT (like: "- Did not have any 12 ........") -->
                                    <div v-else-if="section.type === 'bullet'" class="space-y-2">
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormGroup label="Bullet text before" size="xs">
                                                <UInput
                                                    :model-value="section.beforeText"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'beforeText', $event)"
                                                    placeholder="- Did not have any"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Text after" size="xs">
                                                <UInput
                                                    :model-value="section.afterText"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'afterText', $event)"
                                                    placeholder="(optional)"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                        </div>

                                        <div class="grid grid-cols-3 gap-2">
                                            <UFormGroup label="Q#" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.questionNumber"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'questionNumber', parseInt($event))"
                                                    placeholder="12"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Placeholder" size="xs">
                                                <UInput
                                                    :model-value="section.placeholder"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'placeholder', $event)"
                                                    placeholder="..............."
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                            <UFormGroup label="Max Words" size="xs">
                                                <UInput
                                                    type="number"
                                                    :model-value="section.maxWords"
                                                    @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'maxWords', parseInt($event))"
                                                    placeholder="3"
                                                    size="xs"
                                                />
                                            </UFormGroup>
                                        </div>

                                        <UFormGroup label="Correct Answer" size="xs">
                                            <UInput
                                                :model-value="section.correctAnswer"
                                                @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'correctAnswer', $event)"
                                                placeholder="Type correct answer..."
                                                size="xs"
                                                icon="i-heroicons-check-circle"
                                                color="green"
                                            />
                                        </UFormGroup>

                                        <!-- Additional bullet text -->
                                        <UFormGroup label="Additional line (optional)" size="xs">
                                            <UInput
                                                :model-value="section.additionalText"
                                                @update:model-value="updateSectionField(rowIndex, colIndex, sectionIndex, 'additionalText', $event)"
                                                placeholder="in the side bar"
                                                size="xs"
                                            />
                                        </UFormGroup>
                                    </div>
                                </div>

                                <!-- Empty State -->
                                <div v-if="!cell.sections || cell.sections.length === 0" 
                                    class="text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                                    Click "Add Content Section" to start
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

interface ContentSection {
    type: 'text' | 'text_input' | 'input' | 'bullet'
    text?: string
    beforeText?: string
    afterText?: string
    additionalText?: string
    questionNumber?: number
    placeholder?: string
    correctAnswer?: string
    maxWords?: number
}

interface TableCell {
    content?: string
    sections: ContentSection[]
}

const props = defineProps(['component'])
const listeningStore = useListeningStore()

const tableData = ref<TableCell[][]>([])

const initializeTable = () => {
    const rows = props.component.config.rows || 3
    const columns = props.component.config.columns || 4
    const existingData = props.component.config.data || []
    
    tableData.value = Array.from({ length: rows }, (_, rowIndex) => 
        Array.from({ length: columns }, (_, colIndex) => {
            if (existingData[rowIndex]?.[colIndex]) {
                return { 
                    content: existingData[rowIndex][colIndex].content || '',
                    sections: existingData[rowIndex][colIndex].sections || []
                }
            }
            return {
                content: '',
                sections: []
            }
        })
    )
}

onMounted(() => {
    initializeTable()
})

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
    } else {
        classes.push('bg-white dark:bg-gray-950')
    }
    
    return classes.join(' ')
}

const updateCellContent = (rowIndex: number, colIndex: number, value: string) => {
    tableData.value[rowIndex][colIndex].content = value
    saveTableData()
}

const addContentSection = (rowIndex: number, colIndex: number) => {
    if (!tableData.value[rowIndex][colIndex].sections) {
        tableData.value[rowIndex][colIndex].sections = []
    }
    
    tableData.value[rowIndex][colIndex].sections.push({
        type: 'text',
        text: '',
        beforeText: '',
        afterText: '',
        questionNumber: 1,
        placeholder: '.....................',
        correctAnswer: '',
        maxWords: 3
    })
    
    saveTableData()
}

const removeSection = (rowIndex: number, colIndex: number, sectionIndex: number) => {
    tableData.value[rowIndex][colIndex].sections.splice(sectionIndex, 1)
    saveTableData()
}

const moveSectionUp = (rowIndex: number, colIndex: number, sectionIndex: number) => {
    if (sectionIndex > 0) {
        const sections = tableData.value[rowIndex][colIndex].sections
        const temp = sections[sectionIndex]
        sections[sectionIndex] = sections[sectionIndex - 1]
        sections[sectionIndex - 1] = temp
        saveTableData()
    }
}

const moveSectionDown = (rowIndex: number, colIndex: number, sectionIndex: number) => {
    const sections = tableData.value[rowIndex][colIndex].sections
    if (sectionIndex < sections.length - 1) {
        const temp = sections[sectionIndex]
        sections[sectionIndex] = sections[sectionIndex + 1]
        sections[sectionIndex + 1] = temp
        saveTableData()
    }
}

const updateSectionType = (rowIndex: number, colIndex: number, sectionIndex: number, type: string) => {
    tableData.value[rowIndex][colIndex].sections[sectionIndex].type = type as any
    saveTableData()
}

const updateSectionText = (rowIndex: number, colIndex: number, sectionIndex: number, value: string) => {
    tableData.value[rowIndex][colIndex].sections[sectionIndex].text = value
    saveTableData()
}

const updateSectionField = (
    rowIndex: number, 
    colIndex: number, 
    sectionIndex: number, 
    field: keyof ContentSection, 
    value: any
) => {
    (tableData.value[rowIndex][colIndex].sections[sectionIndex] as any)[field] = value
    saveTableData()
}

const updateTitle = (value: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        title: value
    })
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
</script>

<style scoped>
table {
    table-layout: fixed;
}

td {
    min-width: 180px;
}
</style>