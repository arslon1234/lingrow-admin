<template>
	<main>
		<section class="card flex items-center justify-between">
			<h1 class="title text-lg">Company Edit</h1>
			<div class="flex gap-3">
				<UButton size="sm" label="Cancel" @click="cancel"  class="dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]"/>
				<UButton size="sm" label="Save" @click="submitEdit" />
			</div>
		</section>
		<CarrierForm />
	</main>
</template>

<script setup>
// importing composables
import { useCarrierEdit } from '~/composables/pages/carrier/edit';

// importing stores
import { useCarrierStore } from '~/store/carrier';

const router = useRouter();
const { resetForm, formCreate } = await useCarrierEdit();

const carrierStore = useCarrierStore();

const cancel = () => {
	resetForm();
	router.back();
};

const submitEdit = async () => {
	// Use formCreate directly instead of creating a deep copy
	await carrierStore.updateCarrier(formCreate, getCarrierId());

	resetForm();
	router.back();
};
</script>