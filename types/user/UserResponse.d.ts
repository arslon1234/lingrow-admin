interface UserPermissions {}
interface UserRoles {
	name: string;
	description: string;
	permissions: UserPermissions[];
}
declare interface UserResponse {
	userId: string;
	phoneNumber: string;
	firstName: string;
	lastName: string;
	telegramUsername: string;
	isActive: string;
	roles: UserRoles[];
}
