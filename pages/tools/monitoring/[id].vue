<template>
	<main>
		<section class="card flex justify-between items-center">
			<div class="flex align-items-center">
				<UButton to="/tools/monitoring" size="xs" variant="solid">
					<template #leading>
						<ArrowLeftIcon class="text-purple h-4 w-4" />
					</template>
				</UButton>
				<h1 class="font-semibold text-lg ml-2">{{ carrier?.name || 'N/A' }}</h1>
			</div>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedDriver"
					placeholder="Driver search"
					searchable
					searchable-placeholder="Search a driver..."
					value-attribute="id"
					option-attribute="fullname"
					:options="[{fullname: 'All Drivers', id: 'all'}, ...drivers?.map(driver => ({fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id}))]"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
			</div>
		</section>
		<section class="grid grid-cols-4 items-start gap-x-3">
			<div class="mt-3 col-span-4">
				<UAccordion :items="monitorings" variant="solid" size="xl" :ui="{ wrapper: 'w-full flex flex-col' }">
					<template #item="{ item }">
						<UTable
							:rows="item.lastEvent"
							:columns="columns1"
							:ui="{
								strategy: 'override',
								wrapper: 'w-full bg-white dark:bg-dark-0 rounded-t-xl overflow-hidden',
								divide: 'divide-y divide-grey-border dark:divide-white/[.1]',
								thead: 'dark:bg-white/[.04] bg-purple/[.04]',
								tbody: '',
								tr: { base: 'relative group' }
							}"
						>
							<template #event-data="{ row }">
								<UBadge
									variant="outline"
									size="sm"
									class="ms-auto w-full flex justify-center uppercase"
									:ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
								>
									{{ getEventText(row.event?.eventType, row.event?.eventCode) }}</UBadge
								>
							</template>
							<template #truck-data="{ row }">
								<UButton block :ui="{ variant: { outline: 'ring-grey-border text-black hover:bg-transparent dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent' } }" variant="outline" size="xs" :label="row.truck || '&nbsp'" />
							</template>
							<template #break-data="{ row }">
								<UButton
									block
									:ui="{ variant: { outline: 'ring-grey-border text-black hover:bg-transparent dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent' } }"
									variant="outline"
									size="xs"
									:label="formatDuration(row.break) || '&nbsp'"
								/>
							</template>
							<template #drive-data="{ row }">
								<UButton
									block
									:ui="{ variant: { outline: 'ring-grey-border text-black hover:bg-transparent dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent' } }"
									variant="outline"
									size="xs"
									:label="formatDuration(row.drive) || '&nbsp'"
								/>
							</template>
							<template #shift-data="{ row }">
								<UButton
									block
									:ui="{ variant: { outline: 'ring-grey-border text-black hover:bg-transparent dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent' } }"
									variant="outline"
									size="xs"
									:label="formatDuration(row.shift) || '&nbsp'"
								/>
							</template>
							<template #cycle-data="{ row }">
								<UButton
									block
									:ui="{ variant: { outline: 'ring-grey-border text-black hover:bg-transparent dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent' } }"
									variant="outline"
									size="xs"
									:label="formatDuration(row.cycle) || '&nbsp'"
								/>
							</template>
							<template #profile-data="{ row }">
								<UBadge
									v-if="row.profile"
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] text-purple uppercase dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0' } }"
									>YES</UBadge
								>
								<UBadge
									v-else
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-red-1/[.2] bg-red-1/[.1] text-red-1 uppercase dark:ring-red-0/[.2] dark:bg-red-0/[.1] dark:text-red-0' } }"
									>NO</UBadge
								>
							</template>
							<template #violation-data="{ row }">
								<UBadge
									v-if="row.violation"
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] text-purple uppercase dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0' } }"
									>YES</UBadge
								>
								<UBadge
									v-else
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-red-1/[.2] bg-red-1/[.1] text-red-1 uppercase dark:ring-red-0/[.2] dark:bg-red-0/[.1] dark:text-red-0' } }"
									>NO</UBadge
								>
							</template>
						</UTable>
						<UTable
							:rows="item.events"
							:columns="columns2"
							:ui="{
								strategy: 'override',
								wrapper: 'w-full bg-white border-t border-grey-border dark:border-white/[.1] dark:bg-dark-0 rounded-b-xl overflow-hidden',
								divide: 'divide-y divide-grey-border dark:divide-white/[.1]',
								thead: 'dark:bg-white/[.04] bg-purple/[.04]',
								tbody: '',
								tr: { base: 'relative group' }
							}"
						>
							<template #event-data="{ row }">
								<UBadge
									variant="outline"
									size="sm"
									class="ms-auto w-full flex justify-center uppercase"
									:ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] text-purple uppercase dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0' } }"
								>
									{{ getEventText(row.event?.eventType, row.event?.eventCode) }}</UBadge
								>
							</template>
							<template #error-data="{ row }">
								<UBadge
									v-if="row.error === 'error'"
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-red-1/[.2] bg-red-1/[.1] text-red-1 dark:ring-red-0/[.2] dark:bg-red-0/[.1] dark:text-red-0 uppercase' } }"
									>{{ row.error }}</UBadge
								>
								<UBadge
									v-else
									variant="outline"
									size="sm"
									class="w-full flex justify-center max-w-[120px]"
									:ui="{ variant: { outline: 'ring-green-2/[.2] bg-green-2/[.1] text-green-2 dark:bg-green-1/[.1] dark:text-green-1 dark:ring-green-1/[.2] uppercase' } }"
									>{{ row.error }}</UBadge
								>
							</template>
						</UTable>
						<!--						<UPagination-->
						<!--							class="mt-5"-->
						<!--							:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"-->
						<!--							:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"-->
						<!--							:total="100"-->
						<!--							v-model="selectedNavigation"-->
						<!--							show-first-->
						<!--							show-last-->
						<!--							:ui="{-->
						<!--					wrapper: 'mx-auto'-->
						<!--				}"-->
						<!--						/>-->
					</template>
					<template #default="{ item, index, open }">
						<UButton
							color="gray"
							variant="ghost"
							class="mb-1.5 flex w-full focus-visible:ring-0 focus-visible:outline-none rounded-xl bg-white dark:bg-dark-0 hover:bg-white dark:hover:bg-dark-0 h-12"
							:ui="{ rounded: 'rounded-lg', padding: { sm: 'p-3' } }"
						>
							<template #leading>
								<UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 ml-0 transform transition-transform duration-200 shrink-0" :class="[open && 'rotate-90']" />
							</template>
							<span class="truncate">{{ index + 1 }}. {{ item.driver }}</span>
							<template #trailing>
								<UBadge variant="outline" size="md" class="ms-auto" :ui="{ variant: { outline: 'ring-green-2/[.2] bg-green-2/[.1] text-green-2 dark:ring-green-1/[.2] dark:bg-green-1/[.1] dark:text-green-1 uppercase shrink-0' } }"
									>NUMBER OF WARNINGS: {{ item.warningEvents }}</UBadge
								>
								<UBadge variant="outline" size="md" :ui="{ variant: { outline: 'ring-red-1/[.2] bg-red-1/[.1] text-red-1 dark:ring-red-0/[.2] dark:bg-red-0/[.1] dark:text-red-0 uppercase shrink-0' } }"
									>NUMBER OF ERRORS: {{ item.errorEvents }}</UBadge
								>
								<UBadge v-if="item.mostCommon" variant="outline" size="md" :ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] text-purple dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 uppercase line-clamp-1' } }">
									MOST COMMON: {{ item.mostCommon.length > 50 ? item.mostCommon.slice(0, 50) + '...' : item.mostCommon }}
								</UBadge>
							</template>
						</UButton>
					</template>
				</UAccordion>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import ArrowLeftIcon from '~/assets/icons/arrow-left.svg';

// importing composables
import { useToolsMonitoringId } from '~/composables/pages/tools/monitoring/id.ts';
const { selectedDriver, drivers, monitorings, columns1, rows1, rows2, columns2, selectedNavigation, carrier } = await useToolsMonitoringId();
</script>
