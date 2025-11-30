<template>
    <main class="space-y-4">
        <!-- MODALS -->
        <ListeningBook v-model="showModal" :loading="isLoading" @submit="handleSubmitBook" />

        <!-- THE MAIN HEADER -->
        <TheMainHeader title="Listening Books" placeholder="Search listening book..."/>

        <section>
            <div class="flex items-center justify-between w-full">
                <div class="w-1/2">
                    <UTabs :items="BookTypes" value="key" v-model="bookTypeIndex" class="w-full">
                        <template #item="{ item }">
                            <p>{{ item.label }}</p>
                        </template>
                    </UTabs>
                </div>
                <UButton @click="openCreateModal" icon="i-heroicons-plus" class="shrink-0" size="lg">Create book
                </UButton>
            </div>
        </section>

        <!-- Reusable Table -->
        <TheTable :columns="columns" :rows="materials?.content || []" :loading="materialsStore?.isLoading"
            :search-keys="['title', 'materialType']" search-placeholder="Search books by title or type..." show-actions
            empty-icon="i-heroicons-book-open" empty-label="No books found"
            empty-description="Create your first book to get started" :page-size="10">

            <template #actions-column="{ row }">
                <div class="flex items-center gap-2">
                    <UButton icon="i-heroicons-pencil-square" size="sm" color="gray" variant="ghost"
                        @click="handleEdit(row)" />
                    <UButton icon="i-heroicons-eye" size="sm" color="gray" variant="ghost" @click="handleView(row)" />
                    <UButton icon="i-heroicons-trash" size="sm" color="red" variant="ghost"
                        @click="handleDelete(row)" />
                </div>
            </template>
        </TheTable>
    </main>
</template>

<script setup lang="ts">
import ListeningBook from '~/components/modal/ListeningBook.vue';
import TheMainHeader from '~/components/TheMainHeader.vue';
import TheTable from '~/components/TheTable.vue';
import { BookTypes } from '~/helpers/constants';
import { addSuccess } from '~/helpers/notification';
import { useMaterialsStore } from '~/store/materials';

const materialsStore = useMaterialsStore()
const { materials, isLoading } = storeToRefs(materialsStore)
console.log(materials)
const router = useRouter()
const route = useRoute()
const { setQueries, getQueryParams } = useQueryParams(route, router)
const showModal = ref(false);
const selectedBook = ref(null);
const bookTypeKey = ref(getQueryParams('bookType') || "MOCK_TEST")
const bookTypeIndex = ref(
    BookTypes.findIndex(i => i.key === bookTypeKey.value)
)
const params = computed<GetMaterialBookParams>(() => ({
    type: bookTypeKey.value,
    status: 'DRAFT'
}))

const columns: any = [
    { key: 'title', label: 'Book Title' },
    { key: 'materialType', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'actions', label: 'Actions' }
];

watch(bookTypeIndex, (index) => {
    const key = BookTypes[index]?.key
    if (!key) return

    bookTypeKey.value = key
    setQueries({ bookType: key })
    materialsStore.getMaterials(params.value)
})

function openCreateModal() {
    selectedBook.value = null;
    showModal.value = true;
}

async function handleSubmitBook({ formData }: { formData: ListeningBookData }) {
    const data = {
        ...formData,
        skillType: 'LISTENING',
        isStrictFormat: formData.materialType === 'MOCK_TEST'
    }
    if (!formData.id) {
        const response = await materialsStore.createMaterial(data)
        if (response.status === 201) {
            addSuccess('Material book successfully created')
            showModal.value = false
        }
    }
}

async function handleEdit(row: any) {

}
async function handleDelete(row: any) {

}
async function handleView(row: any) {

}

onMounted(() => {
    materialsStore.getMaterials(params.value)
})
</script>

<style lang="scss" scoped></style>



<!-- <template>
	<main>
		<AudioUpload v-model="statusModal" @upload="handleFileUpload" :loading="audioUpload" />
		<section class="card flex justify-between items-center sticky top-0 z-10">
			<h1 class="title">Listening</h1>
			<div class="flex items-center gap-3">
				<UButton variant="solid" size="sm" label="Upload Audio" @click="statusModal = true" />
				<UInput class="min-w-[264px]" v-model="search" :ui="{
					base: 'placeholder:font-medium',
					rounded: 'rounded-lg',
					color: { white: { outline: 'shadow-none ring-grey-border' } }
				}" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="lg" placeholder="Search listening" />
			</div>
		</section>
		<section class="main-layout mt-4">
			<QuestionComposer />
			<div class="w-full mt-4 grid grid-cols-12 gap-4">
				<QuestionComponents class="col-span-3 sticky top-64" />
				<QuestionLayout class="col-span-9" />
			</div>
		</section>
	</main>
</template>

<script setup>
import AudioUpload from '~/components/modal/AudioUpload.vue';
import QuestionComposer from '~/components/listening/QuestionComposer.vue';
import QuestionComponents from '~/components/listening/QuestionComponents.vue';
import QuestionLayout from '~/components/listening/QuestionLayout.vue';
import { useListeningComposable } from '~/composables/pages/listening';

const { audioUpload, statusModal, handleFileUpload } = await useListeningComposable()
</script> -->