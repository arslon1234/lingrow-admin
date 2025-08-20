<template>
	<main>
		<UModal v-model="reassignModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Reassign logs to the driver</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="reassignModal = false" />
				</div>
				<UDivider />
				<div class="space-y-2">
					<UInput
						@input="debouncedInput"
						v-model="searchDriver"
						:ui="{
							padding: { xl: 'px-3 py-2' },
							rounded: 'rounded-lg',
							color: { white: { outline: 'shadow-none ring-grey-border dark:ring-white/[.1]' } }
						}"
						color="white"
						icon="i-heroicons-magnifying-glass-20-solid"
						size="xl"
						placeholder="Select Driver"
					/>
					<ul v-if="driverListFiltered.length" class="border max-h-60 overflow-y-auto rounded-lg border-grey-border dark:border-white/[0.1]">
						<li
							@click="selectReassignedDriver(driver.id)"
							v-for="(driver, i) in driverListFiltered"
							:key="i"
							:style="{ backgroundColor: selectedDriver === driver.id ? 'rgba(70, 90, 149, 0.1)' : '' }"
							class="border-b border-grey-border last:border-b-0 py-2 px-4 duration-200 first:rounded-t-lg last:rounded-b-lg hover:bg-purple/[.04] cursor-pointer flex items-center justify-between dark:border-white/[0.1]"
						>
							{{ driver.user.firstName }} {{ driver.user.lastName }}
							<UIcon v-if="selectedDriver === driver.id" name="i-heroicons-check" class="text-purple" />
						</li>
					</ul>
					<div v-else class="border rounded-lg py-2 px-4 flex items-center justify-center min-h-40 font-bold uppercase">no data</div>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="reassignModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0' } }"
					/>
					<UButton
						@click="submitReassignDriver"
						:loading="loading"
						:disabled="loading || !selectedDriver"
						class="min-w-28 w-fit justify-center"
						size="xl"
						label="Send"
						variant="solid"
						:ui="{ rounded: 'rounded-lg' }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="statusModal" :ui="{ base: 'sm:!max-w-[520px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Select the type of driving status to claim</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="statusModal = false" />
				</div>
				<UDivider />
				<div class="space-y-4">
					<div
						@click="selectedStatus = radio.value"
						v-for="radio in events
							.filter((event) => event.key === 'pc' || event.key === 'ym' || event.key === 'driving')
							.map((filteredEvent) => ({ value: filteredEvent.key, label: filteredEvent.label }))"
						:key="radio.value"
						:class="[selectedStatus === radio.value && 'bg-purple/[.1]']"
						class="rounded-lg border border-grey-border py-2 px-3 cursor-pointer bg-black-0/[.04] hover:bg-black-0/[.06] dark:border-white/[.1] dark:bg-white/[.04] duration-200"
						:uiRadio="{ label: 'text-lg text-black' }"
					>
						<URadio v-model="selectedStatus" v-bind="radio" />
					</div>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="statusModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.5]' } }"
					/>
					<UButton
						:loading="loading"
						:disabled="loading || !selectedStatus"
						@click="submitSelectDrivingStatus"
						class="min-w-28 w-fit justify-center"
						size="xl"
						label="Done"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'dark:bg-dark-button-1 dark:hover:bg-dark-button-1/[.8]' } }"
					/>
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title">Unassigned</h1>
			<div class="flex items-center gap-x-3">
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton
						variant="outline"
						size="sm"
						:ui="{
							variant: { outline: 'tracking-wide ring-grey-border !font-medium text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] px-3 gap-x-2 tracking-wider' },
							icon: { base: 'bg-grey-2' }
						}"
					>
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
						{{ formatTime(headerDate, 'DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<USelectMenu
					size="md"
					v-model="selectedVehicle"
					placeholder="Select vehicle"
					searchable
					searchable-placeholder="Search a vehicle..."
					option-attribute="unit"
					value-attribute="id"
					:options="[{ unit: 'All Vehicles', id: 'all' }, ...(vehicles || [])]"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UButton :disabled="!selectedRows.length" @click="reassignModal = true" class="px-4" size="sm" variant="solid" label="Assign" />
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
			<UTable
				@select="tableRowSelect"
				v-model="selectedRows"
				:columns="columns"
				:rows="rows"
				:ui="{ td: { padding: 'py-2.5' }, wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto' }"
			>
				<template #event-data="{ row }">
					<TheEvent v-if="row.event.eventCode && row.event.eventType" :eventCode="row.event.eventCode" :eventType="row.event.eventType" />
					<p v-else>Event not specified</p>
				</template>
				<template #action-data="{ row }">
					<div class="flex items-center justify-end">
						<UButton
							@click.stop="openSelectDrivingStatus(row.ids, row.count)"
							size="sm"
							variant="soft"
							:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] text-purple dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0' } }"
						>
							<template #leading>
								<EditIcon class="text-purple dark:text-dark-icon-0 w-4" />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination
				v-if="unidentifiedEventsTotal > 1"
				class="mt-2"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="unidentifiedEventsTotal"
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
import CalendarIcon from '~/assets/icons/calendar.svg';
import EditIcon from '~/assets/icons/edit-01.svg';

// importing composable
import { useUnassigned } from '~/composables/pages/unassigned';

const {
	loading,
	headerDate,
	selectedDriver,
	selectedVehicle,
	reassignModal,
	statusModal,
	selectedStatus,
	searchDriver,
	driverListFiltered,
	debouncedInput,
	selectedNavigation,
	pageSize,
	selectedRows,
	tableRowSelect,
	columns,
	rows,
	unidentifiedEventsTotal,
	drivers,
	vehicles,
	selectReassignedDriver,
	submitReassignDriver,
	submitSelectDrivingStatus,
	openSelectDrivingStatus
} = await useUnassigned();
</script>
