<template>
    <main>
        <ListeningBook v-model="showModal" :loading="isLoading" @submit="handleSubmitBook" />
        <section class="card flex justify-between items-center sticky top-0 z-10">
            <h1 class="title">Listening Books</h1>
            <div class="flex items-center gap-3">
                <UInput class="min-w-[264px]" :ui="{
                    base: 'placeholder:font-medium',
                    rounded: 'rounded-lg',
                    color: { white: { outline: 'shadow-none ring-grey-border' } }
                }" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="lg"
                    placeholder="Search listening books" />
            </div>
        </section>
        <section class="main-layout mt-4 ">
            <div class="flex items-center justify-between w-full">
                <div class="w-1/2">
                    <UTabs :items="BookTypes" v-model="bookType" class="w-full">
                        <template #item="{ item }">
                            <p>{{ item.label }}</p>
                        </template>
                    </UTabs>
                </div>
                <UButton @click="openCreateModal" class="shrink-0" size="lg">Create book</UButton>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import ListeningBook from '~/components/modal/ListeningBook.vue';
import { BookTypes } from '~/helpers/constants';
import { addSuccess } from '~/helpers/notification';
import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

const router = useRouter()
const route = useRoute()
const { setQueries, getQueryParams } = useQueryParams(route, router)
const showModal = ref(false);
const isLoading = ref(false);
const selectedBook = ref(null);
const bookType = ref(getQueryParams('bookType') || 0)

watch(bookType, (value) => {
    setQueries({ bookType: value })
})

function openCreateModal() {
    selectedBook.value = null;
    showModal.value = true;
}

async function handleSubmitBook({ formData }: { formData: ListeningBookData }) {
    if(!formData.id){
        const res = await useAxios().postRequest(ApiUrls.MATERIALS, {...formData})
        if(res.status === 201){
            showModal.value = false
            addSuccess('Material successfully created')
        }
    }
}
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