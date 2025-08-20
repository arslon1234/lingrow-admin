<template>
  <main>
    <section class="card flex justify-between items-center">
			<h1 class="title text-lg">DVIR Inspection</h1>
			<div class="flex gap-x-3 items-center">
				<TheConfirmation @confirm="removeDvir" :arrow="true">
					<UButton size="md" variant="solid" class="px-4" :ui="{variant: {solid: '!bg-red-1 hover:!bg-red-1/[.8]'}}">
						<template #leading>
							<TrashIcon class="text-white" />
						</template>
					</UButton>
				</TheConfirmation>
				<UButton @click="navigateTo('/dvir')" size="sm" variant="solid" label="Cancel" :ui="{variant: {solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.5]'}}" />
				<UButton :disabled="isEditDvirDisabled || loading" :loading="loading" @click="submitEditFormDvir" size="sm" variant="solid" label="Update" />
			</div>
		</section>
    <section class="mt-3 card">
      <DvirForm @mergeFormDvir="mergeFormDvir" :form="formDvir" v-model:isDvirDisabled="isEditDvirDisabled"/>
    </section>
  </main>
</template>

<script setup>
// importing icons
import TrashIcon from '~/assets/icons/trash-02.svg';

// importing composable
import { useDvirId } from '~/composables/pages/dvir/id';
const { formDvir, isEditDvirDisabled, loading, mergeFormDvir, removeDvir, submitEditFormDvir } = await useDvirId();
</script>