<template>
    <div class="space-y-4">
        <!-- Question Text -->
        <UFormGroup label="Question Text" size="lg">
            <UTextarea :model-value="component.config.questionText"
                @update:model-value="updateConfig('questionText', $event)"
                placeholder="What is the students' opinion about..." :rows="2" />
        </UFormGroup>

        <!-- Instructions -->
        <UFormGroup label="Instructions" size="lg">
            <UTextarea :model-value="component.config.instruction"
                @update:model-value="updateConfig('instruction', $event)" placeholder="Choose answers from the box..."
                :rows="2" class="italic" />
        </UFormGroup>

        <UDivider />
        <div class="space-y-1">
            <div class="flex items-center gap-3">
                <USelect v-model="component.config.displayStyle" :options="displayStyles" size="lg"
                placeholder="Select display styles" />
                <UInput v-if="component.config.displayStyle === 'GRID'" type="number" v-model="component.config.maxLines" placeholder="Enter max lines" size="lg"/>
            </div>
        </div>
        <!-- Options Section -->
        <div class="space-y-3">
            <div class="flex items-end justify-between gap-3">
                <UFormGroup label="Options Box Title" size="sm" class="flex-1">
                    <UInput :model-value="component.config.optionsTitle || 'Opinions'"
                        @update:model-value="updateConfig('optionsTitle', $event)" placeholder="Opinions" />
                </UFormGroup>
                <UButton icon="i-heroicons-plus" @click="addOption" color="primary">
                    Add Option
                </UButton>
            </div>

            <div class="border rounded-lg p-3 bg-gray-50 space-y-2">
                <div v-for="(option, index) in options" :key="index"
                    class="flex items-center gap-2 bg-white p-2 rounded border">
                    <div class="flex flex-col gap-1">
                        <button @click="moveOption(index, 'up')" :disabled="index === 0"
                            class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                            <up-icon />
                        </button>
                        <button @click="moveOption(index, 'down')" :disabled="index === options.length - 1"
                            class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                            <down-icon />
                        </button>
                    </div>

                    <UInput :model-value="option.id" @update:model-value="updateOption(index, 'id', $event)"
                        class="w-16 text-center font-bold" maxlength="1" placeholder="A" />

                    <UInput :model-value="option.text" @update:model-value="updateOption(index, 'text', $event)"
                        class="flex-1" placeholder="Enter option text..." />

                    <button @click="deleteOption(index)" class="text-red-500 hover:text-red-700">
                        <delete-icon />
                    </button>
                </div>
            </div>
        </div>

        <UDivider />

        <!-- Items Section -->
        <div class="space-y-3">
            <div class="flex items-end justify-between gap-3">
                <UFormGroup label="Items List Title" size="sm" class="flex-1">
                    <UInput :model-value="component.config.itemsTitle || 'Food trends'"
                        @update:model-value="updateConfig('itemsTitle', $event)" placeholder="Food trends" />
                </UFormGroup>
                <UFormGroup label="Start Number" size="sm" class="w-32">
                    <UInput type="number" :model-value="component.config.startNumber || 25"
                        @update:model-value="updateConfig('startNumber', parseInt($event))" :min="1" />
                </UFormGroup>
                <UButton icon="i-heroicons-plus" @click="addItem" color="green">
                    Add Item
                </UButton>
            </div>

            <!-- Available Options Info -->
            <div v-if="options.length > 0"
                class="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd" />
                </svg>
                <span class="text-blue-700">
                    Available options: <strong>{{ availableOptions.join(', ') }}</strong>
                </span>
            </div>

            <div class="space-y-2">
                <div v-for="(item, index) in items" :key="index"
                    class="flex items-center gap-2 bg-white p-2 rounded border">
                    <div class="flex flex-col gap-1">
                        <button @click="moveItem(index, 'up')" :disabled="index === 0"
                            class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                            <up-icon />
                        </button>
                        <button @click="moveItem(index, 'down')" :disabled="index === items.length - 1"
                            class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                            <down-icon />
                        </button>
                    </div>

                    <div class="w-12 px-2 py-2 bg-gray-100 rounded text-center font-bold">
                        {{ (component.config.startNumber || 25) + index }}
                    </div>

                    <UInput :model-value="item.text" @update:model-value="updateItem(index, 'text', $event)"
                        class="flex-1" placeholder="Enter item text..." />

                    <div class="w-32 relative">
                        <UInput :model-value="item.correctAnswer" @update:model-value="updateItemAnswer(index, $event)"
                            :class="[
                                'w-full',
                                isValidAnswer(item.correctAnswer) ? '' : 'border-red-300'
                            ]" placeholder="A, B..." maxlength="1"
                            :icon="isValidAnswer(item.correctAnswer) ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                            :color="isValidAnswer(item.correctAnswer) ? 'green' : 'red'" />
                        <!-- Error tooltip -->
                        <div v-if="item.correctAnswer && !isValidAnswer(item.correctAnswer)"
                            class="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap">
                            Invalid option! Use: {{ availableOptions.join(', ') }}
                        </div>
                    </div>

                    <button @click="deleteItem(index)" class="text-red-500 hover:text-red-700">
                        <delete-icon />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening';
import DeleteIcon from '~/components/icons/DeleteIcon.vue';
import UpIcon from '~/components/icons/UpIcon.vue';
import DownIcon from '~/components/icons/DownIcon.vue';

const props = defineProps(['component']);
const listeningStore = useListeningStore();

const displayStyles = [
    { value: 'VERTICAL', label: "Vertical" },
    { value: 'GRID', label: "Grid" },
]

const options = ref(props.component.config.matchingOptions || []);
const items = ref(props.component.config.matchingItems || []);

// Get available option IDs
const availableOptions = computed(() => {
    return options.value.map((opt: any) => opt.id).filter((id: any) => id && id.trim() !== '');
});

// Validate if answer is in available options
const isValidAnswer = (answer: string): boolean => {
    if (!answer || answer.trim() === '') return true; // empty is ok
    return availableOptions.value.includes(answer.toUpperCase());
};

const updateConfig = (key: string, value: any) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        [key]: value
    });
};

const saveData = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        matchingOptions: options.value,
        matchingItems: items.value
    });
};

// Options methods
const addOption = () => {
    const nextLetter = String.fromCharCode(65 + options.value.length);
    options.value.push({ id: nextLetter, text: '' });
    saveData();
};

const updateOption = (index: number, field: string, value: string) => {
    const oldId = options.value[index].id;
    const newId = field === 'id' ? value.toUpperCase() : oldId;

    options.value[index][field] = field === 'id' ? value.toUpperCase() : value;

    // Update all items that use the old ID
    if (field === 'id' && oldId !== newId) {
        items.value.forEach((item: any) => {
            if (item.correctAnswer === oldId) {
                item.correctAnswer = newId;
            }
        });
    }

    saveData();
};

const deleteOption = (index: number) => {
    const deletedId = options.value[index].id;
    options.value.splice(index, 1);

    // Clear correct answers that used the deleted option
    items.value.forEach((item: any) => {
        if (item.correctAnswer === deletedId) {
            item.correctAnswer = '';
        }
    });

    saveData();
};

const moveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [options.value[index], options.value[newIndex]] = [options.value[newIndex], options.value[index]];
    saveData();
};

// Items methods
const addItem = () => {
    items.value.push({ id: items.value.length + 1, text: '', correctAnswer: '' });
    saveData();
};

const updateItem = (index: number, field: string, value: string) => {
    items.value[index][field] = value;
    saveData();
};

const updateItemAnswer = (index: number, value: string) => {
    const upperValue = value.toUpperCase();

    // Only update if valid or empty
    if (upperValue === '' || isValidAnswer(upperValue)) {
        items.value[index].correctAnswer = upperValue;
        saveData();
    } else {
        // Show visual feedback but don't save invalid value
        items.value[index].correctAnswer = upperValue;

        // Auto-clear invalid after 2 seconds
        setTimeout(() => {
            if (!isValidAnswer(items.value[index].correctAnswer)) {
                items.value[index].correctAnswer = '';
                saveData();
            }
        }, 2000);
    }
};

const deleteItem = (index: number) => {
    items.value.splice(index, 1);
    saveData();
};

const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [items.value[index], items.value[newIndex]] = [items.value[newIndex], items.value[index]];
    saveData();
};

// Watch for prop changes
watch(() => props.component.config, () => {
    options.value = props.component.config.matchingOptions || [];
    items.value = props.component.config.matchingItems || [];
}, { deep: true });
</script>