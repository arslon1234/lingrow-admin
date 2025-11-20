<template>
    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p class="text-xs font-medium text-gray-500 mb-3">Preview</p>
        
        <div class="space-y-3">
            <!-- Single Answer Format -->
            <div v-if="!component.config.multiSelect">
                <p v-if="component.config.questionText" class="font-medium text-base mb-3">
                    {{ component.config.questionNumber }}. {{ component.config.questionText }}
                </p>
                
                <div class="space-y-2">
                    <label 
                        v-for="(option, idx) in component.config.options" 
                        :key="`preview-${idx}`"
                        class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                        :class="{ 'bg-green-50 dark:bg-green-900/20': selectedAnswer === option }">
                        <input 
                            type="radio"
                            :name="`preview-mcq-${component.id}`"
                            :value="option"
                            v-model="selectedAnswer"
                            class="cursor-pointer w-4 h-4" />
                        <span class="flex-1">{{ String.fromCharCode(65 + idx) }}) {{ option }}</span>
                        <UBadge v-if="isCorrectAnswer(option)" color="green" variant="soft" size="xs">
                            ✓ Correct
                        </UBadge>
                    </label>
                </div>
            </div>

            <!-- Multiple Answer Format -->
            <div v-else>
                <!-- Question Range Header -->
                <div class="mb-3">
                    <p class="font-semibold text-base text-gray-700 dark:text-gray-300">
                        Questions {{ component.config.questionNumber }}-{{ component.config.questionNumberEnd || component.config.questionNumber }}
                    </p>
                    <p v-if="component.config.questionText" class="text-gray-800 dark:text-gray-200 mt-1">
                        {{ component.config.questionText }}
                    </p>
                </div>

                <!-- Instruction -->
                <div class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">
                        Choose {{ getExpectedAnswersCount() }} letter{{ getExpectedAnswersCount() > 1 ? 's' : '' }}, 
                        {{ getOptionLettersRange() }}
                    </p>
                </div>

                <!-- Options with Checkboxes -->
                <div class="space-y-2">
                    <label 
                        v-for="(option, idx) in component.config.options" 
                        :key="`preview-${idx}`"
                        class="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                        :class="{ 
                            'bg-green-50 dark:bg-green-900/20': selectedAnswers.includes(option),
                            'opacity-50 cursor-not-allowed': isDisabled(option)
                        }">
                        <input 
                            type="checkbox"
                            :value="option"
                            v-model="selectedAnswers"
                            :disabled="isDisabled(option)"
                            class="cursor-pointer w-4 h-4"
                            :class="{
                                'accent-green-600': selectedAnswers.includes(option),
                                'accent-blue-600': !selectedAnswers.includes(option)
                            }" />
                        <span class="flex-1">
                            <span class="font-medium">{{ String.fromCharCode(65 + idx) }})</span>
                            {{ option }}
                        </span>
                        <UBadge v-if="isCorrectAnswer(option)" color="green" variant="soft" size="xs">
                            ✓ Correct
                        </UBadge>
                    </label>
                </div>

                <!-- Selection Counter -->
                <div class="mt-3 p-2 rounded-lg" :class="{
                    'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': selectedAnswers.length === getExpectedAnswersCount(),
                    'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800': selectedAnswers.length > 0 && selectedAnswers.length !== getExpectedAnswersCount(),
                    'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700': selectedAnswers.length === 0
                }">
                    <p class="text-xs font-medium" :class="{
                        'text-green-700 dark:text-green-300': selectedAnswers.length === getExpectedAnswersCount(),
                        'text-amber-700 dark:text-amber-300': selectedAnswers.length > 0 && selectedAnswers.length !== getExpectedAnswersCount(),
                        'text-gray-600 dark:text-gray-400': selectedAnswers.length === 0
                    }">
                        Selected: {{ selectedAnswers.length }} / {{ getExpectedAnswersCount() }}
                        <span v-if="selectedAnswers.length === getExpectedAnswersCount()"> ✓</span>
                        <span v-else-if="selectedAnswers.length > getExpectedAnswersCount()"> (Too many)</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps(['component'])

// Single answer state
const selectedAnswer = ref<string>('')

// Multiple answers state
const selectedAnswers = ref<string[]>([])

// Reset selections when component changes
watch(() => props.component.config.multiSelect, (newVal) => {
    selectedAnswer.value = ''
    selectedAnswers.value = []
})

const isCorrectAnswer = (option: string): boolean => {
    if (props.component.config.multiSelect) {
        return Array.isArray(props.component.config.correctAnswer) &&
            props.component.config.correctAnswer.includes(option)
    }
    return props.component.config.correctAnswer === option
}

const getExpectedAnswersCount = (): number => {
    if (!props.component.config.multiSelect) return 1
    const start = props.component.config.questionNumber || 1
    const end = props.component.config.questionNumberEnd || start
    return Math.max(1, end - start + 1)
}

const getOptionLettersRange = (): string => {
    const optionsCount = props.component.config.options?.length || 0
    if (optionsCount === 0) return 'A-A'
    const lastLetter = String.fromCharCode(64 + optionsCount)
    return `A-${lastLetter}`
}

// Disable checkbox if max selections reached and this option is not selected
const isDisabled = (option: string): boolean => {
    if (!props.component.config.multiSelect) return false
    const maxSelections = getExpectedAnswersCount()
    return selectedAnswers.value.length >= maxSelections && !selectedAnswers.value.includes(option)
}
</script>

<style scoped>
/* Smooth transitions */
label {
    transition: all 0.2s ease;
}

/* Custom checkbox styling */
input[type="checkbox"]:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

input[type="radio"],
input[type="checkbox"] {
    cursor: pointer;
}
</style>