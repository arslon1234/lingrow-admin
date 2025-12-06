import { useAuthStore } from '~/store/auth';
import { useUsersStore } from '~/store/users';
import { addError } from '~/helpers/notification';
import { LoginValidationSchema } from '~/schemas/login/LoginSchema';
export const useLoginComposable = async () => {
	const authStore = useAuthStore();
	const usersStore = useUsersStore();
	const { loading } = storeToRefs(authStore);
	const router = useRouter();
	const form = reactive({
		phoneNumber: '',
		tempPassword: ''
	});

	const isDisabled = computed(() => {
		return !form.phoneNumber || !form.tempPassword || form.tempPassword.length !== 6 || loading.value;
	});

	watch(
		() => form.phoneNumber,
		(newValue) => {
			if (newValue && !newValue.startsWith('+998')) {
				if (newValue.startsWith('998')) {
					form.phoneNumber = '+' + newValue;
				} else if (newValue.startsWith('+')) {
					form.phoneNumber = '+998' + newValue.slice(1);
				} else {
					form.phoneNumber = '+998' + newValue;
				}
			}
			form.phoneNumber = form.phoneNumber.replace(/[^\d+]/g, '');
		}
	);

	watch(
		() => form.tempPassword,
		(newValue) => {
			form.tempPassword = newValue.replace(/\D/g, '').slice(0, 6);
		}
	);

	const handleSubmit = async () => {
		await authStore.login(form);

		if (usersStore.currentUser) {
			const { roles } = usersStore.currentUser;
			const isAdmin = roles.some((item: any) => item.name === 'ADMIN');
			console.log(isAdmin)
			if (isAdmin) {
				router.push('/listening/books');
			}else {
				authStore.logout()
				addError('But you have no permission')
			}
		}
		
	};

	return {
		LoginValidationSchema,
		form,
		handleSubmit,
		loading,
		isDisabled
	};
};
