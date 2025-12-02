<template>
    <div>
        <!-- MODALS -->
        <TestMaterial v-model="showModal" :loading="false" @submit="handleSubmitBook" />

        <!-- MAIN CONTENT -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Mock Test Content</h3>
            <UButton icon="i-heroicons-plus" size="md" @click="openCreateTestModal">Add Test</UButton>
        </div>

        <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">Section 1</h4>
                        <p class="text-sm text-gray-500 mt-1">10 questions • 15 minutes</p>
                    </div>
                    <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
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
</template>

<script setup lang="ts">
import TestMaterial from '~/components/modal/TestMaterial.vue';
import { addSuccess } from '~/helpers/notification';
import { useMaterialsStore } from '~/store/materials';
const materialsStore = useMaterialsStore()

const router = useRouter();
const route = useRoute();
const { setQueries, getQueryParams } = useQueryParams(route, router);
const materialId = getQueryParams('bookId')
const showModal = ref(false)

const openCreateTestModal = () => {
    showModal.value = true
}
const handleSubmitBook = async ({ formData }: { formData: TestMaterials }) => {
    if (!formData.id) {
        const response = await materialsStore.createMaterialTest(materialId, formData)
        if (response.status === 201) {
            // await materialsStore.getMaterials(apiParams.value);
            addSuccess('Material test successfully created');
            showModal.value = false;
        }
    }
}
</script>

<style lang="scss" scoped></style>