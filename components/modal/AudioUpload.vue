<template>
  <UModal v-model="internalValue" :ui="{ base: 'sm:!max-w-[450px]' }">
    <div class="w-full p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="title">Upload Audio</h2>
        <UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
          class="-my-1" @click="closeModal" />
      </div>

      <UDivider />

      <!-- File input -->
      <div class="flex flex-col items-center justify-center space-y-4 cursor-pointer">
        <input ref="fileInput" type="file" accept="audio/*" class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                 file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 cursor-pointer" @change="onFileChange" />

        <!-- Preview -->
        <audio v-if="audioUrl" :src="audioUrl" controls class="w-full"></audio>
      </div>

      <UDivider />

      <!-- Actions -->
      <div class="flex items-center justify-end gap-x-3">
        <UButton @click="closeModal" class="w-28 justify-center" size="xl" label="Cancel" variant="solid" :ui="{
          rounded: 'rounded-lg',
          variant: {
            solid:
              'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.05]',
          },
        }" />
        <UButton @click="handleUpload" class="w-28 justify-center" size="xl" label="Upload" variant="solid"
          color="primary" :disabled="!selectedFile" :loading="loading" />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  loading: boolean
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "upload", file: File): void;
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const selectedFile = ref<File | null>(null);
const audioUrl = ref<string | null>(null);

function closeModal() {
  emit("update:modelValue", false);

}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    audioUrl.value = URL.createObjectURL(selectedFile.value);
  }
}

function handleUpload() {
  if (selectedFile.value) {
    emit("upload", selectedFile.value);
  }
}
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      selectedFile.value = null;
      audioUrl.value = null;
    }
  }
);
</script>
