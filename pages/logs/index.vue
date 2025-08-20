<template>
	<main id="logs">
		<section class="card flex justify-between items-center dark:bg-dark-0">
			<h1 class="title dark:text-white/[.8]">Logs</h1>
			<div class="flex items-center gap-x-3">
				<UInput
					class="min-w-[264px]"
					v-model="search"
					:ui="{
						 base: 'placeholder:font-medium',
						rounded: 'rounded-lg',
						color: { white: { outline: 'shadow-none ring-grey-border' } }
					}"
					color="white"
					icon="i-heroicons-magnifying-glass-20-solid"
					size="md"
					placeholder="Search truck no or name"
				/>
				<USelectMenu
					size="md"
					v-model="selectedEvent"
					value-attribute="code"
					option-attribute="label"
					:label="'Event'"
					:options="[
						{ label: 'All Events', code: 0 },
						{ label: 'Driving (DR)', code: 3 },
						{ label: 'Off duty (OFF)', code: 1 },
						{ label: 'Sleep (SB)', code: 2 },
						{ label: 'On duty (ON)', code: 4 },
						{ label: 'Off duty (YM)', code: 5 },
						{ label: 'Off duty (PC)', code: 6 }
					]"
					:ui="{ rounded: 'rounded-lg', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide' } }, base: 'w-48' }"
				/>
				<UButton
					@click="selectedViolation = !selectedViolation"
					label="Violation"
					variant="outline"
					size="md"
					:ui="{
						rounded: 'rounded-lg',
						variant: { outline: 'ring-grey-border text-black dark:ring-white/[.2] dark:bg-white/[.1] dark:hover:bg-white/[.15] tracking-wide dark:text-white/[.8]' }
					}"
				>
					<template #leading>
						<div
							:class="selectedViolation ? 'border-purple dark:border-dark-button-1 before:scale-100' : 'border-grey-1 before:scale-0'"
							class="w-3.5 h-3.5 border duration-100 rounded-full flex items-center justify-center before:bg-purple dark:before:bg-dark-button-1 before:rounded-full before:duration-100 before:w-2 before:h-2"
						></div>
					</template>
				</UButton>
				<UTabs v-model="selectedStatus" :items="[{ label: 'All' }, { label: 'Online' }, { label: 'Offline' }]" />
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-68px)]">
			<UTable
				:loading="loading"
				:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
				:progress="{ color: 'primary', animation: 'carousel' }"
				:columns="columns"
				:ui="{
					wrapper: 'flex-1',
					base: filteredDriverLogs?.length ? 'h-auto' : 'h-full',
					td: {
						base: '!font-medium'
					}
				}"
				:rows="filteredDriverLogs"
				@select="tableRowSelect"
				class="dark:text-white[/6]"
			>
				<template #event-data="{ row }">
					<TheEvent :event-code="row.event.eventCode" :event-type="row.event.eventType" size="md" />
				</template>
				<template #break-data="{ row }">
					<p>{{ formatDuration(row.break) || 0 }}</p>
					<UProgress size="sm" :value="(row.break * 100) / hosTimeRemainder.breakDuration" />
				</template>
				<template #driving-data="{ row }">
					<p>{{ formatDuration(row.driving) || 0 }}</p>
					<UProgress size="sm" :value="(row.driving * 100) / hosTimeRemainder.drivingDuration" />
				</template>
				<template #shift-data="{ row }">
					<p>{{ formatDuration(row.shift) || 0 }}</p>
					<UProgress size="sm" :value="(row.shift * 100) / hosTimeRemainder.shiftDuration" />
				</template>
				<template #cycle-data="{ row }">
					<p>{{ formatDuration(row.cycle) || 0 }}</p>
					<UProgress size="sm" :value="(row.cycle * 100) / hosTimeRemainder.cycleDuration" />
				</template>
				<template #violations-data="{ row }">
					<p class="text-red-1 text-xs font-semibold">{{ row.violations }}</p>
				</template>
				<template #eld-data="{ row }">
					<UBadge variant="solid" :ui="{ variant: { solid: row.eld ? 'bg-purple' : 'bg-grey-0' } }">{{ row.eld ? 'Online' : 'Offline' }}</UBadge>
				</template>
			</UTable>
			<UPagination
				class="mt-3"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="totalCount"
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
import { useLogComposable } from '~/composables/pages/logs';
const { columns, filteredDriverLogs, totalCount, search, selectedEvent, selectedNavigation, selectedStatus, selectedViolation, tableRowSelect, loading } = await useLogComposable();
</script>

<style></style>
