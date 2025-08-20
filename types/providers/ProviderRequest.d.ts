declare interface ProviderRequest {
	name: string;
	email: string;
	phoneNumber: string;
	providerClient: {
		firstName: string;
		lastName: string;
		userName: string;
		password: string;
		selectedTools: Array<number>;
	};
}
