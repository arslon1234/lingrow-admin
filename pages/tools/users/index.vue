<template>
	<main>
		<UModal v-model="userModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Add user</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="userModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateUser" :state="formUser" @submit.prevent="submitUserForm">
					<div class="w-full space-y-6">
						<UFormGroup label="Select roles" name="groups">
							<USelectMenu
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								size="lg"
								v-model="formUser.roleId"
								placeholder="Select a role"
								value-attribute="id"
								option-attribute="name"
								:options="groups"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="First Name" name="firstName">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="formUser.firstName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Last Name" name="lastName">
							<FormInput type="text" :error="error" placeholder="Doe" v-model="formUser.lastName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Username" name="username">
							<FormInput type="text" :error="error" placeholder="Username" v-model="formUser.username" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Password" name="password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.password" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Confirm password" name="confirm_password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.confirm_password" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="userModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton
								:disabled="isUserFormDisabled"
								:loading="loading"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Save"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="actionModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title text-sm">Edit Status</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
									 class="-my-1" @click="actionModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you really want to {{ !userActive ? 'enable' : 'disable' }} ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="actionModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
					/>
					<UButton :loading="loading" :disabled="loading" @click="submitStatusUser" class="w-28 justify-center" size="xl" :label="!userActive ? 'Enable' : 'Disable'" variant="solid"
									 :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">Users</h1>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedDriver"
					placeholder="Driver search"
					searchable
					searchable-placeholder="Search a driver..."
					:options="['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5']"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<USelectMenu
					size="md"
					v-model="selectedStatus"
					placeholder="Select status"
					value-attribute="value"
					option-attribute="label"
					:options="[
						{ label: 'All', value: 'all' },
						{ label: 'Active', value: 'active' },
						{ label: 'InActive', value: 'inactive' }
					]"
					:ui="{ wrapper: 'w-36', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UButton @click="userModal = true" size="sm" variant="solid" label="Add user">
					<template #leading>
						<PlusCircleIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
			<UTable
				:columns="columns"
				:rows="rows"
				@select="tableRowSelect"
				:ui="{
					tbody: 'divide-y divide-grey-border dark:divide-white/[0.1]',
					divide: 'divide-y divide-grey-border dark:divide-white/[0.1]',
					wrapper: 'flex-1',
					base: (!rows?.length && 'h-full') || 'h-auto'
				}"
			>
				<template #action-data="{ row }">
					<p v-if="row.action" class="font-medium text-purple dark:text-dark-icon-0 flex items-center gap-x-2">
						<WifiIcon />
						Online
					</p>
					<p v-else class="font-medium text-grey-0 dark:text-white/[.5] flex items-center gap-x-2">
						<WifiOffIcon />
						Offline
					</p>
				</template>
				<template #work-data="{ row }">
					<div class="flex items-center gap-x-4">
						<UButton disabled class="px-4" size="sm" variant="soft" :ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-dark-icon-0/[.1] hover:bg-purple/[.06] dark:hover:bg-dark-icon-0/[.2] text-purple' } }">
							<template #leading>
								<EditIcon class="text-purple dark:text-dark-icon-0 w-4" />
							</template>
						</UButton>
						<UToggle @click.stop="statusUser(row.id)" size="md" :model-value="row.action" />
					</div>
				</template>
			</UTable>
			<UPagination
				v-if="providerUsersTotal > 1"
				class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="providerUsersTotal"
				:page-count="pageSize"
				v-model="selectedNavigation"
				show-first
				show-last
				:ui="{
					wrapper: 'mx-auto'
				}"
			/>
		</section>
	</main>
</template>

<script setup>
// importing icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';
import EditIcon from '~/assets/icons/edit-01.svg';
import WifiIcon from '~/assets/icons/wifi.svg';
import WifiOffIcon from '~/assets/icons/wifi-off.svg';

// importing composable
import { useToolsUsers } from '~/composables/pages/tools/users/index';
const {
	actionModal,
	loading,
	selectedDriver,
	selectedStatus,
	userModal,
	selectedNavigation,
	pageSize,
	formUser,
	validateUser,
	tableRowSelect,
	columns,
	rows,
	groups,
	submitUserForm,
	providerUsersTotal,
	isUserFormDisabled,
	statusUser,
	submitStatusUser,
	userActive
} = await useToolsUsers();
</script>
