declare interface DriverRequest {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm: string;
  issuerStateId: string;
  licenseNumber: string;
  homeTerminalId: string;
  assignedVehicleIds: string[];
  exemptDriver: boolean;
  shortHaulException: boolean;
  allowPersonalUse: boolean;
  unlimitedTrailers: boolean;
  allowYardMoves: boolean;
  unlimitedShippingDocuments: boolean;
  hosRuleId: string;
  cargoTypeId: string;
  restartId: string;
  restBreakId: string;
  carrierId: string;
}