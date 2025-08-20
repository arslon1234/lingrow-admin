declare interface UserAuth {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  type: number;
  companyId: string;
  providerId: string;
  roles: RoleResponse[];
}