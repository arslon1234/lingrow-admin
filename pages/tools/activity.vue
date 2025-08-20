<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">Activity</h1>
			<div class="flex items-center gap-x-3">
				<USelectMenu size="md" v-model="selectedCompany" placeholder="Carrier search" searchable
										 searchable-placeholder="Search a carrier..." value-attribute="id" option-attribute="name"
										 :options="carriers && carriers.length ? [{ id: '', name: 'All' }, ...carriers] : [{ id: '', name: 'All' }]"
										 :ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
				<USelectMenu size="md" v-model="selectedDriver" placeholder="Driver search" searchable
										 searchable-placeholder="Search a driver..." value-attribute="id" option-attribute="name"
										 :options="drivers && drivers.length ? [{ id: '', name: 'All' }, ...drivers.map(driver => ({ id: driver.id, name: driver.user.firstName + ' ' + driver.user.lastName }))] : [{ id: '', name: 'All' }]"
										 :ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
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
						{{ dayjs(headerDate.at(0)).format('DD/MM/YYYY') }}
						<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
						{{ dayjs(headerDate.at(-1)).format('DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<UTabs v-model="selectedTab" :items="[{ label: 'AI' }, { label: 'Booster' }, { label: 'All' }]"
							 :ui="{ list: { tab: { padding: 'py-1.5' } } }" />
				<UButton @click="loadActivities" size="sm" variant="solid" label="Load" />
			</div>
		</section>
		<transition name="fade" mode="out-in">
			<section v-if="isActivityLoaded" class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
				<UTable :columns="columns" :rows="rows"
								:ui="{wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto'}">
					<template #duration-data="{ row }">
						<UBadge size="sm" variant="soft"
										:ui="{ variant: { soft: 'bg-purple/[.15] text-purple ring-1 ring-purple' } }">
							{{ row.duration }}
						</UBadge>
					</template>
					<template #tool-data="{ row }">
						{{ SessionType[row.tool] }}
					</template>
					<template #action-data="{ row }">
						<UButton @click="rowSelect(row)" size="sm" variant="soft"
										 :ui="{ variant: { soft: 'bg-purple/[.2] text-purple hover:bg-purple/[.4] dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0' } }">
							<template #leading>
								<ClockIcon class="text-purple dark:text-dark-icon-0 h-5 w-5" />
							</template>
						</UButton>
					</template>
				</UTable>
				<UPagination v-if="totalCount > 1" class="mt-5"
										 :first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
										 :last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
										 :total="totalCount" :page-count="pageSize" v-model="selectedNavigation" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}" />
			</section>
		</transition>
	</main>
</template>

<script setup>
// importing icons
import ArrowRightIcon from '~/assets/icons/arrow-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import ClockIcon from '~/assets/icons/clock-rewind.svg';

// importing packages
import dayjs from 'dayjs';

// importing composables
import { useToolsActivity } from '~/composables/pages/tools/activity';

const {
	rowSelect,
	updateHeaderDate,
	drivers,
	carriers,
	isActivityLoaded,
	loadDrivers,
	loadActivities,
	headerDate,
	selectedCompany,
	selectedDriver,
	selectedTab,
	selectedNavigation,
	pageSize,
	totalCount,
	columns,
	rows
} = await useToolsActivity();
</script>
