<template>
    <div class="space-y-4">
        <!-- List Title/Instruction -->
        <UFormGroup label="List Title (Optional)" size="sm">
            <UTextarea 
                :model-value="component.config.title || ''"
                @update:model-value="updateTitle"
                placeholder="Section title or instruction..."
                :rows="2"
                size="sm"
            />
        </UFormGroup>

        <UDivider />

        <!-- Bullet Style Selection -->
        <div class="flex gap-3 items-end">
            <UFormGroup label="Bullet Style" size="sm" class="flex-1">
                <USelectMenu
                    :model-value="component.config.bulletStyle || 'disc'"
                    @update:model-value="updateBulletStyle"
                    :options="[
                        { label: '• Disc (default)', value: 'disc' },
                        { label: '○ Circle', value: 'circle' },
                        { label: '▪ Square', value: 'square' },
                        { label: '- Dash', value: 'dash' }
                    ]"
                    value-attribute="value"
                    option-attribute="label"
                    size="sm"
                />
            </UFormGroup>

            <UButton 
                icon="i-heroicons-plus-circle" 
                color="primary" 
                variant="soft"
                size="sm"
                @click="addListItem"
            >
                Add Item
            </UButton>

            <UButton 
                icon="i-heroicons-arrow-path" 
                color="gray" 
                variant="soft"
                size="sm"
                @click="resetList"
            >
                Reset
            </UButton>
        </div>

        <UDivider />

        <!-- List Items -->
        <div class="space-y-3">
            <div 
                v-for="(item, index) in listItems" 
                :key="`item-${index}`"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900"
            >
                <!-- Item Header -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-lg text-primary-600 dark:text-primary-400">
                            {{ getBulletSymbol(component.config.bulletStyle || 'disc') }}
                        </span>
                        <UBadge 
                            :color="item.type === 'input' ? 'green' : item.type === 'text_input' ? 'blue' : 'gray'" 
                            variant="soft"
                            size="xs"
                        >
                            {{ getItemTypeLabel(item.type) }}
                        </UBadge>
                    </div>

                    <div class="flex gap-1">
                        <UButton
                            icon="i-heroicons-arrow-up"
                            size="xs"
                            color="gray"
                            variant="ghost"
                            @click="moveItemUp(index)"
                            :disabled="index === 0"
                        />
                        <UButton
                            icon="i-heroicons-arrow-down"
                            size="xs"
                            color="gray"
                            variant="ghost"
                            @click="moveItemDown(index)"
                            :disabled="index === listItems.length - 1"
                        />
                        <UButton
                            icon="i-heroicons-trash"
                            size="xs"
                            color="red"
                            variant="ghost"
                            @click="removeItem(index)"
                        />
                    </div>
                </div>

                <!-- Item Type Selector -->
                <div class="mb-3">
                    <USelectMenu
                        :model-value="item.type"
                        @update:model-value="updateItemType(index, $event)"
                        :options="[
                            { label: 'Text Only', value: 'text' },
                            { label: 'Text with Input', value: 'text_input' },
                            { label: 'Input Field Only', value: 'input' },
                            { label: 'Sub-bullet (nested)', value: 'sub_bullet' }
                        ]"
                        value-attribute="value"
                        option-attribute="label"
                        size="sm"
                    />
                </div>

                <!-- TEXT ONLY -->
                <div v-if="item.type === 'text'" class="space-y-2">
                    <UFormGroup label="Text Content" size="sm">
                        <UTextarea
                            :model-value="item.text"
                            @update:model-value="updateItemField(index, 'text', $event)"
                            placeholder="Enter bullet point text..."
                            :rows="2"
                            size="sm"
                        />
                    </UFormGroup>
                </div>

                <!-- TEXT WITH INPUT (e.g., "The building is ___ meters tall") -->
                <div v-else-if="item.type === 'text_input'" class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                        <UFormGroup label="Text Before Input" size="sm">
                            <UInput
                                :model-value="item.beforeText"
                                @update:model-value="updateItemField(index, 'beforeText', $event)"
                                placeholder="The answer is"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Text After Input" size="sm">
                            <UInput
                                :model-value="item.afterText"
                                @update:model-value="updateItemField(index, 'afterText', $event)"
                                placeholder="meters high (optional)"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <UFormGroup label="Q#" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.questionNumber"
                                @update:model-value="updateItemField(index, 'questionNumber', parseInt($event))"
                                placeholder="1"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Placeholder" size="sm">
                            <UInput
                                :model-value="item.placeholder"
                                @update:model-value="updateItemField(index, 'placeholder', $event)"
                                placeholder="___________"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Max Words" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.maxWords"
                                @update:model-value="updateItemField(index, 'maxWords', parseInt($event))"
                                placeholder="2"
                                :min="1"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>

                    <UFormGroup label="Correct Answer" size="sm">
                        <UInput
                            :model-value="item.correctAnswer"
                            @update:model-value="updateItemField(index, 'correctAnswer', $event)"
                            placeholder="Type the correct answer..."
                            size="sm"
                            icon="i-heroicons-check-circle"
                            color="green"
                        />
                    </UFormGroup>
                </div>

                <!-- INPUT ONLY -->
                <div v-else-if="item.type === 'input'" class="space-y-3">
                    <UFormGroup label="Label (optional)" size="sm">
                        <UInput
                            :model-value="item.label"
                            @update:model-value="updateItemField(index, 'label', $event)"
                            placeholder="Name: or Location: (optional)"
                            size="sm"
                        />
                    </UFormGroup>

                    <div class="grid grid-cols-3 gap-3">
                        <UFormGroup label="Q#" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.questionNumber"
                                @update:model-value="updateItemField(index, 'questionNumber', parseInt($event))"
                                placeholder="1"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Placeholder" size="sm">
                            <UInput
                                :model-value="item.placeholder"
                                @update:model-value="updateItemField(index, 'placeholder', $event)"
                                placeholder="___________"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Max Words" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.maxWords"
                                @update:model-value="updateItemField(index, 'maxWords', parseInt($event))"
                                placeholder="2"
                                :min="1"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>

                    <UFormGroup label="Correct Answer" size="sm">
                        <UInput
                            :model-value="item.correctAnswer"
                            @update:model-value="updateItemField(index, 'correctAnswer', $event)"
                            placeholder="Type the correct answer..."
                            size="sm"
                            icon="i-heroicons-check-circle"
                            color="green"
                        />
                    </UFormGroup>
                </div>

                <!-- SUB-BULLET (nested bullet point) -->
                <div v-else-if="item.type === 'sub_bullet'" class="space-y-3">
                    <UAlert
                        icon="i-heroicons-information-circle"
                        color="blue"
                        variant="soft"
                        size="xs"
                        title="Sub-bullet will be indented"
                    />

                    <div class="grid grid-cols-2 gap-3">
                        <UFormGroup label="Text Before Input" size="sm">
                            <UInput
                                :model-value="item.beforeText"
                                @update:model-value="updateItemField(index, 'beforeText', $event)"
                                placeholder="Sub-point text"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Text After Input" size="sm">
                            <UInput
                                :model-value="item.afterText"
                                @update:model-value="updateItemField(index, 'afterText', $event)"
                                placeholder="(optional)"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <UFormGroup label="Q#" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.questionNumber"
                                @update:model-value="updateItemField(index, 'questionNumber', parseInt($event))"
                                placeholder="1"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Placeholder" size="sm">
                            <UInput
                                :model-value="item.placeholder"
                                @update:model-value="updateItemField(index, 'placeholder', $event)"
                                placeholder="___________"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Max Words" size="sm">
                            <UInput
                                type="number"
                                :model-value="item.maxWords"
                                @update:model-value="updateItemField(index, 'maxWords', parseInt($event))"
                                placeholder="2"
                                :min="1"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>

                    <UFormGroup label="Correct Answer" size="sm">
                        <UInput
                            :model-value="item.correctAnswer"
                            @update:model-value="updateItemField(index, 'correctAnswer', $event)"
                            placeholder="Type the correct answer..."
                            size="sm"
                            icon="i-heroicons-check-circle"
                            color="green"
                        />
                    </UFormGroup>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="listItems.length === 0" 
                class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <UIcon name="i-heroicons-list-bullet" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p class="text-gray-500 text-sm mb-3">No items in the list yet</p>
                <UButton 
                    icon="i-heroicons-plus-circle" 
                    color="primary" 
                    variant="soft"
                    size="sm"
                    @click="addListItem"
                >
                    Add First Item
                </UButton>
            </div>
        </div>

        <!-- Helper Text -->
        <UAlert
            icon="i-heroicons-information-circle"
            color="blue"
            variant="soft"
            title="Bullet List Guide"
        >
            <template #description>
                <ul class="text-sm space-y-1 mt-2">
                    <li><strong>Text Only:</strong> Static bullet point without input</li>
                    <li><strong>Text with Input:</strong> Bullet point with embedded answer blank</li>
                    <li><strong>Input Only:</strong> Just an input field with question number</li>
                    <li><strong>Sub-bullet:</strong> Indented nested bullet point (for sub-points)</li>
                    <li>• Choose bullet style (•, ○, ▪, -) for the entire list</li>
                </ul>
            </template>
        </UAlert>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

interface ListItem {
    type: 'text' | 'input' | 'text_input' | 'sub_bullet'
    text?: string
    label?: string
    beforeText?: string
    afterText?: string
    placeholder?: string
    correctAnswer?: string
    maxWords?: number
    questionNumber?: number
}

const props = defineProps(['component'])
const listeningStore = useListeningStore()

const listItems = ref<ListItem[]>([])

const initializeList = () => {
    const existingItems = props.component.config.items || []
    
    if (existingItems.length > 0) {
        listItems.value = existingItems.map((item: any) => ({
            type: item.type || 'text',
            text: item.text || '',
            label: item.label || '',
            beforeText: item.beforeText || '',
            afterText: item.afterText || '',
            placeholder: item.placeholder || '___________',
            correctAnswer: item.correctAnswer || '',
            maxWords: item.maxWords || 2,
            questionNumber: item.questionNumber || 1
        }))
    } else {
        // Default: 3 text items
        listItems.value = [
            { type: 'text', text: 'First point' },
            { type: 'text', text: 'Second point' },
            { type: 'text', text: 'Third point' }
        ]
    }
}

onMounted(() => {
    initializeList()
})

const getBulletSymbol = (style: string): string => {
    const symbols: Record<string, string> = {
        disc: '•',
        circle: '○',
        square: '▪',
        dash: '-'
    }
    return symbols[style] || '•'
}

const getItemTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        text: 'Text',
        input: 'Input',
        text_input: 'Text + Input',
        sub_bullet: 'Sub-bullet'
    }
    return labels[type] || type
}

const addListItem = () => {
    listItems.value.push({
        type: 'text',
        text: '',
        placeholder: '___________',
        correctAnswer: '',
        maxWords: 2,
        questionNumber: 1
    })
    saveListData()
}

const removeItem = (index: number) => {
    listItems.value.splice(index, 1)
    saveListData()
}

const moveItemUp = (index: number) => {
    if (index > 0) {
        const temp = listItems.value[index]
        listItems.value[index] = listItems.value[index - 1]
        listItems.value[index - 1] = temp
        saveListData()
    }
}

const moveItemDown = (index: number) => {
    if (index < listItems.value.length - 1) {
        const temp = listItems.value[index]
        listItems.value[index] = listItems.value[index + 1]
        listItems.value[index + 1] = temp
        saveListData()
    }
}

const updateItemType = (index: number, type: string) => {
    listItems.value[index].type = type as any
    saveListData()
}

const updateItemField = (index: number, field: keyof ListItem, value: any) => {
    (listItems.value[index] as any)[field] = value
    saveListData()
}

const updateTitle = (value: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        title: value
    })
}

const updateBulletStyle = (value: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        bulletStyle: value
    })
}

const saveListData = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        items: listItems.value
    })
}

const resetList = () => {
    listeningStore.updateComponent(props.component.id, {
        bulletStyle: 'disc',
        title: '',
        items: []
    })
    initializeList()
}
</script>