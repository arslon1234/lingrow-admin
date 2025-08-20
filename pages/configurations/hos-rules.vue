<template>
	<main>
		<UModal v-model="hosRulesModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">
						{{ editHosRulesModal ? 'Edit Hos Rules' : 'Add Hos Rules' }}
					</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="closeHosRulesModal" />
				</div>
				<UDivider />
				<UForm :validate="validateHosRules" :state="hosRulesForm" @submit="() => console.log('123')">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Name" name="name">
							<UInput size="lg" searchable v-model="hosRulesForm.name" placeholder="Name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="closeHosRulesModal" class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl"
								label="Cancel" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
							<UButton :disabled="isAddOrUpdateHosRulesDisabled" :loading="loading" @click="updateOrAddHosRules"
								type="submit" class="w-28 justify-center" size="xl" :label="editHosRulesModal ? 'Edit' : 'Create'"
								variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="deleteModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Hos Rules</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="deleteModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you really want to delete ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton @click="deleteModal = false" class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl" label="Cancel"
						variant="solid" :ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
					<UButton :disabled="loading" :loading="loading" @click="deleteHosRules" class="w-28 justify-center" size="xl"
						label="Delete" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">Hos Rules</h1>
			<div class="flex items-center gap-x-3">
				<UButton @click="openAddHosRulesModal()" size="sm" variant="solid" label="Add" />
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="rows">
				<template #action-data="{ row }">
					<div class="flex gap-x-2.5 items-center">
						<UButton @click="openEditHosRulesModal(row)" size="sm" variant="soft"
							:ui="{ variant: { soft: 'bg-purple/[.2] hover:bg-purple/[.4] text-purple' } }">
							<template #leading>
								<EditIcon class="text-purple" />
							</template>
						</UButton>
						<UButton @click="() => openDeleteHosRulesModal(row)" size="sm" variant="soft"
							:ui="{ variant: { soft: 'bg-red-0/[.2] hover:bg-red-0/[.4] text-red-0' } }">
							<template #leading>
								<TrashIcon class="text-red-0" />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination v-if="hosRolesTotal > pageSize" class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:page-count="pageSize" :total="hosRolesTotal" v-model="currentPage" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}" />
		</section>
	</main>
</template>

<script setup>
// importing icons
import EditIcon from '~/assets/icons/edit-02.svg';
import TrashIcon from '~/assets/icons/trash-02.svg';

// importing composables
import { useHosRules } from '~/composables/pages/configurations/hos-rules';

const {
	loading,
	isAddOrUpdateHosRulesDisabled,
	hosRulesModal,
	editHosRulesModal,
	openAddHosRulesModal,
	openEditHosRulesModal,
	closeHosRulesModal,
	openDeleteHosRulesModal,
	updateOrAddHosRules,
	validateHosRules,
	hosRolesTotal,
	currentPage,
	pageSize,
	hosRulesForm,
	deleteModal,
	selectedNavigation,
	columns,
	rows,
	deleteHosRules, } = await useHosRules();
</script>
