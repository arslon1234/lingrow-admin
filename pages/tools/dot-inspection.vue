<template>
	<main>
		<UModal v-model="createDotModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title text-sm">Create Dot</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
									 class="-my-1" @click="createDotModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateDot" :state="dotForm" @submit="createDotInspection">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Block date" name="date">
							<TheDatePicker v-model="dotForm.date">
								<UButton
									block
									variant="outline"
									size="lg"
									:ui="{
							variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
							icon: { base: 'bg-grey-2' }
						}"
								>
									<template #trailing>
										<CalendarIcon class="text-grey-2 dark:text-white/[.3] w-5 ml-auto" />
									</template>
									{{ dayjs(dotForm.date.at(0)).format('DD/MM/YYYY') }}
									<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
									{{ dayjs(dotForm.date.at(-1)).format('DD/MM/YYYY') }}
								</UButton>
							</TheDatePicker>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Company" name="company">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search a company..."
								v-model="dotForm.company"
								placeholder="Select company"
								value-attribute="id"
								option-attribute="name"
								:options="carriers"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Driver" name="driver">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search driver..."
								v-model="dotForm.driver"
								placeholder="Select driver"
								value-attribute="id"
								option-attribute="fullname"
								:options="drivers?.map(driver => ({fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id}))"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							label="Description"
							name="description"
							:ui="{
								error: 'top-[95%]'
							}"
						>
							<UTextarea :rows="4" v-model="dotForm.description" size="sm" variant="outline"
												 placeholder="Description..." :ui="formInputStyle" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="createDotModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton :loading="loading" :disabled="loading" type="submit" class="w-28 justify-center" size="xl" label="Create" variant="solid"
											 :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="actionModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title text-sm">Dot Inspection</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
									 class="-my-1" @click="actionModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you really want to {{ actionDelete ? 'delete' : dotInspection?.status === 1 ? 'enable' : 'disable' }} ?</h3>
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
					<UButton :loading="loading" :disabled="loading" @click="submitAction" class="w-28 justify-center" size="xl" :label="actionDelete ? 'Delete' : dotInspection?.status === 1 ? 'Enable' : 'Disable'" variant="solid"
									 :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title">Dot Inspection</h1>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedCompany"
					placeholder="Company search"
					searchable
					searchable-placeholder="Search a company..."
					value-attribute="id"
					option-attribute="name"
					:options="carriers"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<USelectMenu
					size="md"
					v-model="selectedDriver"
					@change="changingHeaders"
					placeholder="Driver search"
					searchable
					searchable-placeholder="Search a driver..."
					value-attribute="id"
					option-attribute="fullname"
					:options="drivers?.map(driver => ({fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id}))"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UTabs @change="tabsChanged" v-model="selectedTab" :items="[{ label: 'All', value: 0 }, { label: 'Enabled', value: 1 }, { label: 'Disabled', value: 2 }, ]"
							 :ui="{ list: { tab: { padding: 'py-1.5' } } }" />
				<UButton @click="createDotModal = true" size="sm" variant="solid" label="Create" />
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
			<UTable :columns="columns" :ui="{wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto'}" :rows="rows">
				<template #status-data="{ row }">
					<UBadge v-if="row.status" size="sm" variant="soft"
									:ui="{ variant: { soft: 'bg-grey-2/[.2] text-grey-0 ring-1 ring-grey-2/[.5]' } }"> Disabled
					</UBadge>
					<UBadge v-else size="sm" variant="soft"
									:ui="{ variant: { soft: 'bg-purple/[.15] text-purple ring-1 ring-purple' } }"> Enabled
					</UBadge>
				</template>
				<template #action-data="{ row }">
					<div class="flex gap-x-2.5 items-center">
						<UButton @click="openActionsModal('switch', row.id)" size="sm" variant="soft" title="enable/disable"
										 :ui="{ variant: { soft: 'bg-purple/[.2] hover:bg-purple/[.4] text-purple dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4]' } }">
							<template #leading>
								<PowerIcon class="text-purple h-5 w-5 dark:text-dark-icon-0" />
							</template>
						</UButton>
						<UButton @click="openActionsModal('delete', row.id)" size="sm" variant="soft" title="delete"
										 :ui="{ variant: { soft: 'bg-red-0/[.2] hover:bg-red-0/[.4] text-red-0 dark:bg-red-0/[.2] dark:hover:bg-red-0/[.4]' } }">
							<template #leading>
								<TrashIcon class="text-red-0 w-5" />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination
				class="mt-3"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="dotInspectionsTotal || 1"
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
import CalendarIcon from '~/assets/icons/calendar.svg';
import TrashIcon from '~/assets/icons/trash-03.svg';
import PowerIcon from '~/assets/icons/power-02.svg';

// importing composables
import { useToolsDot } from '~/composables/pages/tools/dot-inspection';
import dayjs from 'dayjs';
import ArrowRightIcon from 'assets/icons/arrow-right.svg';

const {
	loading,
	selectedCompany,
	selectedDriver,
	selectedTab,
	createDotModal,
	actionModal,
	dotForm,
	validateDot,
	selectedNavigation,
	columns,
	rows,
	dotInspectionsTotal,
	carriers,
	drivers,
	createDotInspection,
	changingHeaders,
	tabsChanged,
	openActionsModal,
	actionSwitch,
	actionDelete,
	submitAction,
	dotInspection
} = await useToolsDot();
</script>
