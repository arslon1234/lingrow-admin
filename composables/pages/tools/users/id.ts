// importing packages
import dayjs, {Dayjs} from 'dayjs';

export const useToolsUsersId = async () => {
	// header data
	const headerDate = ref<DatePicker>({ start: dayjs(), end: dayjs() });

	// modals
	const disableModal = ref(false);
	const logoutModal = ref(false);
	const editModal = ref(false);
	const permissonsModal = ref(false);

	// pagination
	const selectedNavigation = ref(1);

	// modal permissions form
	const formPermissons = reactive({
		role: 1,
		permissons: {
			activity: false,
			history: false,
			monitoring: false,
			dot_inspection: false,
			statistics: false
		}
	});

	const permissons = [
		{ label: 'Activity', key: 'activity' },
		{ label: 'History', key: 'history' },
		{ label: 'Monitoring', key: 'monitoring' },
		{ label: 'DOT Inspection', key: 'dot_inspection' },
		{ label: 'Statistics', key: 'statistics' }
	];

	// modal user edit form
	const formUser = reactive({
		role: 1,
		name: 'Bassie Cooper',
		username: 'timurov07',
		password: '123',
		confirm_password: '123',
		showPassword: false,
		showPasswordConfirm: false
	});

	const validateUserEdit = () => {
		const errors = [];
		if (!formUser.role) errors.push({ path: 'role', message: errorMessages.blank });
		if (!formUser.name) errors.push({ path: 'name', message: errorMessages.blank });
		if (!formUser.username) errors.push({ path: 'username', message: errorMessages.blank });
		if (!formUser.password) errors.push({ path: 'password', message: errorMessages.blank });
		if (!formUser.confirm_password) errors.push({ path: 'confirm_password', message: errorMessages.blank });
		if (formUser.confirm_password !== formUser.password) errors.push({ path: 'confirm_password', message: `Password doesn't match` });
		return errors;
	};

	// table data
	const columns = [
		{ label: 'No', key: 'id', class: 'w-20' },
		{ label: 'Company', key: 'company' },
		{ label: 'Driver', key: 'driver' },
		{ label: 'Period', key: 'period' },
		{ label: 'Shift/Repair', key: 'duration' },
		{ label: 'Created (Data/time)', key: 'created' },
		{ label: 'Actions', key: 'action', class: 'w-36' }
	];

	const rows = [
		{
			id: 1,
			company: 'Darlene',
			driver: 'johndoe',
			period: 'Admin',
			duration: { value: '03:31 h', class: 'text-purple' },
			created: '2021/09/01 12:00 am'
		},
		{
			id: 2,
			company: 'Darlene',
			driver: 'johndoe',
			period: 'Admin',
			duration: { value: '03:31 h', class: 'text-purple' },
			created: '2021/09/01 12:00 am'
		},
		{
			id: 3,
			company: 'Darlene',
			driver: 'johndoe',
			period: 'Admin',
			duration: { value: '03:31 h', class: 'text-purple' },
			created: '2021/09/01 12:00 am'
		},
		{
			id: 4,
			company: 'Darlene',
			driver: 'johndoe',
			period: 'Admin',
			duration: { value: '03:31 h', class: 'text-purple' },
			created: '2021/09/01 12:00 am'
		},
		{
			id: 5,
			company: 'Darlene',
			driver: 'johndoe',
			period: 'Admin',
			duration: { value: '03:31 h', class: 'text-purple' },
			created: '2021/09/01 12:00 am'
		}
	];

  return {
    headerDate,
    disableModal,
    logoutModal,
    editModal,
    permissonsModal,
    selectedNavigation,
    formPermissons,
    permissons,
    formUser,
    validateUserEdit,
    columns,
    rows
  }
};
