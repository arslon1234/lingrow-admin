export function formatMaterialType(type: string): string {
	const typeMap: Record<string, string> = {
		BOOK: 'Book',
		MOCK_TEST: 'Mock Test',
		PRACTICE_SET: 'Practice Set',
		OFFICIAL_TEST: 'Official Test'
	};
	return typeMap[type] || type;
}

