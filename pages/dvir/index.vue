<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">DVIR</h1>
			<div class="flex items-center gap-x-3">
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton
						variant="outline"
						size="sm"
						:ui="{
							variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
							icon: { base: 'bg-grey-2' }
						}"
					>
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
					</UButton>
				</TheDatePicker>
				<USelectMenu size="md" v-model="selectedDriver" placeholder="Select driver" searchable
					searchable-placeholder="Search a driver..." value-attribute="id" :option-attribute="`fullname`" :options="[{ id: 'all', fullname: 'All Drivers' }, ...drivers?.map(driver => { return { id: driver.id, fullname: `${driver.user.firstName} ${driver.user.lastName}`}})]" :ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
				<USelectMenu size="md" v-model="selectedVehicle" placeholder="Select vehicle" searchable
					searchable-placeholder="Search a vehicle..." value-attribute="id" option-attribute="unit" :options="[{ id: 'all', unit: 'All Vehicles' }, ...(vehicles || [])]" :ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
				<UButton size="sm" variant="solid" label="Download">
					<template #leading>
						<DownloadIcon class="text-white" />
					</template>
				</UButton>
				<UButton @click="navigateTo('/dvir/add')" size="sm" variant="solid" label="Add DVIR">
					<template #leading>
						<PlusIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="mt-3">
			<div class="table_config">
				<UTable :columns="columns" :rows="rows">
					<template #defects-data="{ row }">
						<p v-if="row.defects" class="font-medium text-sm">{{ row.defects }}</p>
						<p v-else class="font-medium text-sm">...</p>		
					</template>
					<template #action-data="{ row }">
						<div class="flex items-center gap-x-2.5">
							<UButton @click.stop="navigateTo(`/dvir/${row.id}`)" size="sm" variant="soft"
								:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0 text-purple' } }">
								<template #leading>
									<EditIcon class="text-purple dark:text-dark-icon-0 w-4" />
								</template>
							</UButton>
							<TheConfirmation :position="'top-end'" :arrow="true" @confirm="removeDvir(row.id)">
								<UButton size="sm" variant="soft"
									:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] dark:bg-red-0/[.2] dark:hover:bg-red-0/[.4] dark:text-red-0 text-purple' } }">
									<template #leading>
										<TrashIcon class="text-purple dark:text-red-0" />
									</template>
								</UButton>
							</TheConfirmation>
						</div>
					</template>
				</UTable>
				<UPagination v-if="rows.length > 10" class="mt-5"
					:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
					:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
					:total="totalCount" v-model="selectedNavigation" show-first show-last :ui="{
						wrapper: 'mx-auto'
					}" />
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import CalendarIcon from '~/assets/icons/calendar.svg';
import DownloadIcon from '~/assets/icons/download-02.svg';
import EditIcon from '~/assets/icons/edit-01.svg';
import PlusIcon from '~/assets/icons/plus.svg';
import TrashIcon from '~/assets/icons/trash-02.svg';
import { useDvirComposable } from '~/composables/pages/dvir';

const {
	totalCount,
	drivers,
	vehicles,
	headerDate,
	selectedDriver,
	selectedVehicle,
	selectedNavigation,
	columns,
	rows,
	removeDvir
} = await useDvirComposable();
</script>
