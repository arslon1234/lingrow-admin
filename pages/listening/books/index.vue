<template>
    <main class="h-screen flex flex-col">
        <!-- MODALS -->
        <MaterialBook v-model="showModal" :loading="isLoading" :book-data="bookData" @submit="handleSubmitBook" />

        <!-- MATERIAL HEADER -->
        <TheMaterialHeader @open="openCreateModal" @updateSkillType="updateSkillType"/>

        <!-- MAIN CONTENT -->
        <div class="flex flex-1 overflow-hidden">
            <!-- SIDEBAR -->
            <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
                <!-- SEARCH & FILTER -->
                <div class="p-4 space-y-3 border-b border-gray-200">
                    <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search books..."
                        size="md" />

                    <!-- TYPE FILTER -->
                    <USelectMenu v-model="selectedBookType" :options="bookTypeOptions" value-attribute="value"
                        option-attribute="label" placeholder="All Types" size="md">
                        <template #label>
                            <span v-if="selectedBookType">
                                {{bookTypeOptions.find((t) => t.value === selectedBookType)?.label}}
                            </span>
                            <span v-else class="text-gray-500">All Types</span>
                        </template>
                    </USelectMenu>

                    <!-- STATUS FILTER -->
                    <USelectMenu v-model="selectedStatus" :options="statusOptions" value-attribute="value"
                        option-attribute="label" placeholder="All Status" size="md">
                        <template #label>
                            <span v-if="selectedStatus">
                                {{statusOptions.find((s) => s.value === selectedStatus)?.label}}
                            </span>
                            <span v-else class="text-gray-500">All Status</span>
                        </template>
                    </USelectMenu>
                </div>

                <!-- BOOKS LIST -->
                <div class="flex-1 overflow-y-auto">
                    <div v-if="materialsStore.isLoading" class="p-4">
                        <div v-for="i in 5" :key="i" class="animate-pulse mb-3">
                            <div class="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>

                    <div v-else-if="filteredBooks.length === 0" class="p-8 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-gray-400" />
                        </div>
                        <p class="text-gray-500 font-medium">No books found</p>
                        <p class="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                    </div>

                    <div v-else class="p-2">
                        <button v-for="book in filteredBooks" :key="book.id" @click="selectBook(book.id)"
                            class="w-full text-left px-4 py-3 rounded-lg mb-2 transition-all bg-white hover:bg-green-100"
                            :class="{
                                'bg-green-200 border-l-2 border-green-400': selectedBookId == book.id,
                                'border-gray-200 hover:border-gray-300': selectedBookId != book.id
                            }">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-gray-900 truncate mb-1">
                                        {{ book.title }}
                                    </h3>
                                    <div class="flex items-center gap-2 text-xs">
                                        <span class="px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                                            {{ formatMaterialType(book.materialType) }}
                                        </span>
                                        <span class="px-2 py-1 rounded-lg" :class="getStatusClass(book.status)">
                                            {{ book.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- CONTENT AREA -->
            <div class="flex-1 overflow-y-auto bg-gray-50">
                <div v-if="!selectedBookId" class="h-full flex items-center justify-center">
                    <div class="text-center">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
                            <UIcon name="i-heroicons-book-open" class="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">Select a book</h2>
                        <p class="text-gray-500">Choose a book from the sidebar to view details</p>
                    </div>
                </div>

                <div v-else-if="selectedBook" class="p-8">
                    <!-- BOOK HEADER -->
                    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                                    {{ selectedBook.title }}
                                </h2>
                                <div class="flex items-center gap-3 text-sm">
                                    <span class="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium">
                                        {{ formatMaterialType(selectedBook.materialType) }}
                                    </span>
                                    <span class="px-3 py-1 rounded-lg font-medium"
                                        :class="getStatusClass(selectedBook.status)">
                                        {{ selectedBook.status }}
                                    </span>
                                    <span v-if="selectedBook.publisher" class="text-gray-600"> Published by {{
                                        selectedBook.publisher }} </span>
                                </div>
                            </div>

                            <!-- ACTION BUTTONS -->
                            <div class="flex items-center gap-2 shrink-0">
                                <UButton icon="i-heroicons-pencil-square" size="md" color="gray" variant="soft"
                                    @click="handleEdit(selectedBook)"> Edit </UButton>
                                <UButton icon="i-heroicons-trash" size="md" color="red" variant="soft"
                                    @click="handleDelete(selectedBook.id)"> Delete </UButton>
                            </div>
                        </div>
                    </div>

                    <!-- BOOK CONTENT BASED ON TYPE -->
                    <div class="bg-white rounded-xl shadow-sm p-4">
                        <!-- MOCK TEST TYPE -->
                        <div v-if="selectedBook.materialType === 'MOCK_TEST'">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-semibold text-gray-900">Mock Test Content</h3>
                                <UButton icon="i-heroicons-plus" size="md">Add Section</UButton>
                            </div>

                            <div class="space-y-4">
                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-medium text-gray-900">Section 1</h4>
                                            <p class="text-sm text-gray-500 mt-1">10 questions • 15 minutes</p>
                                        </div>
                                        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-medium text-gray-900">Section 2</h4>
                                            <p class="text-sm text-gray-500 mt-1">10 questions • 15 minutes</p>
                                        </div>
                                        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- PRACTICE SET TYPE -->
                        <div v-else-if="selectedBook.materialType === 'PRACTICE_SET'">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-semibold text-gray-900">Practice Exercises</h3>
                                <UButton icon="i-heroicons-plus" size="md">Add Exercise</UButton>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <UIcon name="i-heroicons-speaker-wave" class="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Exercise 1</h4>
                                            <p class="text-xs text-gray-500">Audio comprehension</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600">15 questions</p>
                                </div>

                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <UIcon name="i-heroicons-chat-bubble-left-right"
                                                class="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Exercise 2</h4>
                                            <p class="text-xs text-gray-500">Conversation</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600">8 questions</p>
                                </div>
                            </div>
                        </div>

                        <!-- OFFICIAL TEST TYPE -->
                        <div v-else-if="selectedBook.materialType === 'OFFICIAL_TEST'">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-semibold text-gray-900">Official Test</h3>
                                <UButton icon="i-heroicons-plus" size="md">Add Test Part</UButton>
                            </div>

                            <div class="space-y-3">
                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-medium text-gray-900">Part 1 - Listening</h4>
                                            <p class="text-sm text-gray-500 mt-1">40 questions • 30 minutes</p>
                                        </div>
                                        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- BOOK TYPE -->
                        <div v-else-if="selectedBook.materialType === 'BOOK'">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-semibold text-gray-900">Book Chapters</h3>
                                <UButton icon="i-heroicons-plus" size="md">Add Chapter</UButton>
                            </div>

                            <div class="space-y-3">
                                <div
                                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-medium text-gray-900">Chapter 1: Introduction</h4>
                                            <p class="text-sm text-gray-500 mt-1">5 lessons • 20 exercises</p>
                                        </div>
                                        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- DEFAULT CONTENT -->
                        <div v-else class="text-center py-12">
                            <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p class="text-gray-500">Content will be displayed here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import MaterialBook from '~/components/modal/MaterialBook.vue';
import TheMaterialHeader from '~/components/material/TheMaterialHeader.vue';
import { addSuccess } from '~/helpers/notification';
import { useMaterialsStore } from '~/store/materials';

const materialsStore = useMaterialsStore();
const { materials, isLoading } = storeToRefs(materialsStore);

const router = useRouter();
const route = useRoute();
const { setQueries, getQueryParams } = useQueryParams(route, router);

const showModal = ref(false);
const bookData = ref<CreateMaterialBookRequest | null>(null);
const searchQuery = ref('');
const selectedBookType = ref<GetMaterialBookParams['type']>('MOCK_TEST');
const selectedStatus = ref<GetMaterialBookParams['status']>('DRAFT');
const selectedBookId = ref<string | null>(getQueryParams('bookId') || null);
const skillType = ref(getQueryParams('skillType') || 'LISTENING')

// Options for filters
const bookTypeOptions: Array<{ value: GetMaterialBookParams['type']; label: string }> = [
    { value: 'BOOK', label: 'Book' },
    { value: 'MOCK_TEST', label: 'Mock Test' },
    { value: 'PRACTICE_SET', label: 'Practice Set' },
    { value: 'OFFICIAL_TEST', label: 'Official Test' }
];

const statusOptions: Array<{ value: GetMaterialBookParams['status']; label: string }> = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'UNPUBLISHED', label: 'Unpublished' },
    { value: 'ARCHIVED', label: 'Archived' }
];

// Computed params for API
const apiParams = computed<GetMaterialBookParams>(() => ({
    status: selectedStatus.value,
    type: selectedBookType.value
}));

// Filtered books
const filteredBooks = computed(() => {
    let books = materials.value?.content || [];

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        books = books.filter(
            (book: any) => book.title?.toLowerCase().includes(query) || book.materialType?.toLowerCase().includes(query) || book.publisher?.toLowerCase().includes(query)
        );
    }

    return books;
});

// Selected book
const selectedBook = computed(() => {
    if (!selectedBookId.value) return null;
    return filteredBooks.value.find((book: any) => book.id == selectedBookId.value);
});

// Helper functions
function formatMaterialType(type: string): string {
    const typeMap: Record<string, string> = {
        BOOK: 'Book',
        MOCK_TEST: 'Mock Test',
        PRACTICE_SET: 'Practice Set',
        OFFICIAL_TEST: 'Official Test'
    };
    return typeMap[type] || type;
}

function getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
        DRAFT: 'bg-yellow-100 text-yellow-700',
        PUBLISHED: 'bg-green-100 text-green-700',
        UNPUBLISHED: 'bg-gray-100 text-gray-700',
        ARCHIVED: 'bg-red-100 text-red-700'
    };
    return classMap[status] || 'bg-gray-100 text-gray-700';
}

// update skillType

function updateSkillType(skillType: string) {
    setQueries({ skillType })
}

// Select book
function selectBook(bookId: string) {
    selectedBookId.value = bookId;
    setQueries({ bookId });
}

// Open create modal
function openCreateModal() {
    bookData.value = null;
    showModal.value = true;
}

// Handle submit book
async function handleSubmitBook({ formData }: { formData: MaterialBookData }) {
    const data: CreateMaterialBookRequest = {
        title: formData.title,
        materialType: formData.materialType,
        publisher: (formData as any).publisher,
        isStrictFormat: formData.materialType === 'MOCK_TEST',
        skillType: 'LISTENING'
    };

    if (formData.id) {
        data.id = formData.id;
        const response = await materialsStore.updateMaterial(formData.id, data);
        if (response.status === 200) {
            await materialsStore.getMaterials(apiParams.value);
            addSuccess('Material book successfully updated');
            showModal.value = false;
        }
    } else {
        const response = await materialsStore.createMaterial(data);
        if (response.status === 201) {
            await materialsStore.getMaterials(apiParams.value);
            addSuccess('Material book successfully created');
            showModal.value = false;
            // Select newly created book if available
            if (response.data?.id) {
                selectBook(response.data.id);
            }
        }
    }
}

// Handle edit
function handleEdit(book: any) {
    bookData.value = {
        id: book.id,
        title: book.title,
        materialType: book.materialType,
        publisher: book.publisher,
        isStrictFormat: book.materialType === 'MOCK_TEST'
    };
    showModal.value = true;
}

// Handle delete
async function handleDelete(materialId: string) {
    const response = await materialsStore.deleteMaterial(materialId);
    if (response.status === 204) {
        await materialsStore.getMaterials(apiParams.value);
        addSuccess('Material book successfully deleted');
        // Clear selection if deleted book was selected
        if (selectedBookId.value == materialId) {
            selectedBookId.value = null;
            setQueries({ bookId: null });
        }
    }
}

// Watch filters to reload data
watch([selectedBookType, selectedStatus], () => {
    materialsStore.getMaterials(apiParams.value);
    selectedBookId.value = null;
    setQueries({ bookId: null });
});

// Watch modal close
watch(showModal, (val) => {
    if (!val) {
        bookData.value = null;
    }
});

// Load materials on mount
onMounted(() => {
    materialsStore.getMaterials(apiParams.value);
});
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside ::-webkit-scrollbar {
    width: 6px;
}

aside ::-webkit-scrollbar-track {
    background: transparent;
}

aside ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

aside ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
