declare interface UserRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  type: number;
  providerId: string;
  carrierId?: string | null;
  roleIds: string[];
  // uploadImage?: string | null;
}