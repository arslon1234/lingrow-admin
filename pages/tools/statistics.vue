<template>
	<main>
		<section class="card flex items-center justify-between">
			<h1 class="title text-lg">Statistics</h1>
			<div class="flex ml-auto items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedAdmin"
					placeholder="Select Admin"
					:options="['Admin 1', 'Admin 2', 'Admin 3']"
					:ui="{ padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide' } } }"
				/>
				<UPopover class="shrink-0" :popper="{ placement: 'bottom' }">
					<UButton variant="outline" :ui="{ variant: { outline: 'ring-grey-border text-black' }, icon: { base: 'bg-grey-2' } }">
						<template #leading>
							<CalendarIcon class="text-grey-2 w-5" />
						</template>
						{{ headerDate.start?.toISOString().substr(0, 10) }} | {{ headerDate.end?.toISOString().substr(0, 10) }}
					</UButton>
					<template #panel="{ close }">
						<DatePicker v-model="headerDate" is-required @close="close" />
					</template>
				</UPopover>
				<UTabs v-model="selectedTab" :items="[{ label: 'Daily' }, { label: 'Weekly' }, { label: 'Monthly' }, { label: 'Yearly' }]" :ui="{ list: { tab: { padding: 'py-1.5' } } }" />
			</div>
		</section>
		<section class="mt-3 grid grid-cols-6 gap-x-3">
			<div class="card col-span-3 flex items-center gap-x-2.5">
				<div class="rounded-full bg-background-grey_7 w-20 h-20 flex justify-center items-center">
					<UserIcon class="text-purple/[.5] h-6 w-6" />
				</div>
				<div class="flex-1 space-y-4">
					<div class="flex items-center gap-x-2">
						<h4 class="text-xl font-bold">Asadbek</h4>
						<p class="text-purple">+11.02%</p>
						<ArrowRiseIcon class="text-purple h-5 w-5" />
					</div>
					<div class="flex gap-x-8">
						<div v-for="i in 5" :key="i" class="space-y-1">
							<h5 class="uppercase text-sm font-bold">Start date</h5>
							<p class="text-black-1 text-xs font-medium">2024.09.24</p>
						</div>
					</div>
				</div>
			</div>
			<div class="card flex flex-col justify-between">
				<h4 class="uppercase font-bold">Quantity rate</h4>
				<p class="text-yellow-0 self-end font-extrabold text-2xl">0.5/5</p>
			</div>
			<div class="card flex flex-col justify-between">
				<h4 class="uppercase font-bold">Quality rate</h4>
				<p class="text-yellow-0 self-end font-extrabold text-2xl">5/5</p>
			</div>
			<div class="card flex flex-col justify-between">
				<h4 class="uppercase font-bold">Overall rate</h4>
				<div class="flex justify-between items-center">
					<NuxtRating :rating-size="20" :inactive-color="'#D0C13A33'" :active-color="'#E3C012'" :skleton-color="'#D0C13A33'" :read-only="true" :rating-value="2.75" />
					<p class="text-yellow-0 font-extrabold text-2xl">2.75</p>
				</div>
			</div>
		</section>
		<section class="mt-3 grid grid-cols-2 gap-x-3">
			<div class="card">
				<div class="flex items-center justify-between">
					<h3 class="title">KPI</h3>
					<USelectMenu
						size="md"
						v-model="kpiSelectedAdmins"
						multiple
						searchable
						searchable-placeholder="Search an admin"
						placeholder="Select Admin"
						:options="['Admin 1', 'Admin 2', 'Admin 3']"
						:ui="{ base: 'w-44', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide' } } }"
					/>
				</div>
				<div class="mt-2 border rounded-lg border-grey-border dark:border-white/[0.1]">
					<ClientOnly>
						<apexchart width="100%" height="350" type="area" :options="areaChartOptions" :series="areaSeries"> </apexchart>
					</ClientOnly>
				</div>
			</div>
			<div class="card">
				<h3 class="title">TASKS / TIME PERIOD</h3>
				<div class="mt-4 border rounded-lg border-grey-border dark:border-white/[0.1]">
					<ClientOnly>
						<apexchart type="bar" width="100%" height="350px" :options="columnChartOptions" :series="columnSeries"> </apexchart>
					</ClientOnly>
				</div>
			</div>
		</section>
		<section class="mt-3 grid grid-cols-5 gap-x-3">
			<div class="card col-span-4">
				<div class="flex items-center justify-between">
					<h3 class="title">Number of fixed errors & violations</h3>
					<UTabs v-model="selectedTab" :items="[{ label: 'Violation' }, { label: 'Errors' }]" :ui="{ list: { tab: { padding: 'py-1.5' } } }" />
				</div>
				<div class="mt-2 border rounded-lg border-grey-border dark:border-white/[0.1]">
					<ClientOnly>
						<apexchart type="bar" height="250px" :options="barChartOptions" :series="barChartSeries"></apexchart>
					</ClientOnly>
				</div>
			</div>
			<div class="card">
				<div class="flex items-center justify-between">
					<h3 class="title">AI & booster</h3>
					<p class="text-purple text-sm font-bold">Total: 300</p>
				</div>
				<div class="mt-4 flex justify-center items-center">
					<ClientOnly>
						<apexchart width="250px" height="250px" type="donut" :options="pieChartOptions" :series="pieChartSeries"></apexchart>
					</ClientOnly>
				</div>
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="rows" :ui="{ strategy: 'override', tbody: 'divide-y divide-grey-border dark:divide-white/[0.1]', divide: 'divide-y divide-grey-border dark:divide-white/[0.1]' }">
				<template #action-data="{ row }">
					<UButton size="sm" variant="soft" :ui="{ variant: { soft: 'bg-purple/[.2] hover:bg-purple/[.4] text-purple' } }">
						<template #leading>
							<ClockIcon class="text-purple h-5 w-5" />
						</template>
					</UButton>
				</template>
			</UTable>
			<UPagination
				class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="100"
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
import UserIcon from '~/assets/icons/user-02.svg';
import ArrowRiseIcon from '~/assets/icons/arrow-rise.svg';
import ClockIcon from '~/assets/icons/clock-rewind.svg';

// importing composables
import { useToolsStatistics } from '~/composables/pages/tools/statistics';
const {
	headerDate,
	selectedAdmin,
	selectedTab,
	kpiSelectedAdmins,
	chartColors,
	areaChartOptions,
	areaSeries,
	columnChartOptions,
	columnSeries,
	barChartOptions,
	barChartSeries,
	pieChartSeries,
	pieChartOptions,
	selectedNavigation,
	columns,
	rows
} = await useToolsStatistics();
</script>
