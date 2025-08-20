// importing packages
import dayjs from 'dayjs';

export const useToolsStatistics = async () => {
	// header data
	const headerDate = ref<DatePicker>({ start: dayjs(), end: dayjs() });
	const selectedAdmin = ref(null);
	const selectedTab = ref(0);

	// kpi data
	const kpiSelectedAdmins = ref(['Admin 1', 'Admin 2', 'Admin 3']);

	// chart colors
	const chartColors = ['#E3C012', '#6B7BAA', '#59C84D'];

	// kpi area chart data
	const areaChartOptions = computed(() => {
		return {
			chart: {
				animations: {
					enabled: true,
					easing: 'linear',
					speed: 300,
					animateGradually: {
						enabled: true,
						delay: 150
					},
					dynamicAnimation: {
						enabled: true,
						speed: 1000
					}
				},
				toolbar: {
					show: false
				},
				zoom: {
					enabled: false
				},
				type: 'area',
				foreColor: '#1D2825',
				fontFamily: 'SFPro-Text'
			},
			dataLabels: {
				enabled: false
			},
			fill: {
				type: 'gradient'
			},
			colors: chartColors,
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				range: 11
			},
			yaxis: {
				labels: {
					formatter: function (val: any) {
						return val.toLocaleString();
					}
				}
			},
			stroke: {
				curve: 'smooth',
				width: 6
			}
		};
	});
	const areaSeries = computed(() =>
		kpiSelectedAdmins.value.map((a) => ({
			name: a,
			data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 91) + 10)
		}))
	);

	// tasks / time period chart data
	const columnChartOptions = computed(() => {
		return {
			chart: {
				type: 'bar',
				stacked: true,
				stackType: '100%',
				toolbar: {
					show: false
				},
				fontFamily: 'SFPro-Text'
			},
			plotOptions: {
				bar: {
					borderRadius: 8,
					borderRadiusApplication: 'end',
					borderRadiusWhenStacked: 'last',
					dataLabels: {
						total: {
							enabled: false,
							formatter: (val: any, opt: any) => {
								return val;
							},
							offsetY: -10,
							style: {
								fontSize: '20px',
								fontWeight: '600',
								fontFamily: 'SFPro-Text'
							}
						}
					}
				}
			},
			colors: chartColors,
			// stroke: {
			// 	width: 4,
			// 	colors: ['#fff']
			// },
			// legend: {
			//   show: false,
			// },
			tooltip: {
				// enabledOnSeries: [0, 1, 2, 3],
				y: {
					formatter: function (val: any, opt: any) {
						return val;
					}
				}
			},
			yaxis: {
				labels: {
					show: true
				}
			},
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				axisBorder: {
					show: true
				},
				axisTicks: {
					show: true
				},
				range: 11
			},
			grid: {
				yaxis: {
					lines: {
						show: true
					}
				}
				// xaxis: {
				//   lines: {
				//     show: true
				//   }
				// }
				// padding: {
				// 	top: 10,
				// 	right: 0,
				// 	bottom: 10,
				// 	left: 0
				// }
			},
			dataLabels: {
				enabled: true,
				formatter: function (val: any, opt: any) {
					return Math.floor(val) + '%';
				},
				style: {
					fontSize: '12px',
					fontWeight: '400',
					fontFamily: 'SFPro-Text'
				}
			}
		};
	});
	const columnSeries = computed(() => kpiSelectedAdmins.value.map((a) => ({ name: a, data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 91) + 10) })));

	// number of fixed errors & violations chart data
	const barChartOptions = computed(() => {
		return {
			chart: {
				type: 'bar',
				toolbar: {
					show: false
				}
			},
			plotOptions: {
				bar: {
					horizontal: false,
					borderRadius: 4,
					borderRadiusApplication: 'end',
					// columnWidth: '55%',
					endingShape: 'rounded'
				}
			},
			colors: ['#596BA0', '#6B7BAA', '#7E8BB5', '#909CBF', '#A2ACCA', '#B5BDD5', '#DADEEA'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27']
			},
			// yaxis: {
			// 	title: {
			// 		text: '$ (thousands)'
			// 	}
			// },
			fill: {
				opacity: 1
			}
			// tooltip: {
			// 	y: {
			// 		formatter: function (val) {
			// 			return '$ ' + val + ' thousands';
			// 		}
			// 	}
			// }
		};
	});
	const barChartSeries = computed(() => [
		{
			name: 'Location',
			data: [12, 23, 12, 13, 22, 12, 22, 23]
		},
		{
			name: 'Speed',
			data: [13, 23, 20, 8, 13, 27, 13, 12]
		},
		{
			name: 'Intermediate',
			data: [11, 17, 15, 15, 21, 14, 15, 13]
		},
		{
			name: 'Odometer',
			data: [21, 7, 25, 13, 22, 8, 14, 23]
		},
		{
			name: 'Engine hours ',
			data: [15, 12, 14, 8, 16, 12, 17, 18]
		},
		{
			name: 'Power up & Shut down',
			data: [12, 15, 11, 13, 18, 16, 13, 12]
		},
		{
			name: 'Log in & Log out',
			data: [11, 17, 15, 15, 21, 14, 15, 13]
		}
	]);

	// ai & booster chart data
	const pieChartSeries = computed(() => [90, 210]);
	const pieChartOptions = computed(() => {
		return {
			chart: {
				type: 'donut'
			},
			plotOptions: {
				pie: {
					customScale: 1,
					expandOnClick: false
				}
			},
			legend: {
				show: true,
				position: 'bottom'
			},
			colors: chartColors,
			tooltip: {
				style: {
					fontSize: '16px',
					fontFamily: 'SFPro-Text'
				}
			},
			dataLabels: {
				enabled: false
			},
			labels: ['Boost', 'AI']
		};
	});

	// pagination
	const selectedNavigation = ref(1);

	// table data
	const columns = [
		{ label: 'Company', key: 'company' },
		{ label: 'Driver', key: 'driver' },
		{ label: 'UEUsed Tool', key: 'tool' },
		{ label: 'Mistakes before', key: 'mistake_before' },
		{ label: 'Mistakes after', key: 'mistake_after' },
		{ label: 'Violations before', key: 'violation_before' },
		{ label: 'Violations after', key: 'violation_after' },
		{ key: 'action', class: 'w-12' }
	];

	const rows = [
		{
			id: 1,
			company: 'B1 Carriers INC',
			driver: 'Albert Flores',
			tool: 'Booster',
			mistake_before: 12,
			mistake_after: 4,
			violation_before: 5,
			violation_after: 0
		},
		{
			id: 2,
			company: 'B1 Carriers INC',
			driver: 'Albert Flores',
			tool: 'Booster',
			mistake_before: 12,
			mistake_after: 4,
			violation_before: 5,
			violation_after: 0
		},
		{
			id: 3,
			company: 'B1 Carriers INC',
			driver: 'Albert Flores',
			tool: 'AI',
			mistake_before: 12,
			mistake_after: 4,
			violation_before: 5,
			violation_after: 0
		},
		{
			id: 4,
			company: 'B1 Carriers INC',
			driver: 'Albert Flores',
			tool: 'Booster',
			mistake_before: 12,
			mistake_after: 4,
			violation_before: 5,
			violation_after: 0
		},
		{
			id: 5,
			company: 'B1 Carriers INC',
			driver: 'Albert Flores',
			tool: 'AI',
			mistake_before: 12,
			mistake_after: 4,
			violation_before: 5,
			violation_after: 0
		}
	];

	return {
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
	};
};
