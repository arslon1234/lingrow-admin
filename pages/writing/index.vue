<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Writing</h1>
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
				placeholder="Search writing"
			/>
		</section>
		<section class="grid grid-cols-12 gap-x-1.5 mt-1.5">
			
		</section>
	</main>
</template>

<script setup>


// importing composable
import { useOverview } from '~/composables/pages/overview';
const {
	// header search
	search,

} = await useOverview();
</script>
