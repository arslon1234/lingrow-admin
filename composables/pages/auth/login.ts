// importing schemas
import { LoginValidationSchema } from '~/schemas/login/LoginSchema';

// importing stores
import { useAuthStore } from '~/store/auth';

export const useLoginComposable = async () => {
	const authStore = useAuthStore();
	const loading = ref(false);

	// Reactive form object
	const form = reactive({
		username: '',
		password: ''
	});

	// Disable the form button based on loading state or validation
	const isDisabled = computed(() => {
		return loading.value || !LoginValidationSchema.safeParse(form).success;
	});

	const handleSubmit = async () => {
		try {
			loading.value = true;
			await authStore?.login(form);
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			loading.value = false;
		}
	};

	return { LoginValidationSchema, form, handleSubmit, loading, isDisabled };
}
