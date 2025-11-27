<template>
    <UModal v-model="internalValue" :ui="{ base: 'sm:!max-w-[500px]' }">
        <div class="w-full p-6 space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">{{ isEditMode ? 'Update Book' : 'Create New Book' }}</h2>
                <UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
                    icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
            </div>

            <UDivider />

            <form @submit.prevent="handleSubmit" class="space-y-4">
                 <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Book Type <span class="text-red-500">*</span>
                    </label>
                    <USelectMenu v-model="formData.type" :options="bookTypes" placeholder="Select book type" size="xl"
                        :ui="{
                            rounded: 'rounded-lg',
                            padding: { xl: 'px-4 py-3' },
                        }" />
                    <p v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</p>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Book Name <span class="text-red-500">*</span>
                    </label>
                    <UInput v-model="formData.name" placeholder="Enter book name" size="xl" :ui="{
                        rounded: 'rounded-lg',
                        padding: { xl: 'px-4 py-3' },
                        color: {
                            white: {
                                outline: 'shadow-none ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-primary-500'
                            }
                        }
                    }" />
                    <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
                </div>
            </form>

            <UDivider />

            <div class="flex items-center justify-end gap-x-3">
                <UButton @click="closeModal" class="w-28 justify-center" size="xl" label="Cancel" variant="solid" :ui="{
                    rounded: 'rounded-lg',
                    variant: {
                        solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.05]',
                    },
                }" />
                <UButton @click="handleSubmit" class="w-28 justify-center" size="xl"
                    :label="isEditMode ? 'Update' : 'Create'" variant="solid" color="primary" :disabled="!isFormValid"
                    :loading="loading" />
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface BookData {
    id?: string;
    name: string;
    type: string;
}

const props = defineProps<{
    modelValue: boolean;
    loading: boolean;
    bookData?: BookData | null;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", data: { formData: BookData }): void;
}>();

// Book types
const bookTypes = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'Self-Help',
    'Educational',
    'Other'
];

// Internal value for v-model
const internalValue = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
});

// Check if edit mode based on bookData presence
const isEditMode = computed(() => !!props.bookData && !!props.bookData.id);

// Form data
const formData = ref<BookData>({
    name: '',
    type: '',
});

// File handling
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Validation errors
const errors = ref({
    name: '',
    type: '',
});

// Form validation
const isFormValid = computed(() => {
    return (
        formData.value.name.trim() !== '' &&
        formData.value.type !== '' &&
        (isEditMode.value || selectedFile.value !== null) // Audio required only for create
    );
});

// Close modal
function closeModal() {
    emit("update:modelValue", false);
    resetForm();
}


// Validate form
function validateForm(): boolean {
    let isValid = true;
    errors.value = { name: '', type: '' };

    if (!formData.value.name.trim()) {
        errors.value.name = 'Book name is required';
        isValid = false;
    }

    if (!formData.value.type) {
        errors.value.type = 'Book type is required';
        isValid = false;
    }

    return isValid;
}

// Submit handler
function handleSubmit() {
    if (!validateForm()) return;

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
        name: '',
        type: '',
    };
    selectedFile.value = null;
    errors.value = { name: '', type: ''};
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
                name: props.bookData.name || '',
                type: props.bookData.type || '',
            };
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
                name: newData.name || '',
                type: newData.type || '',
            };
        }
    },
    { deep: true }
);
</script>

<style scoped>
/* Custom styles if needed */
</style>