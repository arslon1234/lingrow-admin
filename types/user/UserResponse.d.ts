declare interface UserResponse {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	carriersCount: number;
	driversCount: number;
	state: number;
	roles: GroupResponse[];
	toolCodes: Array<number> | null;
}
