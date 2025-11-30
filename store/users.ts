import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addError, addSuccess } from '~/helpers/notification';

export const useUsersStore = defineStore('users', () => {
	const currentUser = ref<UserResponse>();

	async function getUsers() {
		const result = await useAxios().getRequest(ApiUrls.USERS_URL);
		if (result.status === 200) {
			currentUser.value = result.data;
		}
	}

	return {
		currentUser,
		getUsers
	};
});
