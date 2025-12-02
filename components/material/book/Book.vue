<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Book Chapters</h3>
            <UButton icon="i-heroicons-plus" size="md">Add Chapter</UButton>
        </div>

        <div class="space-y-3">
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">Chapter 1: Introduction</h4>
                        <p class="text-sm text-gray-500 mt-1">5 lessons • 20 exercises</p>
                    </div>
                    <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>