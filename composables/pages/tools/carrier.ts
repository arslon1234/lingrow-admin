export const useToolsCarrier = async () => {
	// route
	const route = useRoute();
  
	// header data
	const mainColor = computed(() => (route.query.tab === 'carrier' ? '#465a95' : '#4F7703'));
	const selectedCompany = ref(null);
	const selectedTab = ref(0);
	const links = [
		{
			label: 'Company statistics',
			to: '/tools/carrier?tab=carrier',
			exactQuery: true
		},
		{
			label: 'Number of requests',
			to: '/tools/carrier?tab=requests',
			exactQuery: true
		}
	];

	// data chart
	const opened = ref({});

	// bar chart for company
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
					borderRadius: 6,
					borderRadiusApplication: 'end',
					columnWidth: '25%',
					endingShape: 'rounded'
				}
			},
			colors: [mainColor.value],
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
			name: 'Number of trucks',
			data: [12, 23, 12, 13, 22, 12, 22, 23, 12, 23, 12, 23]
		}
	]);

	// area chart for requests
	const areaChartOptions = computed(() => {
		return {
			chart: {
				animations: {
					enabled: true,
					easing: 'linear',
					speed: 1000,
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
			colors: [mainColor.value],
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
				curve: 'straight',
				width: 6
			}
		};
	});
	const areaSeries = computed(() => [
		{
			name: 'Number of requests',
			data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 91) + 10)
		}
	]);

  return {
    mainColor,
    selectedCompany,
    selectedTab,
    links,
    opened,
    barChartOptions,
    barChartSeries,
    areaChartOptions,
    areaSeries
  }
};
