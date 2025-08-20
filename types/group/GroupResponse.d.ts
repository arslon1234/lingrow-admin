declare interface GroupResponse {
  id: string;
  name: string;
  type: number;
  permissions: PermissionResponse[];
}