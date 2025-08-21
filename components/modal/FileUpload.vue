<template>
  <UModal v-model="internalValue" :ui="{ base: 'sm:!max-w-[450px]' }">
    <div class="w-full p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="title">File Upload</h2>
        <UButton
          color="gray"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="closeModal"
        />
      </div>
      <UDivider />
      <div class="flex items-center justify-center h-16">
        <h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">
          Do you want to upload a file?
        </h3>
      </div>
      <UDivider />
      <div class="flex items-center justify-end gap-x-3">
        <UButton
          @click="closeModal"
          class="w-28 justify-center"
          size="xl"
          label="Cancel"
          variant="solid"
          :ui="{
            rounded: 'rounded-lg',
            variant: {
              solid:
                'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.05]',
            },
          }"
        />
        <UButton
          @click="handleUpload"
          class="w-28 justify-center"
          size="xl"
          label="Upload"
          variant="solid"
          color="primary"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "upload"): void;
}>();

// v-model uchun computed property ishlatamiz
const internalValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
});

function closeModal() {
  emit("update:modelValue", false);
}

function handleUpload() {
  emit("upload");
  closeModal();
}
</script>

<style lang="scss" scoped></style>