declare interface DeletionMenuCarriersResponse {
	id: string;
	providerId: string;
	providerName: string;
	name: string;
	drivers: Array<{isTestDriver: boolean} & DriverInfosResponse>;
}
