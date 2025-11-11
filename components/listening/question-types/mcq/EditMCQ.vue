<template>
    <div class="space-y-4">
        <!-- Question Text Section -->
        <div class="space-y-2">
            <label class="block text-sm font-medium mb-2">Question Text</label>
            <div class="flex gap-2 items-center">
                <UFormGroup label="Q#" size="sm" class="w-20">
                    <UInput type="number" :model-value="component.config.questionNumber"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, questionNumber: parseInt($event) })"
                        placeholder="1" size="sm" />
                </UFormGroup>

                <UFormGroup label="Question" size="sm" class="flex-1">
                    <UInput :model-value="component.config.questionText || ''"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, questionText: $event })"
                        placeholder="Enter the question text here..." size="sm" />
                </UFormGroup>
            </div>
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
                <UInput :model-value="option"
                    @update:model-value="listeningStore.updateOption(component.id, idx, $event)"
                    :placeholder="`Option ${String.fromCharCode(65 + idx)}`" size="sm" class="flex-1" />

                <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs"
                    @click="listeningStore.removeOption(component.id, idx)"
                    :disabled="component.config.options.length <= 2" />
            </div>

            <UAlert v-if="component.config.options.length < 2" icon="i-heroicons-information-circle" color="amber"
                variant="soft" size="xs" title="Minimum 2 options required" />
        </div>

        <UDivider />

        <!-- Correct Answer Section -->
        <div class="space-y-3">
            <label class="block text-sm font-medium">Correct Answer</label>

            <!-- Single Select -->
            <div v-if="!component.config.multiSelect">
                <USelectMenu :model-value="component.config.correctAnswer || ''"
                    @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, correctAnswer: $event })"
                    :options="component.config.options.map((opt: string, idx: number) => ({
                        label: opt || `Option ${String.fromCharCode(65 + idx)}`,
                        value: opt
                    }))" value-attribute="value" option-attribute="label" placeholder="Select correct answer"
                    size="sm">
                    <template #label>
                        <span v-if="component.config.correctAnswer" class="flex items-center gap-2">
                            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                            {{ component.config.correctAnswer }}
                        </span>
                        <span v-else class="text-gray-400">Select correct answer</span>
                    </template>
                </USelectMenu>
            </div>

        </div>

        <UDivider />
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

const listeningStore = useListeningStore()
const props = defineProps(['component'])

</script>

<style scoped>
/* Custom styles if needed */
</style>