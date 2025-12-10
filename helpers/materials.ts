export function formatMaterialType(type: string): string {
	const typeMap: Record<string, string> = {
		BOOK: 'Book',
		MOCK: 'Mock',
		PRACTICE: 'Practice',
		OFFICIAL_TEST: 'Official Test'
	};
	return typeMap[type] || type;
}

