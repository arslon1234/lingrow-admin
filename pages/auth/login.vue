<template>
	<div class="flex items-center justify-center min-h-dvh dark:bg-dark-1">
		<div class="w-full max-w-md px-4">
			<div class="text-center mb-8">
				<h1 class="text-4xl font-bold text-brown mb-2">LINGROW ADMIN</h1>
				<p class="text-gray-600 dark:text-gray-400">Sign in to your account</p>
			</div>

			<UForm :schema="LoginValidationSchema" :state="form" @submit="handleSubmit"
				class="p-8 bg-white rounded-2xl shadow-lg dark:bg-dark-0">
				<div class="space-y-5">
					<!-- Phone Number Input -->
					<UFormGroup v-slot="{ error }" label="Phone Number" name="phoneNumber" required>
						<FormInput 
							type="tel" 
							:error="error" 
							placeholder="+998 90 123 45 67" 
							v-model="form.phoneNumber"
							size="xl" 
							icon="i-heroicons-phone"
							maxlength="13"
							@keypress="onlyNumbers"
							@keydown.enter="handleEnterKey"
							@paste="handlePaste"
						/>
						<template>
							<span class="text-xs text-gray-500">Enter your Uzbekistan phone number</span>
						</template>
					</UFormGroup>

					<!-- Temporary Password Input -->
					<UFormGroup v-slot="{ error }" label="Temporary Password" name="tempPassword" required>
						<FormInput 
							type="text" 
							:error="error" 
							placeholder="Enter 6-digit code"
							v-model="form.tempPassword" 
							size="xl" 
							icon="i-heroicons-key" 
							maxlength="6"
							@keypress="onlyNumbersPassword"
							@keydown.enter="handleEnterKey"
						/>
						<div class="flex items-center justify-between mt-2">
							<span class="text-xs text-gray-500">Get code from Telegram</span>
							<UButton :to="TELEGRAM_BOT_LINK" target="_blank" variant="link" size="xs"
								icon="i-mdi-telegram" :padded="false"
								class="text-purple-500 hover:text-purple-600 cursor-pointer">
								Open Bot
							</UButton>
						</div>
					</UFormGroup>

					<UDivider class="my-6" />

					<!-- Submit Button -->
					<UButton :disabled="isDisabled" :loading="loading" type="submit" block size="xl"
						icon="i-heroicons-arrow-right-on-rectangle" :ui="{
							button: {
								base: 'font-semibold transition-all duration-200',
								rounded: 'rounded-xl'
							}
						}" class="leading-snug">
						{{ loading ? 'Logging in...' : 'Login' }}
					</UButton>
				</div>
			</UForm>

			<!-- Footer Info -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Don't have a Telegram account?
					<UButton to="https://telegram.org" target="_blank" variant="link" size="sm" :padded="false"
						class="text-purple-500 hover:text-purple-600">
						Download Telegram
					</UButton>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useLoginComposable } from '~/composables/pages/auth/login';

const TELEGRAM_BOT_LINK = 'https://t.me/lingrowbot';

const { LoginValidationSchema, form, handleSubmit, loading, isDisabled } = await useLoginComposable();

const onlyNumbers = (event) => {
	const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
	
	if (allowedKeys.includes(event.key)) {
		return true;
	}
	
	if (!/^\d$/.test(event.key)) {
		event.preventDefault();
		return false;
	}
	
	const input = event.target;
	if (input.value.length >= 13) {
		event.preventDefault();
		return false;
	}
};

const onlyNumbersPassword = (event) => {
	const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
	
	if (allowedKeys.includes(event.key)) {
		return true;
	}
	
	if (!/^\d$/.test(event.key)) {
		event.preventDefault();
		return false;
	}
	
	const input = event.target;
	if (input.value.length >= 6) {
		event.preventDefault();
		return false;
	}
};

const handlePaste = (event) => {
	event.preventDefault();
	const pastedText = event.clipboardData?.getData('text') || '';
	
	const numbers = pastedText.replace(/\D/g, '');
	
	if (numbers) {
		let digits = numbers;
		if (digits.startsWith('998')) {
			digits = digits.slice(3);
		}
		form.phoneNumber = '+998' + digits.slice(0, 9);
	}
};

const handleEnterKey = (event) => {
	if (!isDisabled.value && !loading.value) {
		event.preventDefault();
		handleSubmit();
	}
};

definePageMeta({
	layout: 'auth'
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
