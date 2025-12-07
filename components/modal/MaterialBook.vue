<template>
    <UModal v-model="internalValue" :ui="{ base: 'sm:!max-w-[500px]' }">
        <div class="w-full p-6 space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">{{ isEditMode ? 'Update Material' : 'Create New Metarial' }}</h2>
                <UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
                    icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
            </div>

            <UDivider />

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Material Type <span class="text-red-500">*</span>
                    </label>
                    <USelectMenu 
                        v-model="selectedBookType" 
                        :options="BookTypeOptions" 
                        placeholder="Select material type" 
                        size="lg"
                        option-attribute="label"
                        :ui="{
                            rounded: 'rounded-lg',
                            padding: { xl: 'px-4 py-3' },
                        }" 
                    >
                        <template #label>
                            {{ selectedBookType?.label || 'Select material type' }}
                        </template>
                    </USelectMenu>
                    <p v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</p>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Material Name <span class="text-red-500">*</span>
                    </label>
                    <UInput v-model="formData.title" placeholder="Enter book name" size="lg" :ui="{
                        rounded: 'rounded-lg',
                        padding: { xl: 'px-4 py-3' },
                        color: {
                            white: {
                                outline: 'shadow-none ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-primary-500'
                            }
                        }
                    }" />
                    <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
                </div>
            </form>

            <UDivider />

            <div class="flex items-center justify-end gap-x-3">
                <UButton @click="closeModal" class="w-28 justify-center" size="lg" label="Cancel" variant="solid" :ui="{
                    rounded: 'rounded-lg',
                    variant: {
                        solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.05]',
                    },
                }" />
                <UButton @click="handleSubmit" class="w-28 justify-center" size="lg"
                    :label="isEditMode ? 'Update' : 'Create'" variant="solid" color="primary" :disabled="!isFormValid"
                    :loading="loading" />
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { z } from "zod";
import { BookTypeOptions } from "~/helpers/constants";
import { materialBookSchema } from "~/schemas/material/materialSchema";

const props = defineProps<{
    modelValue: boolean;
    loading: boolean;
    bookData?: MaterialBookData | null;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", data: { formData: MaterialBookData }): void;
}>();

// Edit mode schema (with optional id)
const bookSchemaWithId = materialBookSchema.extend({
    id: z.string().optional(),
});


// Internal value for v-model
const internalValue = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
});

// Check if edit mode based on bookData presence
const isEditMode = computed(() => !!props.bookData && !!props.bookData.id);

// Form data
const formData = ref<MaterialBookData>({
    title: '',
    materialType: '',
});

// Selected book type object
const selectedBookType = ref<{ value: GetMaterialBookParams['type']; label: string } | undefined>(undefined);

// File handling
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Validation errors
const errors = ref<Record<string, string>>({
    title: '',
    materialType: '',
});

// Watch selectedBookType and update formData.type
watch(selectedBookType, (newType) => {
    if (newType) {
        formData.value.materialType = newType.value;
        // Clear type error when selection is made
        errors.value.materialType = '';
    } else {
        formData.value.materialType = '';
    }
});

// Watch name input to clear error on change
watch(() => formData.value.title, () => {
    if (formData.value.title.trim()) {
        errors.value.title = '';
    }
});

// Form validation
const isFormValid = computed(() => {
    return (
        formData.value.title.trim() !== '' &&
        formData.value.materialType !== ''
    );
});

// Close modal
function closeModal() {
    emit("update:modelValue", false);
    resetForm();
}

// Validate form with Zod
function validateForm(): boolean {
    try {
        // Clear previous errors
        errors.value = { title: '', materialType: '' };

        // Validate using Zod
        const schema = isEditMode.value ? bookSchemaWithId : materialBookSchema;
        schema.parse(formData.value);

        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Map Zod errors to errors object
            error.errors.forEach((err) => {
                const field = err.path[0] as string;
                errors.value[field] = err.message;
            });
        }
        return false;
    }
}

// Submit handler
function handleSubmit() {
    if (!validateForm()) {
        console.log("Validation failed:", errors.value);
        return;
    }
    emit("submit", {
        formData: {
            ...formData.value,
            ...(isEditMode.value && props.bookData?.id ? { id: props.bookData.id } : {})
        },
    });
}

// Reset form
function resetForm() {
    formData.value = {
        title: '',
        materialType: '',
    };
    selectedBookType.value = undefined;
    selectedFile.value = null;
    errors.value = { title: '', materialType: '' };
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

// Watch modal open/close and bookData changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && props.bookData) {
            // Populate form with bookData for edit mode
            formData.value = {
                title: props.bookData.title || '',
                materialType: props.bookData.materialType || '',
            };
            // Find and set the selected book type
            selectedBookType.value = BookTypeOptions.find(bt => bt.value === props.bookData?.materialType);
        } else if (!newVal) {
            // Reset form when modal closes
            setTimeout(() => resetForm(), 300);
        }
    }
);

// Watch bookData changes
watch(
    () => props.bookData,
    (newData) => {
        if (newData && props.modelValue) {
            formData.value = {
                title: newData.title || '',
                materialType: newData.materialType || '',
            };
            // Find and set the selected book type
            selectedBookType.value = BookTypeOptions.find(bt => bt.value === newData.materialType);
        }
    },
    { deep: true }
);
</script>

<style scoped>
/* Custom styles if needed */
</style>