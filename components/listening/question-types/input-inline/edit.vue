<!-- components/listening/question-types/input-inline/EditInputInlineMultiple.vue -->
<template>
    <div class="space-y-3">
        <!-- Full Text with Blanks -->
        <UFormGroup label="Text with Blanks" size="lg">
            <UTextarea :model-value="component.config.text" @update:model-value="updateText"
                placeholder="Enter text with ___ for each blank. Press Enter for new lines..." :rows="6" size="lg" />
            <template #hint>
                    <UPopover :popper="{ placement: 'right' }">
                        <UButton icon="i-heroicons-information-circle" size="sm" variant="soft" color="gray">Formatting Guide</UButton>
                        <template #panel>
                            <ul class="ml-6 space-y-1 list-disc p-3">
                                <li>Use <code class="bg-gray-200 px-1 rounded">___</code> to mark blank positions</li>
                                <li>Press <kbd class="bg-gray-200 px-2 py-0.5 rounded border">Enter</kbd> for line
                                    breaks</li>
                            </ul>
                        </template>
                    </UPopover>
            </template>
        </UFormGroup>

        <!-- Live Preview -->
        <div class="border-2 border-dashed border-purple-200 rounded-lg p-4 bg-purple-50">
            <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-semibold text-purple-900 flex items-center gap-2">
                    <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                    Live Preview
                </label>
                <UBadge color="purple" variant="soft" size="xs">
                    Updates in real-time
                </UBadge>
            </div>
            <div v-html="renderLivePreview" class="text-base leading-relaxed"></div>
        </div>

        <!-- Blanks Configuration -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Blanks Configuration</label>
                <UButton icon="i-heroicons-arrow-path" size="xs" variant="soft" color="purple"
                    @click="syncBlanksWithText">
                    Sync with Text
                </UButton>
            </div>

            <div v-for="(blank, idx) in blanks" :key="blank.id"
                class="grid grid-cols-12 gap-2 items-end p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                <!-- Question Number -->
                <UFormGroup label="Q#" size="md" class="col-span-2">
                    <UInput type="number" :model-value="blank.questionNumber"
                        @update:model-value="updateBlankField(idx, 'questionNumber', parseInt($event))" size="sm"
                        icon="i-heroicons-hashtag" />
                </UFormGroup>

                <!-- Correct Answer -->
                <UFormGroup label="Correct Answer" size="md" class="col-span-8">
                    <UInput :model-value="blank.correctAnswer"
                        @update:model-value="updateBlankField(idx, 'correctAnswer', $event)"
                        placeholder="Enter correct answer..." icon="i-heroicons-check-circle"
                        :color="blank.correctAnswer ? 'green' : 'gray'" size="sm" />
                </UFormGroup>

                <!-- Alternative Answers Popover -->
                <div class="col-span-2 flex justify-end">
                    <UPopover :popper="{ placement: 'left' }">
                        <UButton icon="i-heroicons-plus-circle" size="md" color="gray"
                            :ui="{ rounded: 'rounded-full' }">
                            <template #trailing>
                                <UBadge v-if="(blank.alternativeAnswers || []).length > 0" color="purple"
                                    variant="solid" size="md">
                                    {{ (blank.alternativeAnswers || []).length }}
                                </UBadge>
                            </template>
                        </UButton>

                        <template #panel>
                            <div class="p-4 w-72 space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-semibold text-gray-700">
                                        Alternative Answers
                                    </label>
                                    <UBadge color="gray" variant="soft" size="xs">
                                        Optional
                                    </UBadge>
                                </div>

                                <div v-if="(blank.alternativeAnswers || []).length === 0"
                                    class="text-center py-4 text-gray-500 text-sm">
                                    <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p>No alternatives added yet</p>
                                </div>

                                <div v-for="(alt, altIdx) in (blank.alternativeAnswers || [])" :key="altIdx"
                                    class="flex gap-2">
                                    <UInput :model-value="alt"
                                        @update:model-value="updateAlternativeAnswer(idx, altIdx, $event)" size="sm"
                                        placeholder="Alternative answer..." icon="i-heroicons-arrows-right-left"
                                        class="flex-1" />
                                    <UButton icon="i-heroicons-trash" size="sm" color="red" variant="soft"
                                        @click="removeAlternativeAnswer(idx, altIdx)" />
                                </div>

                                <UButton icon="i-heroicons-plus" size="sm" block variant="outline"
                                    @click="addAlternativeAnswer(idx)">
                                    Add Alternative Answer
                                </UButton>
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>

            <!-- Warning Alert -->
            <UAlert v-if="blanks.length !== detectedBlanksCount" icon="i-heroicons-exclamation-triangle" color="amber"
                variant="soft"
                :title="`Mismatch detected: ${detectedBlanksCount} blanks in text but ${blanks.length} configured`"
                :description="`Click 'Sync with Text' button to fix this automatically.`" />

            <!-- Success Alert -->
            <UAlert v-else-if="blanks.length > 0 && allBlanksConfigured" icon="i-heroicons-check-circle" color="green"
                variant="soft" :title="`All ${blanks.length} blanks are properly configured!`" />
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

// Check if all blanks have correct answers
const allBlanksConfigured = computed(() => {
    return blanks.value.every((blank: any) =>
        blank.questionNumber && blank.correctAnswer && blank.correctAnswer.trim() !== ''
    )
})

// Live Preview Render (same as PreviewInputInlineMultiple)
const renderLivePreview = computed(() => {
    let text = props.component.config.text || ''
    const currentBlanks = blanks.value

    // Step 1: Process optional paragraph breaks
    text = text.replace(/\[p\]/g, '</p><p class="mt-4">')

    // Step 2: Escape HTML
    text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    // Step 3: Convert newlines to <br>
    text = text.replace(/\n/g, '<br>')

    // Step 4: Replace blanks with visual representation
    let blankIndex = 0
    text = text.replace(/___/g, () => {
        if (blankIndex < currentBlanks.length) {
            const blank = currentBlanks[blankIndex]
            blankIndex++
            return `<span class="inline-flex items-baseline gap-1 mx-1 px-2 py-1 bg-white border-2 border-purple-300 rounded">
                <span class="text-xs font-bold text-purple-600">${blank.questionNumber || '?'}</span>
                <span class="text-gray-400 italic text-sm">_________</span>
            </span>`
        }
        return '<span class="text-red-500 font-bold">___</span>'
    })

    return `<p class="text-gray-800">${text}</p>`
})

// Update text and auto-sync blanks if needed
const updateText = (newText: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        text: newText
    })

    // Auto-sync if blank count changed significantly
    const newBlankCount = (newText.match(/___/g) || []).length
    if (Math.abs(newBlankCount - blanks.value.length) > 2) {
        // Auto-sync only if difference is significant
        syncBlanksWithText()
    }
}

// Sync blanks array with detected blanks in text
const syncBlanksWithText = () => {
    const blankCount = detectedBlanksCount.value
    const currentBlanks = [...blanks.value]

    if (blankCount > currentBlanks.length) {
        // Add new blanks
        const lastQuestionNumber = currentBlanks.length > 0
            ? currentBlanks[currentBlanks.length - 1].questionNumber
            : (props.component.config.questionNumber || 1) - 1

        for (let i = currentBlanks.length; i < blankCount; i++) {
            currentBlanks.push({
                id: Date.now() + i, // Unique ID
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
const updateBlankField = (index: number | string, field: string, value: any) => {
    blanks.value[index][field] = value
    saveBlanks()
}

// Alternative answers management
const addAlternativeAnswer = (blankIndex: number | string) => {
    if (!blanks.value[blankIndex].alternativeAnswers) {
        blanks.value[blankIndex].alternativeAnswers = []
    }
    blanks.value[blankIndex].alternativeAnswers.push('')
    saveBlanks()
}

const updateAlternativeAnswer = (blankIndex: number | string, altIndex: number | string, value: string) => {
    blanks.value[blankIndex].alternativeAnswers[altIndex] = value
    saveBlanks()
}

const removeAlternativeAnswer = (blankIndex: number | string, altIndex: number | string) => {
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

// Auto-sync on mount if needed
onMounted(() => {
    const textBlankCount = detectedBlanksCount.value
    if (textBlankCount > 0 && blanks.value.length === 0) {
        syncBlanksWithText()
    }
})
</script>

<style scoped>
code,
kbd {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}

kbd {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>