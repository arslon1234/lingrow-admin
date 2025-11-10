<template>
    <div class="space-y-3">
        <!-- List Title/Instruction -->
        <UFormGroup label="List Title (Optional)" size="sm">
            <UInput 
                :model-value="component.config.title || ''"
                @update:model-value="updateTitle"
                placeholder="Questions 1-5 or section title..."
                size="sm"
            />
        </UFormGroup>

        <UDivider />

        <!-- Starting Question Number -->
        <div class="flex gap-3 items-end">
            <UFormGroup label="Starting Question Number" size="sm" class="w-32">
                <UInput 
                    type="number" 
                    :model-value="component.config.startNumber || 1"
                    @update:model-value="updateStartNumber"
                    :min="1"
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
                        <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {{ (component.config.startNumber || 1) + index }}.
                        </span>
                        <UBadge 
                            :color="item.type === 'input' ? 'green' : 'blue'" 
                            variant="soft"
                            size="xs"
                        >
                            {{ item.type === 'input' ? 'Input Field' : 'Text Only' }}
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

                <!-- Item Type Toggle -->
                <div class="mb-3">
                    <USelectMenu
                        :model-value="item.type"
                        @update:model-value="updateItemType(index, $event)"
                        :options="[
                            { label: 'Input Field (Answer blank)', value: 'input' },
                            { label: 'Text Only', value: 'text' },
                            { label: 'Text with Input', value: 'text_input' }
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
                            placeholder="Enter list item text..."
                            :rows="2"
                            size="sm"
                        />
                    </UFormGroup>
                </div>

                <!-- INPUT FIELD -->
                <div v-else-if="item.type === 'input'" class="space-y-3">
                    <UFormGroup label="Question Label (optional)" size="sm">
                        <UInput
                            :model-value="item.label"
                            @update:model-value="updateItemField(index, 'label', $event)"
                            placeholder="Name: or Location: (optional)"
                            size="sm"
                        />
                    </UFormGroup>

                    <div class="grid grid-cols-2 gap-3">
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

                <!-- TEXT WITH INPUT -->
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

                    <div class="grid grid-cols-2 gap-3">
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
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

interface ListItem {
    type: 'input' | 'text' | 'text_input'
    text?: string
    label?: string
    beforeText?: string
    afterText?: string
    placeholder?: string
    correctAnswer?: string
    maxWords?: number
}

const props = defineProps(['component'])
const listeningStore = useListeningStore()

const listItems = ref<ListItem[]>([])

const initializeList = () => {
    const existingItems = props.component.config.items || []
    console.log(existingItems, 'existingItems')
    if (existingItems.length > 0) {
        listItems.value = existingItems.map((item: any) => ({
            type: item.type || 'input',
            text: item.text || '',
            label: item.label || '',
            beforeText: item.beforeText || '',
            afterText: item.afterText || '',
            placeholder: item.placeholder || '___________',
            correctAnswer: item.correctAnswer || '',
            maxWords: item.maxWords || 2
        }))
    } else {
        // Default: 3 input items
        listItems.value = [
            {
                type: 'input',
                label: '',
                placeholder: '___________',
                correctAnswer: '',
                maxWords: 2
            },
            {
                type: 'input',
                label: '',
                placeholder: '___________',
                correctAnswer: '',
                maxWords: 2
            },
            {
                type: 'input',
                label: '',
                placeholder: '___________',
                correctAnswer: '',
                maxWords: 2
            }
        ]
    }
}

onMounted(() => {
    initializeList()
})

const addListItem = () => {
    listItems.value.push({
        type: 'input',
        label: '',
        placeholder: '___________',
        correctAnswer: '',
        maxWords: 2
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

const updateStartNumber = (value: string) => {
    const numValue = parseInt(value) || 1
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        startNumber: numValue
    })
}

const saveListData = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        items: listItems.value
    })
}

</script>

<style scoped>
/* Custom styles if needed */
</style>