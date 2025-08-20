<template>
	<main>
		<UModal v-model="groupModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">
						{{ editGroupModal ? 'Edit Group' : 'Add Group' }}
					</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="closeGroupModal" />
				</div>
				<UDivider />
				<UForm :validate="validateGroup" :state="groupForm" @submit="() => console.log('123')">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Name" name="name">
							<UInput size="lg" searchable v-model="groupForm.name" placeholder="Name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Select type" name="type">
							<USelectMenu size="lg" searchable searchable-placeholder="Search driver..." v-model="groupForm.type"
								placeholder="Select Group"
								:options="[{ type: 1, name: RoleType[1] }, { type: 2, name: RoleType[2] }, { type: 3, name: RoleType[3] }, { type: 4, name: RoleType[4] }, { type: 5, name: RoleType[5] }, { type: 6, name: RoleType[6] }]" value-attribute="type"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Select group" name="groupId">
							<USelectMenu multiple size="lg" searchable searchable-placeholder="Search driver..."
								v-model="groupForm.permissions" placeholder="Select Group" :options="permissionsGroups"
								value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="closeGroupModal" class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl" label="Cancel"
								variant="solid" :ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
							<UButton :disabled="isAddOrUpdateGroupDisabled" :loading="loading" @click="updateOrAddGroup" type="submit"
								class="w-28 justify-center" size="xl" :label="editGroupModal ? 'Edit' : 'Create'" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="deleteModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Groups</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="deleteModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white">Do you really want to delete ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton @click="deleteModal = false" class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl" label="Cancel"
						variant="solid" :ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
					<UButton :disabled="loading" :loading="loading" @click="deleteGroup" class="w-28 justify-center" size="xl"
						label="Delete" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title">Roles</h1>
			<div class="flex items-center gap-x-3">
				<UButton @click="openAddGroupModal" class="w-20 justify-center" size="sm" variant="solid" label="Add">
					<template #leading>
						<PlusCircleIcon class="text-white " />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="rows">
				<template #permissions-data="{ row }">
					<UDropdown
						:items="[row.permissions?.map((permission, ind) => ({ label: permission.name, count: ind + 1 }))]"
						:popper="{ placement: 'bottom-start', arrow: true }"
						:ui="{ divide: 'divide-none', width: 'w-fit', height: 'max-h-[300px]', rounded: 'rounded-lg', background: 'dark:bg-dark-2', ring: 'dark:ring-white/[.1]', padding: 'p-0', arrow: { background: 'dark:before:bg-dark-2 dark:before:ring-white/[.2]' }, item: { active: '', inactive: 'bg-white dark:bg-dark-2 duration-200' } }"
					>
						<UButton class="ml-4" variant="soft" size="xs" :label="`${row.permissions?.length}`" :ui="{ variant: { soft: 'bg-purple/[.2] dark:bg-dark-icon-0/[.2] text-dark-icon-0 dark:hover:bg-dark-icon-0/[.4] hover:bg-purple/[.4] text-purple' } }" />
						<template #item="{ item }">{{ item.count }}. {{ item.label }}</template>
					</UDropdown>
				</template>
				<template #action-data="{ row }">
					<div class="flex gap-x-2.5 items-center">
						<UButton @click="openEditGroupModal(row)" size="sm" variant="soft"
							:ui="{ variant: { soft: 'bg-purple/[.2] dark:bg-dark-icon-0/[.2] hover:bg-purple/[.4] dark:hover:bg-dark-icon-0/[.4] text-purple dark:text-dark-icon-0' } }">
							<template #leading>
								<EditIcon class="text-purple dark:text-dark-icon-0" />
							</template>
						</UButton>
						<UButton @click="() => openDeleteGroupModal(row)" size="sm" variant="soft"
							:ui="{ variant: { soft: 'bg-red-0/[.2] hover:bg-red-0/[.4] text-red-0 dark:bg-red-0/[.2] dark:hover:bg-red-0/[.4]' } }">
							<template #leading>
								<TrashIcon class="text-red-0" />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination v-if="groupsTotal > pageSize" class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:page-count="pageSize" :total="groupsTotal" v-model="currentPage" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}" />
		</section>
	</main>
</template>

<script setup>
// importing icons
import EditIcon from '~/assets/icons/edit-02.svg';
import TrashIcon from '~/assets/icons/trash-02.svg';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';

// importing composables
import { useGroups } from '~/composables/pages/user-manager/roles.ts';

const {
	loading,
	isAddOrUpdateGroupDisabled,
	groupModal,
	editGroupModal,
	openAddGroupModal,
	openEditGroupModal,
	openDeleteGroupModal,
	closeGroupModal,
	updateOrAddGroup,
	validateGroup,
	permissionsGroups,
	groupsTotal,
	currentPage,
	pageSize,
	groupForm,
	deleteModal,
	columns,
	rows,
	deleteGroup } = await useGroups();
</script>
