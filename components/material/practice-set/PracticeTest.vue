<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Practice Exercises</h3>
            <UButton icon="i-heroicons-plus" size="md">Add Exercise</UButton>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <UIcon name="i-heroicons-speaker-wave" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Exercise 1</h4>
                        <p class="text-xs text-gray-500">Audio comprehension</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600">15 questions</p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Exercise 2</h4>
                        <p class="text-xs text-gray-500">Conversation</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600">8 questions</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped></style>