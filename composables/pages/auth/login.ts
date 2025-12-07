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
		phoneNumber: '+998',
		tempPassword: ''
	});

	const isDisabled = computed(() => {
		return (
			!form.phoneNumber || 
			form.phoneNumber.length !== 13 || 
			!form.tempPassword || 
			form.tempPassword.length !== 6 || 
			loading.value
		);
	});

	// Phone number formatlash funksiyasi
	const formatPhoneNumber = (value: string): string => {
		let digits = value.replace(/\D/g, '');
		
		if (digits.startsWith('998')) {
			digits = digits.slice(3);
		}
		
		const formatted = '+998' + digits.slice(0, 9);
		
		return formatted;
	};
	
	// Phone number watch
	watch(
		() => form.phoneNumber,
		(newValue) => {
			if (!newValue.startsWith('+998')) {
				form.phoneNumber = formatPhoneNumber(newValue);
			} else {
				const digits = newValue.slice(4).replace(/\D/g, '');
				form.phoneNumber = '+998' + digits.slice(0, 9);
			}
		}
	);

	// Temporary password watch
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
			console.log(isAdmin);
			
			if (isAdmin) {
				router.push('/listening/books');
			} else {
				authStore.logout();
				addError('But you have no permission');
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