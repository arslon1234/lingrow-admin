<template>
    <div class="mb-4">
        <!-- Question Text -->
        <p v-if="component.config.questionText" class="font-medium mb-3 text-gray-800">
            <span class="font-bold">{{ component.config.questionNumber || 1 }}.</span> {{
                component.config.questionText }}
        </p>

        <!-- Options -->
        <div class="space-y-2">
            <label v-for="(option, idx) in component.config.options" :key="idx" class="flex items-center gap-2">
                <input type="radio" :name="`mcq-${component.id}`" />
                <span>{{ option }}</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['component']);
</script>

<style lang="scss" scoped></style>