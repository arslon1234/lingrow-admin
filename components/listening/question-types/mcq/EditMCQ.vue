<template>
    <div class="space-y-2">
        <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Question Text</label>
                    <div class="flex gap-2 items-start">
                        <input type="number" :value="component.config.questionNumber"
                            @input="listeningStore.updateComponent(component.id, { ...component.config, questionNumber: parseInt(($event.target as HTMLInputElement).value) })"
                            class="w-20 border rounded px-3 py-2" placeholder="No." min="1" />
                        <textarea :value="component.config.questionText || ''"
                            @input="listeningStore.updateComponent(component.id, { ...component.config, questionText: ($event.target as HTMLTextAreaElement).value })"
                            class="flex-1 border rounded px-3 py-2" placeholder="Enter the question text here..."
                            rows="1" />
                    </div>
                </div>

                <!-- Options -->
                <label class="block text-sm font-medium mb-1">Answer Options</label>
                <div v-for="(option, idx) in component.config.options" :key="idx" class="flex gap-2 items-center">
                    <input type="text" :value="option"
                        @input="listeningStore.updateOption(component.id, idx, ($event.target as HTMLInputElement).value)"
                        class="flex-1 border rounded px-3 py-2" :placeholder="`Option ${idx + 1}`" />

                    <button @click="listeningStore.removeOption(component.id, idx)"
                        class="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        :disabled="component.config.options.length <= 2"
                        :class="{ 'opacity-30 cursor-not-allowed': component.config.options.length <= 2 }">
                        <delete-icon />
                    </button>
                </div>

                <button @click="listeningStore.addOption(component.id)"
                    class="text-purple-700 hover:text-purple-800 text-sm">
                    + Add Option
                </button>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
const listeningStore = useListeningStore()

defineProps(['component'])

</script>

<style lang="scss" scoped>

</style>