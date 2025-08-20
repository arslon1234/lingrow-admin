<template>
	<main class="h-[calc(100dvh-72px)] flex flex-col">
		<UModal v-model="statusModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ client.status ? 'Activated' : 'Deactivated' }}</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="statusModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you want to {{ !client.status ? 'activate' : 'deactiveate' }} ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="statusModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.05]' } }"
					/>
					<UButton :loading="loading" @click="submitStatus" class="min-w-28 justify-center" size="xl" :label="!client.status ? 'Activate' : 'Deactivate'" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<UModal v-model="manageClientModal" :ui="{ base: 'sm:!max-w-[850px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ client.edit ? 'Edit' : 'Add' }} Client</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="manageClientModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateClient" :state="formClient" @submit.prevent="submitClient">
					<div class="w-full grid grid-cols-2 gap-x-6">
						<div class="flex flex-col justify-between gap-y-4">
							<UFormGroup v-slot="{ error }" label="Client name" name="client_name">
								<FormInput type="text" :error="error" placeholder="Client name" v-model="formClient.client_name" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Phone number" name="phone_number">
								<FormInput type="text" :error="error" placeholder="Phone number" v-maska="'+1 (###) ###-####'" v-model="formClient.phone_number" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Email" name="email">
								<FormInput type="email" :error="error" placeholder="Email" v-model="formClient.email" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="First Name" name="first_name">
								<FormInput type="text" :error="error" placeholder="First Name" v-model="formClient.first_name" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Last Name" name="last_name">
								<FormInput type="text" :error="error" placeholder="Last Name" v-model="formClient.last_name" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="User Name" name="user_name">
								<FormInput type="text" :error="error" placeholder="User Name" v-model="formClient.user_name" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Password" name="password">
								<FormInput type="password" :error="error" placeholder="Password" v-model="formClient.password" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Edit" name="edit">
								<UButton
									@click="formClient.edit = !formClient.edit"
									class="justify-between"
									label="Edit all function"
									variant="outline"
									size="lg"
									block
									:ui="{ variant: { outline: 'ring-grey-border bg-black-0/[.04] hover:bg-black-0/[.06] text-black-2 dark:ring-white/[.2] dark:text-white/[.6] dark:bg-white/[0.05] dark:hover:bg-white/[0.1]' } }"
								>
									<template #trailing>
										<UToggle @click.stop size="md" v-model="formClient.edit" />
									</template>
								</UButton>
							</UFormGroup>
						</div>
						<UFormGroup v-slot="{ error }" label="Tools" name="tools">
							<ul class="w-full rounded-lg border border-grey-border dark:border-white/[0.2] dark:bg-white/[0.05]">
								<li
									@click="tool.value === 'all' ? toggleAll(!formClient.tools[tool.value]) : formClient.tools[tool.value] = !formClient.tools[tool.value]"
									v-for="(tool, i) in formTools"
									:key="i"
									class="px-3 py-3 first:rounded-t-lg last:rounded-b-lg cursor-pointer flex items-center justify-between border-grey-border border-b last:border-b-0 bg-black-0/[.04] hover:bg-black-0/[.06] dark:border-white/[0.2]"
								>
									<span class="text-sm font-semibold text-black-2 dark:text-white/[0.6]">{{ tool.label }}</span>
									<UToggle @change="(event) => tool.value === 'all' ? toggleAll(event) : null" @click.stop :id="tool.value" size="md" v-model="formClient.tools[tool.value]" />
								</li>
							</ul>
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="manageClientModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton :disabled="isDisabled" :loading="loading" type="submit" class="w-28 justify-center" size="xl" :label="client.edit ? 'Edit' : 'Save'" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="container mt-3">
			<div class="card flex items-center justify-between">
				<h1 class="title">Manage Client</h1>
				<div class="flex items-center gap-x-3">
					<USelectMenu
						placeholder="Select Company"
						size="sm"
						searchable
						searchable-placeholder="Search Company"
						v-model="selectedCompany"
						value-attribute="id"
						option-attribute="name"
						:options="[{ id: '', name: 'All' }, ...carriers]"
						:ui="{ base: 'w-48', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
					/>
					<USelectMenu
						placeholder="Select Work"
						size="sm"
						v-model="selectedStatus"
						value-attribute="value"
						:options="[
							{ label: 'All', value: 1 },
							{ label: 'Inactive', value: 2 },
							{ label: 'Active', value: 3 }
						]"
						:ui="{ base: 'w-32', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black ' } } }"
					/>
					<UButton @click="openManageClientModal('add')" variant="solid" size="sm" label="Add Client" />
				</div>
			</div>
		</section>
		<section class="container mt-3 flex-1">
			<div class="card px-0 h-full flex flex-col justify-between gap-y-5">
				<UTable :columns="columns" :rows="rows" :ui="{td: { base: '!font-medium' }, wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto' }">
					<template #work-data="{ row }">
						<span class="font-medium" :class="[row.work ? 'text-green-0 dark:text-green-1' : 'text-red-0 dark:text-red-1']">{{ row.work ? 'Active' : 'Inactive' }}</span>
					</template>
					<template #action-data="{ row }">
						<div class="flex items-center gap-x-2">
							<UButton
								@click="openManageClientModal('edit', row.id)"
								variant="soft"
								size="sm"
								:ui="{ variant: { soft: 'px-5 bg-background-purple_1/[.1] hover:bg-background-purple_1/[.2] dark:bg-background-purple_1/[.5] dark:hover:bg-background-purple_1/[.8]' } }"
							>
								<template #leading>
									<PencilIcon class="text-black-2" />
								</template>
							</UButton>
							<UToggle @click="openStatusModal(row.id, row.work)" size="md" :model-value="row.work" />
						</div>
					</template>
				</UTable>
				<UPagination
					v-if="providersTotal > 1"
					:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
					:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
					:total="providersTotal"
					:page-count="pageSize"
					v-model="selectedNavigation"
					show-first
					show-last
					:ui="{
						wrapper: 'mx-auto'
					}"
				/>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import PencilIcon from '~/assets/icons/edit-02.svg';

// importing composable
import { useClients } from '~/composables/pages/clients';
const {
	client,
	selectedCompany,
	selectedStatus,
	manageClientModal,
	statusModal,
	formClient,
	formTools,
	validateClient,
	columns,
	rows,
	providersTotal,
	selectedNavigation,
	pageSize,
	carriers,
	isDisabled,
	loading,
	toggleAll,
	submitClient,
	submitStatus,
	openStatusModal,
	openManageClientModal
} = await useClients();

// define layout
definePageMeta({
	layout: 'after-auth'
});
</script>
