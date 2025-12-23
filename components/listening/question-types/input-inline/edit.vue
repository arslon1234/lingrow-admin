<!-- components/listening/question-types/input-inline/EditInputInlineMultiple.vue -->
<template>
    <div class="space-y-3">
        <!-- Full Text with Blanks -->
        <UFormGroup label="Text with Blanks (use ___ for blank positions)" size="sm">
            <UTextarea 
                :model-value="component.config.text"
                @update:model-value="updateText"
                placeholder="Enter text with ___ for each blank..."
                :rows="4"
                size="lg" 
            />
            <template #hint>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <UIcon name="i-heroicons-information-circle" />
                    <span>Use ___ to mark blank positions. Detected blanks: {{ detectedBlanksCount }}</span>
                </div>
            </template>
        </UFormGroup>

        <!-- Blanks Configuration -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium">Blanks Configuration</label>
                <UButton 
                    icon="i-heroicons-arrow-path" 
                    size="xs" 
                    variant="ghost"
                    @click="syncBlanksWithText">
                    Sync with Text
                </UButton>
            </div>

            <div v-for="(blank, idx) in blanks" :key="blank.id" 
                class="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                
                <!-- Blank Number -->
                <div class="col-span-1 text-center">
                    <span class="text-sm font-bold text-purple-600">{{ idx + 1 }}</span>
                </div>

                <!-- Question Number -->
                <UFormGroup label="Q#" size="xs" class="col-span-2">
                    <UInput 
                        type="number"
                        :model-value="blank.questionNumber"
                        @update:model-value="updateBlankField(idx, 'questionNumber', parseInt($event))"
                        size="xs"
                    />
                </UFormGroup>

                <!-- Correct Answer -->
                <UFormGroup label="Correct Answer" size="xs" class="col-span-7">
                    <UInput 
                        :model-value="blank.correctAnswer"
                        @update:model-value="updateBlankField(idx, 'correctAnswer', $event)"
                        placeholder="Enter correct answer..."
                        icon="i-heroicons-check-circle"
                        color="green"
                        size="xs"
                    />
                </UFormGroup>

                <!-- Alternative Answers (optional) -->
                <UPopover class="col-span-2">
                    <UButton 
                        icon="i-heroicons-plus-circle" 
                        size="xs" 
                        variant="ghost"
                        color="gray">
                        Alt
                    </UButton>
                    
                    <template #panel>
                        <div class="p-3 w-64">
                            <label class="text-xs font-medium mb-2 block">Alternative Answers</label>
                            <div v-for="(alt, altIdx) in (blank.alternativeAnswers || [])" :key="altIdx" 
                                class="flex gap-1 mb-2">
                                <UInput 
                                    :model-value="alt"
                                    @update:model-value="updateAlternativeAnswer(idx, altIdx, $event)"
                                    size="xs"
                                    placeholder="Alternative..."
                                />
                                <UButton 
                                    icon="i-heroicons-trash" 
                                    size="xs" 
                                    color="red" 
                                    variant="ghost"
                                    @click="removeAlternativeAnswer(idx, altIdx)"
                                />
                            </div>
                            <UButton 
                                icon="i-heroicons-plus" 
                                size="xs" 
                                block
                                @click="addAlternativeAnswer(idx)">
                                Add Alternative
                            </UButton>
                        </div>
                    </template>
                </UPopover>
            </div>

            <!-- Warning if blanks don't match -->
            <UAlert 
                v-if="blanks.length !== detectedBlanksCount"
                icon="i-heroicons-exclamation-triangle"
                color="amber"
                variant="soft"
                size="xs"
                :title="`Warning: Found ${detectedBlanksCount} blanks in text but have ${blanks.length} configured`"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

const listeningStore = useListeningStore()
const props = defineProps(['component'])

const blanks = ref(props.component.config.blanks || [])

// Count ___ in text
const detectedBlanksCount = computed(() => {
    const text = props.component.config.text || ''
    return (text.match(/___/g) || []).length
})

// Update text and auto-sync blanks if needed
const updateText = (newText: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        text: newText
    })
    
    // Auto-sync if blank count changed
    const newBlankCount = (newText.match(/___/g) || []).length
    if (newBlankCount !== blanks.value.length) {
        syncBlanksWithText()
    }
}

// Sync blanks array with detected blanks in text
const syncBlanksWithText = () => {
    const blankCount = detectedBlanksCount.value
    const currentBlanks = blanks.value
    
    // Add or remove blanks to match
    if (blankCount > currentBlanks.length) {
        // Add new blanks
        const lastQuestionNumber = currentBlanks.length > 0 
            ? currentBlanks[currentBlanks.length - 1].questionNumber 
            : 1
        
        for (let i = currentBlanks.length; i < blankCount; i++) {
            currentBlanks.push({
                id: i + 1,
                questionNumber: lastQuestionNumber + (i - currentBlanks.length + 1),
                correctAnswer: '',
                alternativeAnswers: [],
                placeholder: '___'
            })
        }
    } else if (blankCount < currentBlanks.length) {
        // Remove extra blanks
        currentBlanks.splice(blankCount)
    }
    
    blanks.value = currentBlanks
    saveBlanks()
}

// Update single blank field
const updateBlankField = (index: number, field: string, value: any) => {
    blanks.value[index][field] = value
    saveBlanks()
}

// Alternative answers management
const addAlternativeAnswer = (blankIndex: number) => {
    if (!blanks.value[blankIndex].alternativeAnswers) {
        blanks.value[blankIndex].alternativeAnswers = []
    }
    blanks.value[blankIndex].alternativeAnswers.push('')
    saveBlanks()
}

const updateAlternativeAnswer = (blankIndex: number, altIndex: number, value: string) => {
    blanks.value[blankIndex].alternativeAnswers[altIndex] = value
    saveBlanks()
}

const removeAlternativeAnswer = (blankIndex: number, altIndex: number) => {
    blanks.value[blankIndex].alternativeAnswers.splice(altIndex, 1)
    saveBlanks()
}

// Save to store
const saveBlanks = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        blanks: blanks.value
    })
}

// Watch for external changes
watch(() => props.component.config.blanks, (newBlanks) => {
    if (newBlanks) {
        blanks.value = newBlanks
    }
}, { deep: true })
</script>