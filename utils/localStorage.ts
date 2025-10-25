import { useTimeZoneHelper } from "~/helpers/timezone";

// SERVICE PROVIDER ID
export const setProviderId = (id: string) => {
	console.log(id);
	localStorage.setItem('service_provider_id', id);
};

export const getProviderId = () => {
	return localStorage.getItem('service_provider_id') || null;
};

export const removeProviderId = () => {
	localStorage.removeItem('service_provider_id');
};

// CARRIER ID
export const setCarrierId = (id: string) => {
	localStorage.setItem('carrier_id', id);
};

export const getCarrierId = () => {
	return localStorage.getItem('carrier_id') || null;
};

export const removeCarrierId = () => {
	localStorage.removeItem('carrier_id');
};

export const setCarrierTimeZoneId = (ianaId: string) => {
	localStorage.setItem('carrier_timezoneid', ianaId);
	useTimeZoneHelper().setDefaultTimeZoneId(ianaId);
};

export const getCarrierTimeZoneId = () => {
	return localStorage.getItem('carrier_timezoneid') || null;
};

export const removeCarrierTimeZoneId = () => {
	localStorage.removeItem('carrier_timezoneid');
};

// Carrier Name
export const setCarrierName = (name: string) => {
	localStorage.setItem('carrier_name', name);
};
export const getCarrierName = () => {
	return localStorage.getItem('carrier_name') || null;
};

// Carrier Group Name
export const setCarrierGroupName = (name: string) => {
	localStorage.setItem('carrier_group_name', name);
};
export const getCarrierGroupName = () => {
	return localStorage.getItem('carrier_group_name') || null;
};

// SERVICE PROVIDER ID AND CARRIER ID
export const getServiceProviderAndCarrierIds = () => {
	return { providerId: getProviderId(), carrierId: getCarrierId() };
};

// EXPIRE TIME
export const setExpireTime = (expireTime: string) => {
	localStorage.setItem('expire_time', expireTime);
};

export const getExpireTime = () => {
	return localStorage.getItem('expire_time') || null;
};

export const removeExpireTime = () => {
	localStorage.removeItem('expire_time');
};

// USER DATA
export const setUser = (user: UserAuth) => {
	localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
	return localStorage.getItem('user') || null;
};

export const removeUser = () => {
	localStorage.removeItem('user');
};

// ROLES
export const setRoles = (roles: any[] = []) => {
	localStorage.setItem('roles', JSON.stringify(roles));
};

export const getRoles = () => {
	return localStorage.getItem('roles') || null;
};

export const removeRoles = () => {
	localStorage.removeItem('roles');
};

// SIDEBAR
export const setSidebar = (sidebar: string = 'open') => {
	localStorage.setItem('sidebar', sidebar);
};

export const getSidebar = () => {
	return localStorage.getItem('sidebar') || null;
};

export const removeSidebar = () => {
	localStorage.removeItem('sidebar');
};
