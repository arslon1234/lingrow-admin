<template>
    <div class="my-6">
        <UCard v-if="component.config.url">
            <NuxtImg :src="component.config.url" :alt="component.config.alt || 'Question image'"
                class="w-full rounded-lg" loading="lazy" />
            <template v-if="component.config.caption" #footer>
                <p class="text-sm text-gray-600 dark:text-gray-400 text-center italic">
                    {{ component.config.caption }}
                </p>
            </template>
        </UCard>

        <UAlert v-else icon="i-heroicons-photo" color="red" variant="subtle" title="No image available"
            description="Image will be displayed here once uploaded" />
    </div>
</template>

<script setup lang="ts">
defineProps(['component'])
</script>

<style lang="scss" scoped></style>