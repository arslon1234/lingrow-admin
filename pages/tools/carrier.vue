<template>
	<main>
		<section class="bg-white rounded-lg px-4 flex items-center justify-between dark:bg-dark-0">
			<div class="flex items-center gap-x-8">
				<h1 class="title text-lg shrink-0">Statistic company</h1>
				<UHorizontalNavigation :links="links" :ui="{ base: 'py-4 font-semibold text-base', active: 'text-purple after:bg-purple', inactive: 'text-black' }" />
			</div>
			<div class="flex ml-auto items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedCompany"
					placeholder="Select Company"
					searchable
					searchable-placeholder="Search a company"
					:options="['Company 1', 'Company 2', 'Company 3']"
					:ui="{ base: 'w-44', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide' } } }"
				/>
				<UTabs v-model="selectedTab" :items="[{ label: 'Weekly' }, { label: 'Monthly' }, { label: 'Yearly' }]" :ui="{ list: { tab: { padding: 'py-1.5' } } }" />
			</div>
		</section>
		<section class="space-y-1 mt-1">
			<div v-for="a in 12" class="rounded-lg bg-white dark:bg-dark-0">
				<div @click="opened[a] = !opened[a]" style="grid-template-columns: 50px minmax(300px, auto) 1fr auto" class="grid cursor-pointer gap-x-5 items-center px-4 py-2">
					<p class="font-medium text-sm text-black-1 dark:text-white/[0.8]">{{ a }}</p>
					<p class="text-sm font-bold text-black-1 dark:text-white/[0.8]">Johnson & Johnson</p>
					<div>
						<UMeter
							size="xl"
							:value="a * 10"
							:style="{ color: `${mainColor}80` }"
							:ui="{
								meter: {
									background: 'bg-white',
									color: 'text-current',
									rounded: 'rounded-md',
									bar: { rounded: '[&::-webkit-meter-optimum-value]:rounded-md [&::-moz-meter-bar]:rounded-md' }
								}
							}"
						/>
					</div>
					<UBadge variant="solid" size="sm" class="px-5" :style="{ backgroundColor: `${mainColor}CC` }" :ui="{ variant: { solid: 'font-bold text-grey-border dark:text-white/[0.8]' } }">382</UBadge>
				</div>
				<UDivider v-if="opened[a]" />
				<div v-if="opened[a]" class="px-4 py-3">
					<div class="flex items-center gap-x-6">
						<h4 class="text-black-1 font-bold dark:text-white/[0.6]">{{ route.query.tab === 'carrier' ? 'Number of trucks' : 'Number of requests' }}</h4>
						<UBadge variant="solid" size="lg" :style="{ backgroundColor: `${mainColor}1A`, color: mainColor }">Higher than last month </UBadge>
					</div>
					<div class="mt-2.5 flex gap-x-10">
						<div class="space-y-1">
							<p class="text-black-1 text-xs font-medium dark:text-white/[0.6]">Company average</p>
							<p class="font-bold">31</p>
						</div>
						<div class="space-y-1">
							<p class="text-black-1 text-xs font-medium dark:text-white/[0.6]">Current quantity</p>
							<p class="font-bold">05</p>
						</div>
					</div>
					<div class="mt-4 border rounded-lg border-grey-border dark:border-white/[0.1]">
						<ClientOnly>
							<apexchart v-if="route.query.tab === 'carrier'" type="bar" height="250px" :options="barChartOptions" :series="barChartSeries"></apexchart>
							<apexchart v-else width="100%" height="250" type="area" :options="areaChartOptions" :series="areaSeries"></apexchart>
						</ClientOnly>
					</div>
					<p v-if="route.query.tab === 'carrier'" class="mt-2.5 text-black-1 font-medium text-xs dark:text-white/[0.6]">
						All information regarding the tracks is given here. You can find out and compare all the data by period
					</p>
					<p v-else class="mt-2.5 text-grey-4 font-medium text-xs">Statistics on the number of requests for a certain period. You can take a look and compare.</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing composables
import { useToolsCarrier } from '~/composables/pages/tools/carrier';

const { mainColor, selectedCompany, selectedTab, links, opened, barChartOptions, barChartSeries, areaChartOptions, areaSeries } = await useToolsCarrier();

// middleware
definePageMeta({
	middleware: ['carrier']
});

// route
const route = useRoute();
</script>
