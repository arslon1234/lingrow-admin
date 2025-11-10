<template>
    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-xs font-medium text-gray-500 mb-2">Preview</p>
            <div class="space-y-2">
                <p v-if="component.config.questionText" class="font-medium text-md">
                    {{ component.config.questionNumber }}. {{ component.config.questionText }}
                </p>
                <div class="space-y-1">
                    <label v-for="(option, idx) in component.config.options" :key="`preview-${idx}`"
                        class="flex items-center gap-2 text-md cursor-pointer">
                        <input :type="component.config.multiSelect ? 'checkbox' : 'radio'"
                            :name="`preview-mcq-${component.id}`" />
                        <span>{{ String.fromCharCode(65 + idx) }}) {{ option }}</span>
                        <UBadge v-if="isCorrectAnswer(option)" color="green" variant="soft" size="xs">
                            Correct
                        </UBadge>
                    </label>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
const props = defineProps(['component']);

const isCorrectAnswer = (option: string): boolean => {
    if (props.component.config.multiSelect) {
        return Array.isArray(props.component.config.correctAnswer) &&
            props.component.config.correctAnswer.includes(option)
    }
    return props.component.config.correctAnswer === option
}
</script>

<style lang="scss" scoped></style>