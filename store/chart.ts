import { defineStore } from 'pinia';

export const useChart = defineStore('chart', () => {
	// default chart settings
	const topOffset = ref(20);
	
	// readonly chart
	const chartData = ref<any>({});
	const heightInPixel = ref(40);
	const dutyTimes = computed(() => chartData.value);
	const chart = ref();

	// edit chart
	const editChartData = ref<any>({});
	const editHeightInPixel = ref(28);
	const editDutyTimes = computed(() => editChartData.value);
	const screenResolution = ref<number>(0);

	async function getChart(model: DriverDateTimeRequest, edit: boolean = false) {
		const url = 'https://routeeld.uz/api/client/graph/new-hos';
		const access_token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiYjY2NjJhZTctNDQyOC00NjUyLWFiNGYtNzBiYmEwN2Y4Mjc1IiwidXNlcklkIjoiMSIsIm5iZiI6MTczNDY4ODMwOSwiZXhwIjoxNzM0NzI0MzA5LCJpc3MiOiIwMDFJc3N1ZXJTZXJ2ZXIiLCJhdWQiOiIwMDFBdWRpZW5jZVNlcnZlciJ9.yAM0ipX6DI5ifL-AQi3n3byYSh3DHz165XZUosnFWkU';
		try {
			let data: any = await $fetch(url, {
				headers: {
					'Content-Type': 'application/json', // Example header
					Authorization: `Bearer ${access_token}` // Example dynamic token
				},
				method: 'POST',
				body: model
			});
			if (edit) {
				editChartData.value = data.successResult;
			} else {
				chartData.value = data.successResult;
			}
		} catch (error) {
			console.log('error', error);
		}
	}
	return {
		getChart,
		topOffset,
		
		// readonly chart
		chartData,
		chart,
		heightInPixel,
		dutyTimes,

		// edit chart
		editChartData,
		editHeightInPixel,
		editDutyTimes,
		screenResolution
	};
});
