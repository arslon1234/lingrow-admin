<template>
	<div class="flex items-center justify-center min-h-dvh  dark:bg-dark-1	">
		<div class="w-[350px]">
			<h1 class="text-4xl font-bold text-center mb-6 text-brown">UNIONE</h1>
			<UForm :schema="LoginValidationSchema" :state="form" @submit="handleSubmit" class="p-6 bg-white rounded-2xl dark:bg-dark-0">
				<div class="space-y-6">
					<UFormGroup v-slot="{ error }" label="Username" name="username">
						<FormInput type="text" :error="error" placeholder="User06" v-model="form.username" size="xl" />
					</UFormGroup>

					<UFormGroup v-slot="{ error }" label="Password" name="password">
						<FormInput type="password" :error="error" placeholder="Password" v-model="form.password" size="xl" />
					</UFormGroup>

					<UDivider />
				</div>
				<UButton :disabled="isDisabled" :loading="loading" type="submit" block size="lg"
					:ui="{ button: { base: 'font-semibold', rounded: 'rounded-xl' } }" class="leading-snug"> Login </UButton>
			</UForm>
		</div>
	</div>
</template>

<script setup>
import { useLoginComposable } from '~/composables/pages/auth/login';
const { LoginValidationSchema, form, handleSubmit, loading, isDisabled } = await useLoginComposable();

definePageMeta({
	layout: 'auth'
});
</script>
