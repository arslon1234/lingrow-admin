export const ActionStates = {
	0: { label: 'Pending', color: '#7588BF' },
	1: { label: 'Staged', color: '#3F963F' },
	2: { label: 'Finished', color: '#3F963F' },
	3: { label: 'Edited', color: '#007BFF' },
	4: { label: 'Archived', color: '#9A6935' },
	5: { label: 'RolledBack', color: '#D6A834' },
	6: { label: 'Copied', color: '#C1D116' },
	7: { label: 'Ignored', color: '#A3A5A3' }
};

export const TabActionType = {
	0: 'New Shift',
	1: 'Add PTI',
	2: 'New Break',
	3: 'Optimize'
}

export const TabTypes = {
	0: 'Initial',
	1: 'New',
	2: 'Edited',
	3: 'Move',
	4: 'Optimized'
};

export const EventCategory: Record<number, string> = {
	0: 'Break',
	1: 'SequenceId',
	2: 'Shift',
	3: 'Cycle',
	4: 'PTI',
	5: 'EngineHours',
	6: 'Odometer',
	7: 'Location',
	8: 'SpeedLimit',
	9: 'Intermediate',
	10: 'Certifications',
	11: 'UnidentifiedEvents',
	12: 'FormsAndNotes',
	13: 'PowerUpShutDown',
	14: 'LoginLogout',
	15: 'AdjustHours'
} as const;

export const RecordOrigin = {
	1: { shortName: 'ELD' },
	2: { shortName: 'Driver' },
	3: { shortName: 'User' },
	4: { shortName: 'Unidentified' }
};

export const SessionType = {
	1: 'Boost',
	2: 'Optimize',
	3: 'AI',
	4: 'History'
};

export const ViolationType = {
	0: 'ThirtyMinutesBreak',
	1: 'Shift',
	2: 'Cycle',
	3: 'DriveTime'
};

export const LocationType = {
	0: 'MandatoryTruckStop',
	1: 'OptionalTruckStop',
	2: 'OriginFacility',
	3: 'DestinationFacility'
}

export const RoleType = {
	1: 'AppAdmin',
	2: 'AppManager',
	3: 'ProviderAdmin',
	4: 'ProviderManager',
	5: 'CarrierManager',
	6: 'CarrierSupport',
}