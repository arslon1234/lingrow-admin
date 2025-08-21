<template>
	<main>
		<FileUpload 
			v-model="statusModal"
			@upload="handleFileUpload"
		/>
		<section class="card flex justify-between items-center">
			<h1 class="title">Listening</h1>
			<UButton variant="ghost" @click="openModal">Open Modal</UButton>
			<UInput
				class="min-w-[264px]"
				v-model="search"
				:ui="{
					base: 'placeholder:font-medium',
					rounded: 'rounded-lg',
					color: { white: { outline: 'shadow-none ring-grey-border' } }
				}"
				color="white"
				icon="i-heroicons-magnifying-glass-20-solid"
				size="lg"
				placeholder="Search listening"
			/>
		</section>
		<section class="grid grid-cols-12 gap-x-1.5 mt-1.5">
			<!-- Your content here -->
		</section>
	</main>
</template>

<script setup>
import { ref } from 'vue';
import FileUpload from '~/components/modal/FileUpload.vue';

const statusModal = ref(false);

const openModal = () => {
	console.log('Opening modal');
	statusModal.value = true;
}

const handleFileUpload = () => {
	console.log('File upload handler called');
	// Bu yerda file upload logikasini yozing
}

// importing composable
import { useOverview } from '~/composables/pages/overview';
const {
	// header search
	search,
} = await useOverview();
</script>