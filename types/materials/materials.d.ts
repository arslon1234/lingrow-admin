declare interface MaterialReponse {
	id: string;
	title: string;
	materialType: 'BOOK' | 'MOCK_TEST' | 'PRACTICE_SET' | 'OFFICIAL_TEST';
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // yoki sizning status typelaringiz
	publisher?: string;
	skillType?: string;
	createdAt?: string;
	updatedAt?: string;
}
declare interface MaterialBookData {
	id?: string;
	title: string;
	materialType: string;
}

declare interface MaterialBookType {
	key: string;
	label: string;
	description: string;
}

declare interface CreateMaterialBookRequest {
	id?: string;
	title: string;
	materialType: string;
	publisher?: string;
	skillType?: string;
}

declare interface GetMaterialBookParams {
	status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
	type: 'BOOK' | 'MOCK_TEST' | 'PRACTICE_SET' | 'OFFICIAL_TEST';
	pageable?: {
		page: number;
		size: number;
	};
}

declare interface TestMaterials {
	id?: string;
	title: string;
	testNumber: string;
}
