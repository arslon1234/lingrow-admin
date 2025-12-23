<template>
    <div class="space-y-4">
        <!-- Question Text Section -->
        <div class="space-y-2">
            <label class="block text-sm font-medium mb-2">Question Text</label>
            <div class="flex gap-2 items-start">
                <!-- Question Number Range -->
                <div class="flex gap-1 items-center">
                    <UFormGroup label="Q#" size="sm" class="w-16">
                        <UInput type="number" :model-value="component.config.questionNumber"
                            @update:model-value="listeningStore.updateComponent(component.id, { 
                                ...component.config, 
                                questionNumber: parseInt($event) 
                            })"
                            placeholder="21" size="md" />
                    </UFormGroup>
                    
                    <span v-if="component.config.multiSelect" class="text-gray-400 mt-6">-</span>
                    
                    <UFormGroup v-if="component.config.multiSelect" label="To" size="sm" class="w-16">
                        <UInput type="number" :model-value="component.config.questionNumberEnd || component.config.questionNumber"
                            @update:model-value="listeningStore.updateComponent(component.id, { 
                                ...component.config, 
                                questionNumberEnd: parseInt($event) 
                            })"
                            placeholder="23" size="md" />
                    </UFormGroup>
                </div>

                <UFormGroup label="Question" size="sm" class="flex-1">
                    <UInput :model-value="component.config.questionText || ''"
                        @update:model-value="listeningStore.updateComponent(component.id, { 
                            ...component.config, 
                            questionText: $event 
                        })"
                        placeholder="Enter the question text here..." 
                        size="md" />
                </UFormGroup>
            </div>
        </div>

        <UDivider />

        <!-- Question Type Toggle -->
        <div class="space-y-2">
            <label class="block text-sm font-medium">Question Type</label>
            <div class="flex gap-3">
                <UButton 
                    :color="!component.config.multiSelect ? 'primary' : 'gray'" 
                    :variant="!component.config.multiSelect ? 'solid' : 'outline'"
                    size="sm"
                    @click="listeningStore.updateComponent(component.id, { 
                        ...component.config, 
                        multiSelect: false,
                        correctAnswer: '',
                        questionNumberEnd: null
                    })">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-1" />
                    Single Answer
                </UButton>
                
                <UButton 
                    :color="component.config.multiSelect ? 'primary' : 'gray'" 
                    :variant="component.config.multiSelect ? 'solid' : 'outline'"
                    size="sm"
                    @click="listeningStore.updateComponent(component.id, { 
                        ...component.config, 
                        multiSelect: true,
                        correctAnswer: [],
                        questionNumberEnd: component.config.questionNumber + 2
                    })">
                    <UIcon name="i-heroicons-check-badge" class="w-4 h-4 mr-1" />
                    Multiple Answers
                </UButton>
            </div>
            <p class="text-xs text-gray-500">
                {{ component.config.multiSelect ? 
                    'Students must select multiple correct answers (e.g., Questions 21-23)' : 
                    'Students select only one correct answer' 
                }}
            </p>
        </div>

        <UDivider />

        <!-- Answer Options -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <label class="block text-sm font-medium">Answer Options</label>
                <UButton icon="i-heroicons-plus-circle" color="primary" variant="ghost" size="xs"
                    @click="listeningStore.addOption(component.id)">
                    Add Option
                </UButton>
            </div>

            <div v-for="(option, idx) in component.config.options" :key="idx" class="flex gap-2 items-center">
                <span class="text-sm font-medium text-gray-500 w-8">
                    {{ String.fromCharCode(65 + idx) }})
                </span>
                
                <UInput :model-value="option"
                    @update:model-value="listeningStore.updateOption(component.id, idx, $event)"
                    :placeholder="`Enter option ${String.fromCharCode(65 + idx)}`" 
                    size="sm" 
                    class="flex-1" />

                <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs"
                    @click="listeningStore.removeOption(component.id, idx)"
                    :disabled="component.config.options.length <= 2" />
            </div>

            <UAlert v-if="component.config.options.length < 2" 
                icon="i-heroicons-information-circle" 
                color="amber"
                variant="soft" 
                size="xs" 
                title="Minimum 2 options required" />
        </div>

        <UDivider />

        <!-- Correct Answer Section -->
        <div class="space-y-3">
            <label class="block text-sm font-medium">
                Correct Answer{{ component.config.multiSelect ? 's' : '' }}
                <span v-if="component.config.multiSelect" class="text-gray-500 text-xs ml-1">
                    (Select {{ getExpectedAnswersCount() }} answer{{ getExpectedAnswersCount() > 1 ? 's' : '' }})
                </span>
            </label>

            <!-- Single Select -->
            <div v-if="!component.config.multiSelect">
                <USelectMenu 
                    :model-value="component.config.correctAnswer || ''"
                    @update:model-value="listeningStore.updateComponent(component.id, { 
                        ...component.config, 
                        correctAnswer: $event 
                    })"
                    :options="component.config.options.map((opt: string, idx: number) => ({
                        label: `${String.fromCharCode(65 + idx)}) ${opt || `Option ${String.fromCharCode(65 + idx)}`}`,
                        value: opt
                    }))" 
                    value-attribute="value" 
                    option-attribute="label" 
                    placeholder="Select correct answer"
                    size="sm">
                    <template #label>
                        <span v-if="component.config.correctAnswer" class="flex items-center gap-2">
                            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                            {{ getOptionLabel(component.config.correctAnswer) }}
                        </span>
                        <span v-else class="text-gray-400">Select correct answer</span>
                    </template>
                </USelectMenu>
            </div>

            <!-- Multiple Select -->
            <div v-else class="space-y-2">
                <div v-for="(option, idx) in component.config.options" :key="`correct-${idx}`"
                    class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    @click="toggleCorrectAnswer(option)">
                    <UCheckbox 
                        :model-value="isAnswerSelected(option)"
                        @update:model-value="toggleCorrectAnswer(option)"
                        :color="isAnswerSelected(option) ? 'green' : 'primary'" />
                    <span class="text-sm">
                        <span class="font-medium">{{ String.fromCharCode(65 + idx) }})</span>
                        {{ option || `Option ${String.fromCharCode(65 + idx)}` }}
                    </span>
                </div>

                <UAlert 
                    v-if="getSelectedAnswersCount() !== getExpectedAnswersCount()"
                    icon="i-heroicons-exclamation-triangle" 
                    color="amber"
                    variant="soft" 
                    size="xs" 
                    :title="`Please select exactly ${getExpectedAnswersCount()} correct answer${getExpectedAnswersCount() > 1 ? 's' : ''}`" />
                
                <UAlert 
                    v-else
                    icon="i-heroicons-check-circle" 
                    color="green"
                    variant="soft" 
                    size="xs" 
                    :title="`${getSelectedAnswersCount()} correct answer${getSelectedAnswersCount() > 1 ? 's' : ''} selected`" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

const listeningStore = useListeningStore()
const props = defineProps(['component'])

const getOptionLabel = (value: string): string => {
    const idx = props.component.config.options.indexOf(value)
    if (idx === -1) return value
    return `${String.fromCharCode(65 + idx)}) ${value}`
}

const isAnswerSelected = (option: string): boolean => {
    if (!Array.isArray(props.component.config.correctAnswer)) return false
    return props.component.config.correctAnswer.includes(option)
}

const toggleCorrectAnswer = (option: string): void => {
    const currentAnswers = Array.isArray(props.component.config.correctAnswer) 
        ? [...props.component.config.correctAnswer] 
        : []
    
    const index = currentAnswers.indexOf(option)
    if (index > -1) {
        currentAnswers.splice(index, 1)
    } else {
        currentAnswers.push(option)
    }
    
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        correctAnswer: currentAnswers
    })
}

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

const getSelectedAnswersCount = (): number => {
    if (!Array.isArray(props.component.config.correctAnswer)) return 0
    return props.component.config.correctAnswer.length
}
</script>

<style scoped>
/* Custom styles if needed */
</style>