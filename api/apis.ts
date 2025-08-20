export class ApiUrls {
  // Auth
  public static AUTH_LOGIN_URL: string = '/api/auth/login';
  public static AUTH_LOGOUT_URL: string = '/api/auth/logout';
  public static AUTH_REGISTER_URL: string = '/api/register';
  public static AUTH_REFRESH_TOKEN_URL: string = '/api/auth/refresh-token';

  // AI
  public static AI_URL: string = '/api/artificial-intelligence';
  public static AI_SHIFT_URL: string = this.AI_URL + '/shift';
  public static AI_EVENT_REPORTS_URL: string = this.AI_URL + '/event-reports';
  public static AI_MOVED_TIMES_URL: string = this.AI_URL + '/moved-times';
  public static AI_CHAT_ADD_URL: string = this.AI_URL + '/chat';
  public static AI_CHAT_HISTORY_URL: string = this.AI_URL + '/chat/history';
  public static AI_SUBMIT_URL: string = this.AI_URL + '/submit';
  // AUDIT
  public static AUDIT_URL: string = '/api/audit';
  public static AUDIT_EVENTS_URL: string = this.AUDIT_URL + '/events';
  public static AUDIT_SUMMARY_URL: string =  this.AUDIT_URL + '/summary';
  public static AUDIT_GRAPH_URL: string =  this.AUDIT_URL + '/graph';
  public static AUDIT_VIOLATIONS_URL: string =  this.AUDIT_URL + '/violations';
  public static AUDIT_WEIGHT_STATIONS_URL: string =  this.AUDIT_URL + '/weight-stations';
  public static AUDIT_TRACKING_URL: string =  this.AUDIT_URL + '/tracking';

  // DOT INSPECTION
  public static DOT_INSPECTION_URL: string = '/api/dot-inspections';

  // DELETION MENU
  public static DELETION_MENU_URL: string = '/api/deletion-menu';
  public static DELETION_MENU_PROVIDERS_URL: string = this.DELETION_MENU_URL + '/providers';
  public static DELETION_MENU_CARRIERS_URL: string = this.DELETION_MENU_URL + '/carriers';
  public static DELETION_MENU_ASSIGN_TEST_DRIVER_URL: string = this.DELETION_MENU_URL + '/assign-test-driver';

  // Carrier
  public static CARRIER_URL: string = '/api/carriers';
  public static CARRIER_FILTER_URL: string = '/api/carriers/filter';
  public static CARRIER_TIME_ZONE_URL: string = '/api/carriers/time-zones';

  // Drivers
  public static DRIVERS_URL: string = '/api/drivers';
  public static DRIVERS_CURRENT_VEHICLE: string = this.DRIVERS_URL + '/driver-by-current-vehicle-id';
  public static DRIVERS_FILTER_URL: string = '/api/drivers/filter';

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

  // Ifta
  public static IFTA_URL: string = '/api/ifta';
  public static IFTA_GET_URL: string = this.IFTA_URL + "/filter";
  public static IFTA_ADD_URL: string = this.IFTA_URL + "/generate";

  // Defects
  public static DEFECTS_URL: string = '/api/defects';

  // Logs
  public static LOGS_URL: string = '/api/logs';
  public static LOGS_DRIVERS_URL: string = this.LOGS_URL + '/drivers';
  public static LOGS_DRIVER_URL: string = this.LOGS_URL + '/driver';
  public static LOGS_TRANSFER_URL: string = this.LOGS_URL + '/transfer';
  public static LOGS_DOWNLOAD_LOG_PDF_URL: string = this.LOGS_URL + '/download-log-pdf';

  // GEOLOCATIONS
  public static GEOLOCATIONS_URL: string = '/api/geo-locations';
  public static CALCULATE_GEOLOCATION_URL: string = this.GEOLOCATIONS_URL + '/calculate';

  // MONITORING
  public static MONITORING_URL: string = '/api/monitoring';
  public static MONITORING_PROVIDER_URL: string = this.MONITORING_URL + '/provider';
  public static MONITORING_CARRIER_URL: string = this.MONITORING_URL + '/carrier';

  // DRIVER LOGS
  public static DRIVER_LOGS_URL: string = '/api/driver-logs';
  public static DRIVER_LOGS_PROCESSING_URL: string = this.DRIVER_LOGS_URL + '/processing-events';
  public static DRIVER_LOGS_DAILY_EVENTS_URL: string = this.DRIVER_LOGS_URL + '/daily-events';
  public static DRIVER_LOGS_DAILY_REPORT_URL: string = this.DRIVER_LOGS_URL + '/daily-events-report';
  public static DRIVER_LOGS_DAILY_GRAPH_URL: string = this.DRIVER_LOGS_URL + '/daily-graph';
  public static DRIVER_LOGS_WEEKLY_VIOLATIONS_URL: string = this.DRIVER_LOGS_URL + '/weekly-violations';
  public static DRIVER_LOGS_DAILY_SUMMARY_URL: string = this.DRIVER_LOGS_URL + '/daily-summary';
  public static DRIVER_LOGS_DAILY_PIXEL_VIOLATIONS_URL: string = this.DRIVER_LOGS_URL + '/daily-pixel-violations';
  public static DRIVER_LOGS_DAILY_TIME_REMAINDER_URL: string = this.DRIVER_LOGS_URL + '/daily-time-remainder';

  // DRIVER INFOS
  public static DRIVER_INFOS_URL: string = '/api/driver-infos';

  // DRIVER DAILY FORMS
  public static DRIVER_DAILY_FORMS_URL: string = '/api/driver-daily-forms';

  // DRIVER ALERTS
  public static DRIVER_ALERTS_URL: string = '/api/driver-alerts';

  // EDIT DRIVER DAILY FORMS
  public static EDIT_DRIVER_DAILY_FORMS_URL: string = '/api/edit-driver-daily-forms';
  public static EDIT_DRIVER_DAILY_FORMS_BY_DATE_URL: string = this.EDIT_DRIVER_DAILY_FORMS_URL + '/by-date';
  public static SUBMIT_DRIVER_DAILY_FORMS_BY_DATE_URL: string = this.EDIT_DRIVER_DAILY_FORMS_URL + '/submit';

  //  BOOSTS
  public static BOOST_EVENTS_URL: string = '/api/boost-events';
  public static BOOST_EVENTS_LATEST_URL: string = this.BOOST_EVENTS_URL + '/latest';
  public static BOOST_EVENTS_HISTORY_URL: string = this.BOOST_EVENTS_URL + '/history';
  public static BOOST_EVENTS_GRAPH_LATEST_URL: string = this.BOOST_EVENTS_URL + '/latest-graph';
  public static BOOST_EVENTS_GRAPH_HISTORY_URL: string = this.BOOST_EVENTS_URL + '/history-graph';
  public static BOOST_EVENTS_RESET_PIN_TIMES_LATEST_URL: string = this.BOOST_EVENTS_URL + '/latest-reset-pin-times';
  public static BOOST_EVENTS_RESET_PIN_TIMES_HISTORY_URL: string = this.BOOST_EVENTS_URL + '/history-reset-pin-times';
  public static BOOST_EVENTS_ADD_URL: string = this.BOOST_EVENTS_URL + '/add';
  public static BOOST_EVENTS_UPDATE_URL: string = this.BOOST_EVENTS_URL + '/update';
  public static BOOST_EVENTS_DELETE_URL: string = this.BOOST_EVENTS_URL + '/delete';
  public static BOOST_EVENTS_COPY_URL: string = this.BOOST_EVENTS_URL + '/copy';
  public static BOOST_EVENTS_REVERT_URL: string = this.BOOST_EVENTS_URL + '/revert';
  public static BOOST_EVENTS_MOVE_TIME_URL: string = this.BOOST_EVENTS_URL + '/move-time';
  public static BOOST_EVENTS_SUBMIT_URL: string = this.BOOST_EVENTS_URL + '/submit';


  // BOOST SUMMARIES
  public static BOOST_URL: string = '/api/boost';
  public static BOOST_LATEST_TIME_REMAINDER_URL: string = this.BOOST_URL + '/latest-time-remainder';
  public static BOOST_HISTORY_TIME_REMAINDER_URL: string = this.BOOST_URL + '/history-time-remainder';
  public static BOOST_LATEST_SUMMARIES_URL: string = this.BOOST_URL + '/latest-summaries';
  public static BOOST_HISTORY_SUMMARIES_URL: string = this.BOOST_URL + '/history-summaries';
  public static BOOST_LATEST_VIOLATIONS_URL: string = this.BOOST_URL + '/latest-violations';
  public static BOOST_HISTORY_VIOLATIONS_URL: string = this.BOOST_URL + '/history-violations';
  public static BOOST_LATEST_FREE_TIMES_URL: string = this.BOOST_URL + '/latest-free-times';
  public static BOOST_HISTORY_FREE_TIMES_URL: string = this.BOOST_URL + '/history-free-times';
  public static BOOST_PIXEL_VIOLATIONS: string = this.BOOST_URL + '/pixel-violations'

  // TRACKING
  public static TRACKING_URL: string = '/api/tracking';
  public static TRACKING_DRIVER_DAILY_EVENTS_URL: string = this.TRACKING_URL + '/driver-daily-events';
  public static TRACKING_DRIVERS_LAST_EVENTS_URL: string = this.TRACKING_URL + '/drivers-last-events';
  public static TRACKING_DRIVERS_EVERY_URL: string = this.TRACKING_URL + '/tracking-every-event';

  // TRANSFER
  public static TRANSFER_EVENTS_URL: string = '/api/transfer-events';
  public static TRANSFER_REASSIGN_URL: string =  this.TRANSFER_EVENTS_URL + '/reassign';
  public static TRANSFER_ORIGINAL_URL: string =  this.TRANSFER_EVENTS_URL + '/original';
  public static TRANSFER_DATE_RANGE_URL: string = this.TRANSFER_EVENTS_URL + '/date-range';
  public static TRANSFER_IDS_URL: string = this.TRANSFER_EVENTS_URL + '/ids';
  public static TRANSFER_GRAPH_URL: string = this.TRANSFER_EVENTS_URL + '/graph';
  public static TRANSFER_DAILY_SUMMARY_URL: string = this.TRANSFER_EVENTS_URL + '/daily-summary';

  // DVIR
  public static DVIRS_URL: string = '/api/edit-dvirs';
  public static DVIRS_FILTER_URL: string = '/api/edit-dvirs/filter';
  public static DVIRS_STATUSES_URL: string = '/api/dvir-statuses';
  public static DVIRS_LOCATION_AND_SIGNATURES_URL = '/api/edit-dvirs/location-signatures';

  // OUTPUT FILES
  public static OUTPUT_FILES_URL: string = '/api/output-files';
  public static OUTPUT_FILES_SEND_LOG_URL: string = this.OUTPUT_FILES_URL + '/send-log-pdf-email';
  public static OUTPUT_FILES_DOWNLOAD_LOG_URL: string = this.OUTPUT_FILES_URL + '/download-log-pdf';

  // SESSIONS
  public static SESSIONS_URL: string = '/api/sessions';
  public static SESSIONS_FILTER_URL: string = this.SESSIONS_URL + '/filter';

  // TABS
  public static TABS_URL: string = '/api/tabs';
  public static TABS_ADD_URL: string = this.TABS_URL + '/add';
  public static TABS_SESSION_URL: string = this.TABS_URL + '/session'

  // Roles
  public static ROLE_URL: string = '/api/roles';

  //Configuration
  // Issuer 
  public static ISSUER_STATE_URL: string = '/api/issuer-states';
  public static ISSUER_STATE_PARENT_URL: string = '/api/issuer-states/parents';

  //ELD Connection
  public static ELD_CONNECTION_URL: string = '/api/eld-vehicle-connections';

  // Vehicle Fuels
  public static VEHICLE_FUEL_URL: string = '/api/vehicle-fuels';

  // Maintenance Types
  public static MAINTENANCE_TYPES_URL: string = '/api/maintenanceServiceType';

  // Restarts
  public static RESTART_URL: string = '/api/restarts';

  // Cargo Types
  public static CARGO_TYPE_URL: string = '/api/cargo-types';

  // HOS Rules
  public static HOS_RULE_URL: string = '/api/hos-roles';

  // Rest Breaks
  public static REST_BREAK_URL: string = '/api/rest-breaks';

  // UserManager
  // Groups
  public static ROLES_URL: string = '/api/roles';

  //Permissions
  public static PERMISSIONS_URL: string = '/api/permissions';

  // OPTIMIZE
  public static OPTIMIZE_URL: string = '/api/optimize';
  public static OPTIMIZE_CATEGORIES_URL: string = this.OPTIMIZE_URL + '/categories';

  // Vehicles
  public static VEHICLE_URL: string = '/api/vehicles';
  public static VEHICLE_DASHBOARD: string = '/api/vehicle-dashboard/last-dashboard';
  public static VEHICLE_FILTER_URL: string = '/api/vehicles/filter';

  // Driver state
  public static DAILY_EVENTS: string = '/api/client/driver-state/daily-events';
  public static DAILY_EVENTS_GROUP_BY: string = '/api/client/driver-state/daily-events-group-by-date';

  // Eld Events by others
  public static EVENT_BY_OTHER_USERS_URL: string = '/api/eld-event-by-other-users';
  public static ELD_EVENTS_BY_VEHICLE_ID: string = '/api/eld-events/by-vehicleId';
  public static EVENT_SAVE_BY_OTHER_USERS_URL: string = this.EVENT_BY_OTHER_USERS_URL + '/save';
  public static EVENT_ADD_BY_OTHER_USERS_URL: string = this.EVENT_BY_OTHER_USERS_URL + '/add';
  public static EVENT_UPDATE_BY_OTHER_USERS_URL: string = this.EVENT_BY_OTHER_USERS_URL + '/update';

  // Elds
  public static ELD: string = '/api/eld-infos';
  public static ELD_FILTER: string = this.ELD + '/filter';
  public static ELD_UPDATE: string = this.ELD + '/set-update-file';

  // UNIDENTIFIED EVENTS
  public static UNIDENTIFIED_EVENTS_URL: string = '/api/unidentified-events';
  public static UNIDENTIFIED_EVENTS_FIlTER_URL: string = this.UNIDENTIFIED_EVENTS_URL + '/filter';
  public static UNIDENTIFIED_EVENTS_SELECT_URL: string = this.UNIDENTIFIED_EVENTS_URL + '/select';
  public static UNIDENTIFIED_EVENTS_REASSIGN_URL: string = this.UNIDENTIFIED_EVENTS_URL + '/reassign';
}