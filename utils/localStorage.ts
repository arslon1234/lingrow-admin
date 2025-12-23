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
