<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">{{ vehicleDashboard?.vehicle?.make }} {{ vehicleDashboard?.vehicle?.model }} - {{ vehicleDashboard?.vehicle?.unit }}</h1>

			<div class="flex items-center gap-x-3">
				<div class="flex items-center gap-x-2">
					<span class="text-sm text-gray-500">Last Updated:</span>
					<span class="text-sm font-medium text-gray-700">{{ lastUpdated }}</span>
				</div>
				<div class="flex items-center gap-x-2">
					<span class="text-sm text-gray-500">Status:</span>
					<div class="flex items-center gap-x-1">
						<div
							:class="[
								'w-2 h-2 rounded-full',
								vehicleStatus === 'on duty' ? 'bg-green-500' : vehicleStatus === 'driving' ? 'bg-blue-500' : vehicleStatus === 'sleep' ? 'bg-purple-500' : 'bg-gray-400'
							]"
						></div>
						<span
							:class="[
								'text-sm font-medium capitalize',
								vehicleStatus === 'on duty' ? 'text-green-600' : vehicleStatus === 'driving' ? 'text-blue-600' : vehicleStatus === 'sleep' ? 'text-purple-600' : 'text-gray-600'
							]"
						>
							{{ vehicleStatus }}
						</span>
					</div>
				</div>
				<div class="flex items-center gap-x-2">
					<span class="text-sm text-gray-500">Driver:</span>
					<span class="text-sm font-medium text-gray-700">{{ currentDriver?.firstName }}{{ currentDriver?.lastName }}</span>
				</div>
			</div>
		</section>
		<section class="grid grid-cols-4 gap-2.5 my-2">
			<SpeedChart title="Engine Speed" :value="vehicleDashboard?.engineSpeed" :max-value="200" unit="km/h" :colors="speedColors" />
			<FuelLevelChart title="Fuel Level" :value="vehicleDashboard?.fuelLevelPercent * 100" :max-value="100" unit="%" />
			<DefLevel title="DEF Level" :value="vehicleDashboard?.defLevelPercent * 100" unit="%" />
			<OdometerChart
				:value="vehicleDashboard?.engineOdometer"
				:trip-value="vehicleDashboard?.totalEngineHours"
				:avg-speed="odometerData.avgSpeed"
				:fuel-economy="vehicleDashboard?.engineFuelEconomy"
			/>
		</section>
		<section class="grid grid-cols-1 xl:grid-cols-4 gap-3">
			<!-- Left side - Charts -->
			<div class="xl:col-span-3 space-y-6">
				<!-- Charts Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
					<TheMonitorCard title="Fuel Rate" unit="gal/h" average-label="Average Fuel Rate" chart-color="#4A90E2" :data="fuelChartMetrics" />
					<TheMonitorCard title="Def Level" unit="%" average-label="Average" chart-color="#4A90E2" :data="defChartMetrics && defChartMetrics" />
					<TheMonitorCard title="Speed" unit="RPM" average-label="Average Engine Speed" chart-color="#4A90E2" :data="speedChartMetrics" />
				</div>
			</div>

			<!-- Right side - Diagnostic Info -->
			<div class="xl:col-span-1">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
					<div class="max-h-[700px] overflow-y-auto">
						<div
							v-for="(item, index) in diagnosticData"
							:key="index"
							class="flex justify-between items-center px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
						>
							<span class="text-gray-600 text-xs font-medium">{{ item.label }}</span>
							<div class="text-right">
								<div v-if="item.isProgress" class="flex items-center space-x-2">
									<div class="w-16 bg-gray-200 rounded-full h-2">
										<div class="bg-green-500 h-2 rounded-full transition-all duration-300" :style="{ width: item.progressValue + '%' }"></div>
									</div>
									<span class="text-xs font-semibold text-gray-900">{{ item.value }}</span>
								</div>
								<span v-else class="text-xs font-semibold text-gray-900">{{ item.value }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import SpeedChart from '~/components/chart/SpeedChart.vue';
import FuelLevelChart from '~/components/chart/FuelLevelChart.vue';
import DefLevel from '~/components/chart/DefLevel.vue';
import OdometerChart from '~/components/chart/OdometerChart.vue';
import TheMonitorCard from '~/components/TheMonitorCard.vue';
import { useVehicleDashboardComposable } from '~/composables/pages/vehicleDashboard';

const odometerData = reactive({
	main: 125678,
	trip: 45.7,
	avgSpeed: 65,
	fuelEconomy: 8.5
});
const speedColors = [
	[0.3, '#67e0e3'],
	[0.7, '#37a2da'],
	[1, '#fd666d']
];
// const generateLast12HoursData = (baseValue, variation = 10) => {
// 	const series = [];
// 	const now = new Date();

// 	for (let i = 11; i >= 0; i--) {
// 		const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
// 		const value = baseValue + (Math.random() - 0.5) * variation;

// 		series.push({
// 			timestamp: timestamp.toISOString(),
// 			value: Math.max(0, parseFloat(value.toFixed(2)))
// 		});
// 	}

// 	return series;
// };

// const speedData = ref({
// 	series: generateLast12HoursData(65, 20), // Base 65 mi/h, ±10 variation
// 	statistics: {
// 		highest: 79,
// 		lowest: 45,
// 		average: 62.5
// 	}
// });

const { diagnosticData, vehicleDashboard, vehicleStatus, lastUpdated, currentDriver, speedChartMetrics, fuelChartMetrics, defChartMetrics } = await useVehicleDashboardComposable();
</script>
