<template>
    <div class="space-y-3">
        <div class="grid grid-cols-6 gap-3">
            <UFormGroup label="Question #" size="sm">
                <UInput 
                    type="number" 
                    :model-value="component.config.questionNumber"
                    @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, questionNumber: parseInt($event) || 1 })"
                    placeholder="1" 
                    size="sm" 
                />
            </UFormGroup>

            <UFormGroup label="Question Label" size="sm" class="col-span-5">
                <UInput 
                    :model-value="component.config.label"
                    @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, label: $event })"
                    placeholder="Question 1 or Name:" 
                    size="sm" 
                />
            </UFormGroup>
        </div>

        <UFormGroup label="Input Placeholder" size="sm">
            <UInput 
                :model-value="component.config.placeholder"
                @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, placeholder: $event })"
                placeholder="Answer or ___________" 
                size="sm" 
            />
        </UFormGroup>

        <UFormGroup label="Correct Answers" size="sm">
            <div class="space-y-2">
                <div 
                    v-for="(answer, index) in getCorrectAnswers(component)"
                    :key="index"
                    class="flex gap-2"
                >
                    <UInput 
                        :model-value="answer"
                        @update:model-value="updateAnswer(component.id, index, $event)"
                        placeholder="Enter correct answer" 
                        icon="i-heroicons-check-circle" 
                        color="green" 
                        size="sm"
                        class="flex-1"
                    />
                    <UButton
                        v-if="getCorrectAnswers(component).length > 1"
                        @click="removeAnswer(component.id, index)"
                        color="red"
                        variant="soft"
                        size="sm"
                        icon="i-heroicons-trash"
                        square
                    />
                </div>
                <UButton
                    @click="addAnswer(component.id)"
                    color="primary"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-plus"
                    block
                >
                    Add Answer
                </UButton>
            </div>
        </UFormGroup>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';

const listeningStore = useListeningStore()

interface ComponentConfig {
    questionNumber?: number
    label?: string
    placeholder?: string
    correctAnswer?: string | string[]
    [key: string]: any
}

interface Component {
    id: number  // ✅ string dan number ga o'zgardi
    type: string
    config: ComponentConfig
}

interface Props {
    component: Component
}

const props = defineProps<Props>()

// Helper function to ensure correctAnswer is always an array
const getCorrectAnswers = (component: Component): string[] => {
    const answer = component.config.correctAnswer
    
    // Agar array bo'lsa, o'zini qaytaradi
    if (Array.isArray(answer)) {
        return answer.length > 0 ? answer : ['']
    }
    
    // Agar string bo'lsa, array ga o'tkazadi
    if (typeof answer === 'string') {
        return answer ? [answer] : ['']
    }
    
    // Default: bo'sh array
    return ['']
}

// Helper functions for managing answers array
const updateAnswer = (componentId: number, index: number, value: string) => {  // ✅ string dan number ga
    const component = listeningStore.components.find((c: any) => c.id === componentId)
    if (component) {
        const currentAnswers = getCorrectAnswers(component)
        const newAnswers = [...currentAnswers]
        newAnswers[index] = value
        listeningStore.updateComponent(componentId, { 
            ...component.config, 
            correctAnswer: newAnswers 
        })
    }
}

const addAnswer = (componentId: number) => {  // ✅ string dan number ga
    const component = listeningStore.components.find((c: any) => c.id === componentId)
    if (component) {
        const currentAnswers = getCorrectAnswers(component)
        const newAnswers = [...currentAnswers, '']
        listeningStore.updateComponent(componentId, { 
            ...component.config, 
            correctAnswer: newAnswers 
        })
    }
}

const removeAnswer = (componentId: number, index: number) => {  // ✅ string dan number ga
    const component = listeningStore.components.find((c: any) => c.id === componentId)
    if (component) {
        const currentAnswers = getCorrectAnswers(component)
        if (currentAnswers.length > 1) {
            const newAnswers = currentAnswers.filter((_, i) => i !== index)
            listeningStore.updateComponent(componentId, { 
                ...component.config, 
                correctAnswer: newAnswers 
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>