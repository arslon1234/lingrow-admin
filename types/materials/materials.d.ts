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
    publisher?: string,
    isStrictFormat: boolean
}

declare interface GetMaterialBookParams {
	status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED",
    type: "BOOK" | "MOCK_TEST" | "PRACTICE_SET" | "OFFICIAL_TEST"
    pageable?: {
        page: number,
        size: number
    }
}

