<template>
    <UModal v-model="internalValue" :ui="{ base: 'sm:!max-w-[500px]' }">
        <div class="w-full p-6 space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">{{ isEditMode ? `Update ${materialType === 'MOCK_TEST' ? 'Test' :
                    'Unit'}` : `Create New ${materialType === 'MOCK_TEST' ? 'Test' : 'Unit'}` }}</h2>
                <UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
                    icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
            </div>

            <UDivider />

            <form @submit.prevent="handleSubmit" class="space-y-4" id="form">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ `${materialType === 'MOCK_TEST' ? 'Test' : 'Unit'}` }} number <span class="text-red-500">*</span>
                    </label>
                    <UInput v-model="formData.testNumber" type="number" placeholder="Enter test number" size="lg" :ui="{
                        rounded: 'rounded-lg',
                        padding: { xl: 'px-4 py-3' },
                        color: {
                            white: {
                                outline: 'shadow-none ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-primary-500'
                            }
                        }
                    }" />
                    <p v-if="errors.testNumber" class="text-sm text-red-500">{{ errors.testNumber }}</p>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title <span class="text-red-500">*</span>
                    </label>
                    <UInput v-model="formData.title" placeholder="Enter test title" size="lg" :ui="{
                        rounded: 'rounded-lg',
                        padding: { xl: 'px-4 py-3' },
                        color: {
                            white: {
                                outline: 'shadow-none ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-primary-500'
                            }
                        }
                    }" />
                    <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
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
                <UButton type="submit" form="form" class="w-28 justify-center" size="lg"
                    :label="isEditMode ? 'Update' : 'Create'" variant="solid" color="primary" :disabled="!isFormValid"
                    :loading="loading" />
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { z } from "zod";

import { materialTestSchema } from "~/schemas/material/materialSchema";

const props = defineProps<{
    modelValue: boolean;
    loading: boolean;
    testData?: TestMaterials | null;
    materialType: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", data: { formData: TestMaterials }): void;
}>();

// Edit mode schema (with optional id)
const testSchemaWithId = materialTestSchema.extend({
    id: z.string().optional(),
});

// Internal value for v-model
const internalValue = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
});

// Check if edit mode based on testData presence
const isEditMode = computed(() => !!props.testData && !!props.testData.id);

// Form data
const formData = ref<TestMaterials>({
    title: '',
    testNumber: '',
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
        formData.value.testNumber !== ''
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
        errors.value = { title: '', testNumber: '' };

        // Validate using Zod
        const schema = isEditMode.value ? testSchemaWithId : materialTestSchema;
        schema.parse(formData.value);

        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
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
            ...(isEditMode.value && props.testData?.id ? { id: props.testData.id } : {})
        },
    });
}

// Reset form
function resetForm() {
    formData.value = {
        title: '',
        testNumber: '',
    };
    selectedBookType.value = undefined;
    selectedFile.value = null;
    errors.value = { title: '', materialType: '' };
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

// Watch modal open/close and testData changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && props.testData) {
            // Populate form with testData for edit mode
            formData.value = {
                title: props.testData.title || '',
                testNumber: props.testData.testNumber || '',
            };
        } else if (!newVal) {
            // Reset form when modal closes
            setTimeout(() => resetForm(), 300);
        }
    }
);

// Watch testData changes
watch(
    () => props.testData,
    (newData) => {
        if (newData && props.modelValue) {
            formData.value = {
                title: newData.title || '',
                testNumber: newData.testNumber || '',
            };
        }
    },
    { deep: true }
);
</script>

<style scoped>
/* Custom styles if needed */
</style>