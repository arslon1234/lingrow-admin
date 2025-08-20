declare interface GraphResponse {
	duties: {
		'1': Array<GraphDuties>;
		'2': Array<GraphDuties>;
		'3': Array<GraphDuties>;
		'4': Array<GraphDuties>;
		'5': Array<GraphDuties>;
		'6': Array<GraphDuties>;
	};
	verticalLines: Array<GraphVerticalLines>;
	days: number;
	svgWidth: number;
	svgViewBox: number;
	dayNames: Array<string>;
	dates: Array<string>;
}
