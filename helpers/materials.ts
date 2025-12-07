export function formatMaterialType(type: string): string {
	const typeMap: Record<string, string> = {
		BOOK: 'Book',
		MOCK_TEST: 'Mock Test',
		PRACTICE_SET: 'Practice Set',
		OFFICIAL_TEST: 'Official Test'
	};
	return typeMap[type] || type;
}

export function getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
        DRAFT: 'bg-yellow-100 text-yellow-700 !importand',
        PUBLISHED: 'bg-purple-100 text-purple-700 !importand',
        UNPUBLISHED: 'bg-gray-100 text-gray-700 !importand',
        ARCHIVED: 'bg-red-100 text-red-700 !importand'
    };
    return classMap[status] || 'bg-gray-100 text-gray-700';
}
