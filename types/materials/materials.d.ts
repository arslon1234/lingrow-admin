declare interface GetMaterialBookParams {
	status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
	type: 'MOCK' | 'PRACTICE';
	pageable?: {
		page: number;
		size: number;
	};
}
declare interface MaterialReponse {
	id: string;
	title: string;
	materialType: GetMaterialBookParams['type'];
	status: GetMaterialBookParams['status'];
	publisher?: string;
	skillType?: string;
	createdAt?: string;
	updatedAt?: string;
}
declare interface MaterialTestReponse {
	id: string;
	title: string;
	testNumber: number | string;
}
declare interface MaterialBookData {
	id?: string;
	title: string;
	materialType: string;
}

declare interface CreateMaterialBookRequest {
	id?: string;
	title: string;
	materialType: string;
	publisher?: string;
	skillType?: string;
}

declare interface TestMaterials {
	id?: string;
	title: string;
	testNumber: number | string;
	isStrictFormat?: boolean;
}

declare interface MaterialTestSectionRequestBase {
	testId: number;
	skillType: string;
	level: string;
	title: string | null;
	sectionNumber: number | null;
}
