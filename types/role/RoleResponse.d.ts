declare interface RoleResponse {
  id: string;
  name: string;
  group: number;
  permissions: PermissionResponse[];
}