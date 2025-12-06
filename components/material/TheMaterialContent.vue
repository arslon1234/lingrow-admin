<template>
    <div>
        <!-- MODALS -->
        <TestMaterial v-model="showModal" :testData="testData" :loading="false" @submit="handleSubmitBook" />

        <!-- MAIN CONTENT -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Mock Test Content</h3>
            <UButton icon="i-heroicons-plus" size="md" @click="openCreateTestModal">Add Test</UButton>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="(test, testIndex) in materialTests" :key="test.id"
                class="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <!-- Test Header -->
                <div class="bg-slate-800 text-white p-4 flex items-center justify-between">
                    <h4 class="text-lg font-semibold"> {{ `${test.testNumber}. ${test.title}` || `Test ${testIndex + 1}`
                        }}</h4>
                    <div class="relative">
                        <UIcon name="i-heroicons-ellipsis-vertical"
                            class="w-5 h-5 cursor-pointer hover:bg-slate-700 rounded p-1"
                            @click="toggleMenu(test.id)" />

                        <!-- Dropdown Menu -->
                        <div v-if="openMenuId === test.id"
                            class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button @click="handleEdit(test)"
                                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-t-lg">
                                <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                                Edit
                            </button>
                            <button @click="handleDelete(test.id)"
                                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg">
                                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Test Content -->
                <div class="p-4 space-y-3">
                    <!-- Listening Section -->
                    <div class="border border-gray-200 rounded-lg"
                        :class="{ 'border-l-4 border-l-green-500 bg-green-50': expandedSections[test.id]?.listening }">
                        <div class="flex items-center justify-between p-3">
                            <div class="flex items-center gap-3 flex-1 cursor-pointer"
                                @click="toggleSection(test.id, 'listening')">
                                <UIcon
                                    :name="expandedSections[test.id]?.listening ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                                    class="w-5 h-5 text-gray-400" />
                                <UIcon name="i-heroicons-musical-note" class="w-5 h-5 text-gray-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Listening</p>
                                    <p class="text-sm text-gray-500">4 sections</p>
                                </div>
                            </div>
                            <button
                                class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
                                @click.stop="addSection('listening', test.id)">
                                + Section
                            </button>
                        </div>

                        <!-- Expanded Listening Sections -->
                        <div v-if="expandedSections[test.id]?.listening" class="border-t border-gray-200 bg-gray-50">
                            <div v-for="section in 4" :key="section"
                                class="flex items-center justify-between px-12 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                                <p class="text-gray-700">Section {{ section }}</p>
                                <p class="text-sm text-gray-500">10 questions</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reading Section -->
                    <div class="border border-gray-200 rounded-lg"
                        :class="{ 'border-l-4 border-l-green-500 bg-green-50': expandedSections[test.id]?.reading }">
                        <div class="flex items-center justify-between p-3">
                            <div class="flex items-center gap-3 flex-1 cursor-pointer"
                                @click="toggleSection(test.id, 'reading')">
                                <UIcon
                                    :name="expandedSections[test.id]?.reading ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                                    class="w-5 h-5 text-gray-400" />
                                <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-gray-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Reading</p>
                                    <p class="text-sm text-gray-500">3 passages</p>
                                </div>
                            </div>
                            <button
                                class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
                                @click.stop="addPassage(test.id)">
                                + Passage
                            </button>
                        </div>

                        <!-- Expanded Reading Passages -->
                        <div v-if="expandedSections[test.id]?.reading" class="border-t border-gray-200 bg-gray-50">
                            <div v-for="passage in 3" :key="passage"
                                class="flex items-center justify-between px-12 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                                <p class="text-gray-700">Passage {{ passage }}</p>
                                <p class="text-sm text-gray-500">13-14 questions</p>
                            </div>
                        </div>
                    </div>

                    <!-- Writing Section -->
                    <div class="border border-gray-200 rounded-lg"
                        :class="{ 'border-l-4 border-l-green-500 bg-green-50': expandedSections[test.id]?.writing }">
                        <div class="flex items-center justify-between p-3">
                            <div class="flex items-center gap-3 flex-1 cursor-pointer"
                                @click="toggleSection(test.id, 'writing')">
                                <UIcon
                                    :name="expandedSections[test.id]?.writing ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                                    class="w-5 h-5 text-gray-400" />
                                <UIcon name="i-heroicons-pencil" class="w-5 h-5 text-gray-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Writing</p>
                                    <p class="text-sm text-gray-500">2 tasks</p>
                                </div>
                            </div>
                            <button
                                class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
                                @click.stop="addTask(test.id)">
                                + Task
                            </button>
                        </div>

                        <!-- Expanded Writing Tasks -->
                        <div v-if="expandedSections[test.id]?.writing" class="border-t border-gray-200 bg-gray-50">
                            <div v-for="task in 2" :key="task"
                                class="flex items-center justify-between px-12 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                                <p class="text-gray-700">Task {{ task }}</p>
                                <p class="text-sm text-gray-500">{{ task === 1 ? '150 words' : '250 words' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Speaking Section -->
                    <div class="border border-gray-200 rounded-lg"
                        :class="{ 'border-l-4 border-l-green-500 bg-green-50': expandedSections[test.id]?.speaking }">
                        <div class="flex items-center justify-between p-3">
                            <div class="flex items-center gap-3 flex-1 cursor-pointer"
                                @click="toggleSection(test.id, 'speaking')">
                                <UIcon
                                    :name="expandedSections[test.id]?.speaking ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                                    class="w-5 h-5 text-gray-400" />
                                <UIcon name="i-heroicons-microphone" class="w-5 h-5 text-gray-500" />
                                <div>
                                    <p class="font-medium text-gray-900">Speaking</p>
                                    <p class="text-sm text-gray-500">3 parts</p>
                                </div>
                            </div>
                            <button
                                class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
                                @click.stop="addPart(test.id)">
                                + Part
                            </button>
                        </div>

                        <!-- Expanded Speaking Parts -->
                        <div v-if="expandedSections[test.id]?.speaking" class="border-t border-gray-200 bg-gray-50">
                            <div v-for="part in 3" :key="part"
                                class="flex items-center justify-between px-12 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                                <p class="text-gray-700">Part {{ part }}</p>
                                <p class="text-sm text-gray-500">{{ part === 1 ? '4-5 min' : part === 2 ? '3-4 min' :
                                    '4-5 min' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TestMaterial from '~/components/modal/TestMaterial.vue';
import { addSuccess } from '~/helpers/notification';
import { useMaterialsStore } from '~/store/materials';
const materialsStore = useMaterialsStore()

const router = useRouter();
const route = useRoute();
const { setQueries, getQueryParams } = useQueryParams(route, router);
const { materialTests } = storeToRefs(materialsStore)
const testData = ref<TestMaterials>({
    testNumber: '',
    title: ''
})
const props = defineProps({
    materialId: {
        type: String
    },
    materialType: {
        type: String
    }
})
const showModal = ref(false)

// Track expanded sections for each test
const expandedSections = ref<Record<string, Record<string, boolean>>>({})

// Track which menu is open
const openMenuId = ref<string | null>(null)

watch(() => props.materialId, (val) => {
    if (val) {
        materialsStore.getTestsByMaterialId(val)
    }
})
const toggleSection = (testId: string, sectionType: string) => {
    if (!expandedSections.value[testId]) {
        expandedSections.value[testId] = {}
    }
    expandedSections.value[testId][sectionType] = !expandedSections.value[testId][sectionType]
}

const toggleMenu = (testId: string) => {
    if (openMenuId.value === testId) {
        openMenuId.value = null
    } else {
        openMenuId.value = testId
    }
}

const handleEdit = (test: MaterialTestReponse) => {
    testData.value = {
        id: test.id,
        title: test.title,
        testNumber: String(test.testNumber)
    }
    showModal.value = true
    openMenuId.value = null
}

const handleDelete = async (testId: string) => {
    const response = await materialsStore.deleteTestByTestId(testId)
    if (response.status === 204) {
        addSuccess('Material test successfully deleted');
        materialsStore.getTestsByMaterialId(props.materialId!)
    }
    openMenuId.value = null
}

const addSection = (type: string, testId: string) => {
    console.log('Add section for:', type, 'Test ID:', testId)
    // Add your logic here
}

const addPassage = (testId: string) => {
    console.log('Add passage for Test ID:', testId)
    // Add your logic here
}

const addTask = (testId: string) => {
    console.log('Add task for Test ID:', testId)
    // Add your logic here
}

const addPart = (testId: string) => {
    console.log('Add part for Test ID:', testId)
    // Add your logic here
}

const openCreateTestModal = () => {
    showModal.value = true
}

const handleSubmitBook = async ({ formData }: { formData: TestMaterials }) => {
    if (!formData.id) {
        const response = await materialsStore.createMaterialTest(props.materialId!, formData)
        if (response.status === 201) {
            addSuccess('Material test successfully created');
            showModal.value = false;
        }
    } else {
        const { id, ...payloadData } = formData
        const response = await materialsStore.updateTestByTestId(id, { ...payloadData, isStrictFormat: true })
        if (response.status === 200) {
            addSuccess('Material test successfully updated');
            materialsStore.getTestsByMaterialId(props.materialId!)
            showModal.value = false;
        }
    }
}

// Close menu when clicking outside
onMounted(() => {
    materialsStore.getTestsByMaterialId(props.materialId!)

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (!target.closest('.relative')) {
            openMenuId.value = null
        }
    })
})

onUnmounted(() => {
    document.removeEventListener('click', () => { })
})
</script>

<style lang="scss" scoped></style>