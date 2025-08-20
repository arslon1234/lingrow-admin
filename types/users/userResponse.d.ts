declare interface UsersResponse {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean | null;
  role: RoleResponse;
}