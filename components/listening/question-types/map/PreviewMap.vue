<template>
    <!-- MAP Preview -->
    <div class="my-6">
        <!-- Map Title/Instructions -->
        <div v-if="component.config.title" class="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap">
                {{ component.config.title }}
            </p>
        </div>

        <!-- Map Display -->
        <div v-if="component.config.mapUrl"
            class="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <div class="relative inline-block max-w-full">
                <img :src="component.config.mapUrl" alt="Map" class="max-w-full h-auto rounded-lg" />

                <!-- Hotspot Markers -->
                <div v-for="(hotspot, index) in component.config.hotspots" :key="`preview-hotspot-${index}`"
                    class="absolute transform -translate-x-1/2 -translate-y-1/2 group" :style="{
                        left: hotspot.x + '%',
                        top: hotspot.y + '%'
                    }">
                    <!-- Marker Pin -->
                    <div
                        class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                        {{ hotspot.label }}
                    </div>

                    <!-- Hover Tooltip -->
                    <div
                        class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <div class="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg">
                            <p class="font-semibold">{{ hotspot.label }}</p>
                            <p v-if="hotspot.locationName" class="text-gray-300 mt-1">{{ hotspot.locationName }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Map State -->
        <UAlert v-else icon="i-heroicons-map" color="amber" variant="soft" title="No map uploaded"
            description="Map will be displayed here once uploaded" />
    </div>
</template>

<script setup lang="ts">
defineProps(['component']);
</script>

<style lang="scss" scoped></style>