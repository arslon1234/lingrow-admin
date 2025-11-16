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
                <UFormGroup label="Header Text" size="sm">
                    <UInput :model-value="component.config.text"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, text: $event })"
                        placeholder="Enter header text" size="md" />
                </UFormGroup>
            </div>

            <!-- SUBHEADER, TEXT_LINE, PARAGRAPH -->
            <div v-else-if="component.type === 'SUBHEADER' || component.type === 'TEXT_LINE' || component.type === 'PARAGRAPH'"
                class="space-y-2">
                <UFormGroup
                    :label="component.type === 'SUBHEADER' ? 'Subheader Text' : component.type === 'PARAGRAPH' ? 'Paragraph Text' : 'Text Line'"
                    size="md">
                    <UTextarea :model-value="component.config.text"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, text: $event })"
                        placeholder="Enter text..." :rows="2" size="md" />
                </UFormGroup>
            </div>

            <!-- INSTRUCTION_BOX -->
            <div v-else-if="component.type === 'INSTRUCTION_BOX'" class="space-y-2">
                <UFormGroup label="Instructions" size="md">
                    <UTextarea :model-value="component.config.text"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, text: $event })"
                        placeholder="Write NO MORE THAN TWO WORDS for each answer..." :rows="2" size="sm" />
                </UFormGroup>
            </div>

            <!-- INPUT_LINE -->
            <div v-else-if="component.type === 'INPUT_LINE'" class="space-y-3">
                <UFormGroup label="Question Label" size="sm">
                    <UInput :model-value="component.config.label"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, label: $event })"
                        placeholder="Question 1 or Name:" size="sm" />
                </UFormGroup>

                <UFormGroup label="Input Placeholder" size="sm">
                    <UInput :model-value="component.config.placeholder"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, placeholder: $event })"
                        placeholder="Answer or ___________" size="sm" />
                </UFormGroup>

                <UFormGroup label="Correct Answer" size="sm">
                    <UInput :model-value="component.config.correctAnswer"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, correctAnswer: $event })"
                        placeholder="Enter correct answer" icon="i-heroicons-check-circle" color="green" size="sm" />
                </UFormGroup>
            </div>

            <!-- INPUT_INLINE -->
            <div v-else-if="component.type === 'INPUT_INLINE'" class="space-y-3">
                <UFormGroup label="Text Before Blank" size="sm">
                    <UInput :model-value="component.config.beforeText"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, beforeText: $event })"
                        placeholder="Text before blank" size="sm" />
                </UFormGroup>

                <UFormGroup label="Text After Blank" size="sm">
                    <UInput :model-value="component.config.afterText"
                        @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, afterText: $event })"
                        placeholder="Text after blank" size="sm" />
                </UFormGroup>

                <div class="grid grid-cols-6 gap-3">
                    <UFormGroup label="Question #" size="sm">
                        <UInput type="number" :model-value="component.config.questionNumber"
                            @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, questionNumber: parseInt($event) })"
                            placeholder="1" size="sm" />
                    </UFormGroup>

                    <UFormGroup label="Correct Answer" size="sm" class="col-span-5">
                        <UInput :model-value="component.config.correctAnswer"
                            @update:model-value="listeningStore.updateComponent(component.id, { ...component.config, correctAnswer: $event })"
                            placeholder="Enter correct answer" icon="i-heroicons-check-circle" color="green"
                            size="sm" />
                    </UFormGroup>
                </div>
            </div>

            <!-- MCQ_OPTIONS -->
            <MCQ v-else-if="component.type === 'MCQ_OPTIONS'" :component="component" />

            <!-- TABLE -->
            <Table v-else-if="component.type === 'TABLE_GRID'" :component="component" />

            <!-- IMAGE Edit Mode -->
            <Images v-else-if="component.type === 'IMAGE'" :component="component" />

            <!-- NUMBERED_LIST -->
            <NumberedList v-else-if="component.type === 'NUMBERED_LIST'" :component="component" />

            <!-- NUMBERED_LIST -->
            <BulletList v-else-if="component.type === 'BULLET_LIST'" :component="component" />

            <!-- MAP -->
            <edit-map v-else-if="component.type === 'MAP'" :component="component" />

            <!-- MATCHING -->
            <edit-matching v-else-if="component.type === 'MATCHING'" :component="component" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
import DeleteIcon from '~/components/icons/DeleteIcon.vue';
import UpIcon from '~/components/icons/UpIcon.vue';
import DownIcon from '~/components/icons/DownIcon.vue';
import Images from './question-types/image/EditImage.vue';
import MCQ from './question-types/mcq/EditMCQ.vue';
import Table from './question-types/table/EditTable.vue';
import NumberedList from './question-types/numbered-list/EditNumberedList.vue';
import BulletList from './question-types/bullet-list/EditBulletList.vue';
import EditMap from './question-types/map/EditMap.vue';
import EditMatching from './question-types/matching/edit.vue'

const listeningStore = useListeningStore()

defineProps(['components'])

</script>

<style lang="scss" scoped></style>