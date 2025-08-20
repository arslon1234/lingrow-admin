declare interface ProviderResponse {
	id: string;
	name: string;
	email: string;
	phoneNumber: string;
	isActive: boolean;
	carriersCount: number;
	vehiclesCount: number;
	user: UserResponse;
}
