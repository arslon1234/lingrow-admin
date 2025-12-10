export const SkillTypes = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Listening', value: 'LISTENING' },
	{ label: 'Reading', value: 'READING' },
	{ label: 'Writing', value: 'WRITING' },
	{ label: 'Speaking', value: 'SPEAKING' }
];

export const BookTypeOptions: Array<{ value: GetMaterialBookParams['type']; label: string }> = [
	// { value: 'BOOK', label: 'Book' },
	{ value: 'MOCK', label: 'Mock' },
	{ value: 'PRACTICE', label: 'Practice' },
	// { value: 'OFFICIAL_TEST', label: 'Official Test' }
];

export const StatusOptions: Array<{ value: GetMaterialBookParams['status']; label: string }> = [
	{ value: 'DRAFT', label: 'Draft' },
	{ value: 'PUBLISHED', label: 'Published' },
	{ value: 'UNPUBLISHED', label: 'Unpublished' },
	{ value: 'ARCHIVED', label: 'Archived' }
];
