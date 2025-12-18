import { reactive } from 'vue';

class UserService {
  private _user = reactive<UserAuth>({
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    type: 0,
    companyId: '',
    providerId: '',
    roles: []
  });

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userString = getUser();
    if (userString) {
      const user = JSON.parse(userString) as UserAuth;
      // Object.assign(this._user, {
      //   id: user.id,
      //   userName: user.userName,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      //   type: user.type,
      //   companyId: user.companyId,
      //   providerId: user.providerId,
      //   roles: user.roles
      // });
      // mergeObjectValues(this._user, user as any);
    }
  }

  public updateUser() {
    this.loadUserFromStorage();
  }

  public changeUserProperty(userName: string, name: string) {
    this._user.userName = userName;
    this._user.firstName = name.split(' ')[0];
    this._user.lastName = name.split(' ')[1];
    setUser(this._user);

    this.loadUserFromStorage();
  }

  // Method to get the current user
  public get user(): UserAuth | null {
    return this._user;
  }

  public get name(): string {
    if (!this._user) return "";
    return this._user.firstName + " " + this._user.lastName;
  }

  // Method to get user roles
  // public getUserRoles(): string[] {
  //   return this._user.value?.roles.map((role: RoleResponse) => role.name) || [];
  // }
}

export const userService = new UserService();