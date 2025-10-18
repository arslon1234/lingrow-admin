<template>
    <div>
        <h2 class="font-bold mb-4">Question layout</h2>
        <div v-if="components.length === 0" class="text-center py-12 text-gray-400">
            <p>No components added yet.</p>
            <p class="text-sm">Select components from the left panel to start building your question.</p>
        </div>
        <!-- Edit Mode -->
        <div v-else class="space-y-3">
            <div v-for="component in components" :key="component.id" class="border rounded-lg p-4 bg-white mb-3">
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex flex-col gap-1">
                        <button @click="listeningStore.moveComponent(component.id, 'up')" class="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="9" cy="12" r="1" />
                                <circle cx="9" cy="5" r="1" />
                                <circle cx="9" cy="19" r="1" />
                                <circle cx="15" cy="12" r="1" />
                                <circle cx="15" cy="5" r="1" />
                                <circle cx="15" cy="19" r="1" />
                            </svg>
                        </button>
                    </div>
                    <span class="font-semibold text-sm text-blue-600 flex-1">{{ component.type }}</span>
                    <button @click="listeningStore.deleteComponent(component.id)" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>

                <!-- HEADER -->
                <div v-if="component.type === 'HEADER'" class="space-y-2">
                    <input type="text" :value="component.config.text"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, text: ($event.target as HTMLInputElement).value })"
                        class="w-full border rounded px-3 py-2" placeholder="Header text" />
                    <select :value="component.config.level"
                        @change="listeningStore.updateComponent(component.id, { ...component.config, level: parseInt(($event.target as HTMLSelectElement).value) })"
                        class="border rounded px-3 py-2">
                        <option :value="1">H1</option>
                        <option :value="2">H2</option>
                        <option :value="3">H3</option>
                        <option :value="4">H4</option>
                    </select>
                </div>

                <!-- SUBHEADER, TEXT_LINE, PARAGRAPH -->
                <textarea
                    v-else-if="component.type === 'SUBHEADER' || component.type === 'TEXT_LINE' || component.type === 'PARAGRAPH'"
                    :value="component.config.text"
                    @input="listeningStore.updateComponent(component.id, { ...component.config, text: ($event.target as HTMLTextAreaElement).value })"
                    class="w-full border rounded px-3 py-2" placeholder="Enter text..."
                    :rows="component.type === 'PARAGRAPH' ? 4 : 2" />

                <!-- INPUT_LINE -->
                <div v-else-if="component.type === 'INPUT_LINE'" class="space-y-2">
                    <input type="text" :value="component.config.label"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, label: ($event.target as HTMLInputElement).value })"
                        class="w-full border rounded px-3 py-2" placeholder="Question label" />
                    <input type="text" :value="component.config.placeholder"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, placeholder: ($event.target as HTMLInputElement).value })"
                        class="w-full border rounded px-3 py-2 text-sm" placeholder="Input placeholder" />
                </div>

                <!-- INPUT_INLINE -->
                <div v-else-if="component.type === 'INPUT_INLINE'" class="space-y-2">
                    <input type="text" :value="component.config.beforeText"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, beforeText: ($event.target as HTMLInputElement).value })"
                        class="w-full border rounded px-3 py-2" placeholder="Text before blank" />
                    <input type="text" :value="component.config.afterText"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, afterText: ($event.target as HTMLInputElement).value })"
                        class="w-full border rounded px-3 py-2" placeholder="Text after blank" />
                </div>

                <!-- MCQ_OPTIONS -->
                <div v-else-if="component.type === 'MCQ_OPTIONS'" class="space-y-2">
                    <div v-for="(option, idx) in component.config.options" :key="idx" class="flex gap-2">
                        <input type="text" :value="option"
                            @input="listeningStore.updateOption(component.id, idx, ($event.target as HTMLInputElement).value)"
                            class="flex-1 border rounded px-3 py-2" :placeholder="`Option ${idx + 1}`" />
                    </div>
                    <button @click="listeningStore.addOption(component.id)" class="text-blue-600 text-sm">
                        + Add Option
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
const listeningStore = useListeningStore()
const { components } = storeToRefs(listeningStore)

</script>

<style lang="scss" scoped></style>