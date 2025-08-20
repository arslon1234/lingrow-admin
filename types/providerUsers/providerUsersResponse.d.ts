declare interface ProviderUserResponse {
	id: string;
	userName: string;
	firstName: string;
	lastName: boolean;
	isActive: boolean;
	role: GroupResponse;
	toolCodes: Array<number> | null;
}
