<template>
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div v-for="component in components" :key="component.id">
            <!-- Header -->
            <component v-if="component.type === 'HEADER'" is="h1" class="font-bold mb-2 text-center">
                {{ component.config.text }}
            </component>

            <!-- Subheader -->
            <h4 v-else-if="component.type === 'SUBHEADER'" is="h2" class="text-gray-700 mb-2 font-semibold">
                {{ component.config.text }}
            </h4>

            <!-- Paragraph or Text Line -->
            <p v-else-if="component.type === 'PARAGRAPH' || component.type === 'TEXT_LINE'" class="mb-2 text-gray-800 text-justify">
                {{ component.config.text }}
            </p>

            <!-- Input Line -->
            <div v-else-if="component.type === 'INPUT_LINE'" class="mb-3">
                <label class="block text-sm font-medium mb-1">{{ component.config.label }}</label>
                <input type="text" :placeholder="component.config.placeholder"
                    class="w-full border rounded px-3 py-2 bg-gray-50" />
            </div>

            <!-- Instruction Box -->
            <div v-else-if="component.type === 'INSTRUCTION_BOX'"
                class="mb-4 p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
                <p class="text-md text-gray-900 italic">
                    {{ component.config.text }}
                </p>
            </div>

            <!-- Input Inline -->
            <!-- <p v-else-if="component.type === 'INPUT_INLINE'" class="mb-2">
                {{ component.config.beforeText }}
                <span class="font-bold">{{ component.config.questionNumber || 1 }}.</span>
                <input type="text" :placeholder="component.config.placeholder || '___'"
                    class="border-b-2 border-gray-400 px-2 py-1 mx-1 w-32 bg-gray-50" />
                {{ component.config.afterText }}
            </p> -->
            <input-in-line v-else-if="component.type === 'INPUT_INLINE'" :component="component"/>
            
            <!-- Multiple Choice Qustion Options -->
            <mcq-preview v-else-if="component.type === 'MCQ_OPTIONS'" :component="component" />

            <!-- IMAGE Preview -->
            <image-preview v-else-if="component.type === 'IMAGE'" :component="component" />

            <!-- TABLE_GRID Preview -->
            <table-grid-preview v-else-if="component.type === 'TABLE_GRID'" :component="component" />

            <!-- NUMBERED_LIST Preview -->
            <numbered-list-preview v-else-if="component.type === 'NUMBERED_LIST'" :component="component" />

            <!-- BULLET_LIST Preview -->
            <bullet-list-preview v-else-if="component.type === 'BULLET_LIST'" :component="component" />

            <!-- MAP Preview -->
            <map-preview v-else-if="component.type === 'MAP'" :component="component" />

            <!-- MATCHING Preview -->
            <matching-preview v-else-if="component.type === 'MATCHING'" :component="component" />

            <!-- Default -->
            <div v-else class="text-gray-400 italic mb-2">
                [{{ component.type }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ImagePreview from './question-types/image/PreviewImage.vue';
import TableGridPreview from './question-types/table/PreviewTable.vue';
import NumberedListPreview from './question-types/numbered-list/PreviewNumberedList.vue';
import BulletListPreview from './question-types/bullet-list/PreviewBulletList.vue';
import McqPreview from './question-types/mcq/PreviewMCQ.vue';
import MapPreview from './question-types/map/PreviewMap.vue';
import MatchingPreview from './question-types/matching/preview.vue'
import InputInLine from './question-types/input-inline/preview.vue'

defineProps(['components'])

</script>

<style lang="scss" scoped></style>