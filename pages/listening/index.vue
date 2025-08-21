<template>
	<main>
		<AudioUpload v-model="statusModal" @upload="handleFileUpload" :loading="audioUpload"/>
		<section class="card flex justify-between items-center">
			<h1 class="title">Listening</h1>
			<UButton variant="ghost" @click="statusModal = true">Open Modal</UButton>
			<UInput class="min-w-[264px]" v-model="search" :ui="{
				base: 'placeholder:font-medium',
				rounded: 'rounded-lg',
				color: { white: { outline: 'shadow-none ring-grey-border' } }
			}" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="lg" placeholder="Search listening" />
		</section>
		<section class="grid grid-cols-12 gap-x-1.5 mt-1.5">
			<!-- Your content here -->
		</section>
	</main>
</template>

<script setup>
import AudioUpload from '~/components/modal/AudioUpload.vue';
import { useListeningComposable } from '~/composables/pages/listening';

const { audioUpload, statusModal, handleFileUpload } = await useListeningComposable()
</script>