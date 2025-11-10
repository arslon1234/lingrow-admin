<template>
    <div v-if="!previewMode" class="bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-200px)] flex flex-col">
        <h2 className="font-bold mb-4">Components</h2>
        <div v-for="[category, items] in categorizedComponents" :key="category" class="mb-4">
            <h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">
                {{ category }}
            </h3>
            <div class="space-y-1">
                <button v-for="item in items" :key="item" @click="addComponent(item)"
                    class="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-50 flex items-center gap-2 transition-colors">
                    <UIcon name="i-heroicons-plus" class="text-blue-500 w-4 h-4" />
                    <span>{{ formatComponentName(item) }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
const listeningStore = useListeningStore()
const { previewMode, questionType } = storeToRefs(listeningStore)

const availableComponentsForType = computed(() => {
    if (!questionType.value) return []
    return QUESTION_TYPE_COMPONENTS[questionType.value] || []
})

const categorizedComponents = computed(() => {
    const result: Record<string, string[]> = {}

    for (const [category, components] of Object.entries(COMPONENT_CATEGORIES)) {
        const filteredComponents = components.filter(comp =>
            availableComponentsForType.value.includes(comp)
        )

        if (filteredComponents.length > 0) {
            result[category] = filteredComponents
        }
    }

    return Object.entries(result)
})
const addComponent = (componentType: string) => {
    const newComponent: Component = {
        id: Date.now(),
        type: componentType,
        config: listeningStore.getDefaultConfig(componentType)
    }
    listeningStore.addComponent({ ...newComponent })
}
const formatComponentName = (name: string) => {
    return name.replace(/_/g, ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
</script>

<style lang="scss" scoped></style>