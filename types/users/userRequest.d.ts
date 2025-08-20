declare interface UsersRequest {
	userName: string | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	phoneNumber: string | null;
	password: string | null;
	passwordConfirm: string | null;
	providerId: string | null;
	carrierId?: string | null;
	roleId?: string | null;
	roleIds?: string[];
}
