<template>
	<main>
		<AudioUpload v-model="statusModal" @upload="handleFileUpload" :loading="audioUpload" />
		<section class="card flex justify-between items-center">
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
			<QuestionComposer/>
		</section>
	</main>
</template>

<script setup>
import AudioUpload from '~/components/modal/AudioUpload.vue';
import QuestionComposer from '~/components/listening/QuestionComposer.vue';
import { useListeningComposable } from '~/composables/pages/listening';

const { audioUpload, statusModal, handleFileUpload } = await useListeningComposable()
</script>