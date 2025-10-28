<template>
  <!-- Main Content Area -->
  <div :class="previewMode ? 'col-span-12' : 'col-span-9'">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="font-bold mb-4">
        {{ previewMode ? 'Preview' : 'Question Layouts' }}
      </h2>

      <!-- Empty State -->
      <div v-if="components.length === 0 && !previewMode" class="text-center py-12 text-gray-400">
        <p>No components added yet.</p>
        <p class="text-sm">Select components from the left panel to start building your question.</p>
      </div>

      <!-- Preview Mode -->
      <preview-mode v-if="previewMode" :components="components" />

      <!-- Edit Mode -->
      <edit-mode v-else :components="components"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
import PreviewMode from './PreviewMode.vue';
import EditMode from './EditMode.vue';
const listeningStore = useListeningStore()
const { components, previewMode } = storeToRefs(listeningStore)

</script>

<style lang="scss" scoped></style>