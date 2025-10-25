<template>
    <div class="space-y-3">
        <div v-for="component in components" :key="component.id" class="border rounded-lg p-3 bg-white mb-3">
            <div class="flex items-center gap-3 mb-3">
                <div class="flex flex-col gap-1">
                    <button @click="listeningStore.moveComponent(component.id, 'up')"
                        class="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        :disabled="components.indexOf(component) === 0">
                        <up-icon />
                    </button>
                    <button @click="listeningStore.moveComponent(component.id, 'down')"
                        class="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        :disabled="components.indexOf(component) === components.length - 1">
                        <down-icon />
                    </button>
                </div>
                <span class="font-semibold text-sm text-purple flex-1">{{ component.type }}</span>
                <button @click="listeningStore.deleteComponent(component.id)" class="text-red-500 hover:text-red-700">
                    <delete-icon />
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
                    <option :value="1">h1</option>
                    <option :value="2">h2</option>
                    <option :value="3">h3</option>
                    <option :value="4">h4</option>
                </select>
            </div>

            <!-- SUBHEADER, TEXT_LINE, PARAGRAPH -->
            <textarea
                v-else-if="component.type === 'SUBHEADER' || component.type === 'TEXT_LINE' || component.type === 'PARAGRAPH'"
                :value="component.config.text"
                @input="listeningStore.updateComponent(component.id, { ...component.config, text: ($event.target as HTMLTextAreaElement).value })"
                class="w-full border rounded px-3 py-2" placeholder="Enter text..." :rows="2" />
            
                <!-- INSTRUCTION_BOX -->
            <div v-else-if="component.type === 'INSTRUCTION_BOX'" class="space-y-2">
                <label class="block text-sm font-medium mb-1">Instructions</label>
                <textarea :value="component.config.text"
                    @input="listeningStore.updateComponent(component.id, { ...component.config, text: ($event.target as HTMLTextAreaElement).value })"
                    class="w-full border rounded px-3 py-2" placeholder="Enter instruction text..." rows="1" />
            </div>

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

                <div class="flex gap-2">
                    <input type="number" :value="component.config.questionNumber"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, questionNumber: parseInt(($event.target as HTMLInputElement).value) })"
                        class="w-20 border rounded px-3 py-2" placeholder="No." min="1" />
                    <input type="text" :value="component.config.correctAnswer"
                        @input="listeningStore.updateComponent(component.id, { ...component.config, correctAnswer: ($event.target as HTMLInputElement).value })"
                        class="flex-1 border rounded px-3 py-2" placeholder="Enter correct answer" />
                </div>
            </div>

            <!-- MCQ_OPTIONS -->
            <div v-else-if="component.type === 'MCQ_OPTIONS'" class="space-y-2">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
import DeleteIcon from '~/components/icons/DeleteIcon.vue';
import UpIcon from '~/components/icons/UpIcon.vue';
import DownIcon from '~/components/icons/DownIcon.vue';

const listeningStore = useListeningStore()
defineProps(['components'])
</script>

<style lang="scss" scoped></style>