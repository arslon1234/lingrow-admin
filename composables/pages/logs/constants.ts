import dayjs, { Dayjs } from 'dayjs';

export const createLogsTableColums = (timeZoneShortName?: string) => [
	{ key: 'sequence', label: '#' },
	{ key: 'time', label: `Time (${timeZoneShortName || 'UTC'})` },
	{ key: 'event', label: 'Event' },
	{ key: 'duration', label: 'Duration' },
	{ key: 'location', label: 'Location' },
	{ key: 'odometer', label: 'Odometer' },
	{ key: 'hours', label: 'Engine Hours' },
	{ key: 'recordOrigin', label: 'Record Origin' },
	{ key: 'recordStatus', label: 'Record Status' },
	{ key: 'notes', label: 'Notes' }
];

export const createBoostTableColums = (timeZoneShortName?: string) => [
	{ key: 'count', label: '#' },
	{ key: 'est', label: `Time (${timeZoneShortName})` },
	{ key: 'duration', label: 'Duration' },
	{ key: 'event', label: 'Event' },
	{ key: 'location', label: 'Location' },
	{ key: 'system', label: 'System' },
	{ key: 'odometer', label: 'Odometer' },
	{ key: 'hours', label: 'Eng Hours' },
	{ key: 'notes', label: 'Notes' },
	{ key: 'dot', label: '' },
	{ key: 'status', label: 'Status' },
	{ key: 'action', label: 'Actions' }
];

export const eventFilterItems = [{ label: 'All' }, { label: 'Events' }, { label: 'Form' }];

export const errorAndWarningColumns = [
	{ key: 'count', label: '#', class: 'w-8' },
	{ key: 'event', label: 'Event' },
	{ key: 'time', label: 'Time' },
	{ key: 'error', label: 'Error & Warnings' }
];

export const SCREEN_RESOLUTION_OFFSET = {
	BASE: 216,
	SIDEBAR_OPEN: 170
} as const;

export const chartColors = ['#E3C012', '#6B7BAA', '#59C84D', '#F26D7D', '#4C8E97', '#9B5F6B'];

export const editStatus = {
	id: 32,
	eventId: '',
	event: { eventCode: null, eventType: null },
	startDate: dayjs(),
	origin: 0,
	vehicle: null,
	vehicles: [],
	vehicleId: '',
	odometer: 934,
	engine_hours: 99347,
	location_origin: 0,
	latitude: 21.938873533,
	longitude: -21.938873533,
	location: '31.7 mi W of Deming, NM',
	location_note: 'Location',
	notes: 'Pick up',
	certifiedDate: ''
};

export const editProfile = {
	popover: false,
	date: dayjs(),
	co_drivers: [],
	co_driver: null,
	trailer: null,
	shipping_docs: null,
	signature: null,
	dailyFormId: null,
	assignedVehicleIds: []
};

export const formBoost = {
	transferring_time: {
		hours: 0,
		minutes: 0,
		seconds: 0
	}
};

export const logsTableColumns = [
	{
		key: 'counter',
		label: '#'
	},
	{
		key: 'name',
		label: 'Name'
	},
	{
		key: 'unit',
		label: 'Unit#'
	},
	{
		key: 'event',
		label: 'Event'
	},
	{
		key: 'time',
		label: 'Upload Time'
	},
	{
		key: 'location',
		label: 'Location'
	},
	{
		key: 'break',
		label: 'Break'
	},
	{
		key: 'driving',
		label: 'Driving'
	},
	{
		key: 'shift',
		label: 'Shift'
	},
	{
		key: 'cycle',
		label: 'Cycle'
	},
	{
		key: 'violations',
		label: 'Violations'
	},
	{
		key: 'eld',
		label: 'ELD'
	}
];
