export class ApiUrls {

  // Audio Upload
  public static AUDIO_UPLOAD: string = '/api/v1/files/upload';

  // MATERIALS
  public static MATERIALS: string = '/api/materials';

  // Auth
  public static AUTH_LOGIN_URL: string = '/api/auth/login';
  public static AUTH_LOGOUT_URL: string = '/api/auth/logout';
  public static AUTH_REGISTER_URL: string = '/api/register';
  public static AUTH_REFRESH_TOKEN_URL: string = '/api/auth/refresh';

  // USERS
  public static USERS_URL: string = '/api/users';
  public static USERS_FILTER_URL: string = this.USERS_URL + '/filter';

  // PORTAL USERS
  public static PORTAL_USERS_URL: string = '/api/portal-users';
  public static PORTAL_USERS_FILTER_URL: string = this.PORTAL_USERS_URL + '/filter';

  // PROVIDERS
  public static PROVIDERS_URL: string = '/api/providers';
  public static PROVIDERS_FILTER_URL: string = this.PROVIDERS_URL + '/filter';

  // PROVIDER USERS
  public static PROVIDER_USERS_URL: string = '/api/provider-users';
  public static PROVIDER_USERS_FILTER_URL: string = this.PROVIDER_USERS_URL + '/filter';
}