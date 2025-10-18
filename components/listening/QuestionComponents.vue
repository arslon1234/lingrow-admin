<template>
    <div v-if="!previewMode" class="bg-white rounded-lg shadow-lg p-4">
        <h2 className="font-bold mb-4">Components</h2>
        <div v-for="[category, items] in Object.entries(availableComponents)" :key="category" class="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">{{ category }}</h3>
            <div class="space-y-1">
                <button v-for="item in items" @click="addComponent(item)"
                    class="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-50 flex items-center gap-2">
                    <UIcon name="i-heroicons-plus" class="text-blue-500 w-4 h-4" />
                    {{ item.replace(/_/g, ' ') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
const listeningStore = useListeningStore()
const { previewMode } = storeToRefs(listeningStore)

const addComponent = (componentType: string) => {
    const newComponent: Component = {
        id: Date.now(),
        type: componentType,
        config: listeningStore.getDefaultConfig(componentType)
    }
    listeningStore.addComponent({ ...newComponent })
}
</script>

<style lang="scss" scoped></style>