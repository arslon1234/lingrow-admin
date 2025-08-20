// importing stores
import { useRolesStore } from "~/store/roles";
import { usePortalUsersStore } from "~/store/portalUsers";

import { mergeObjectValues } from "~/utils/objectValues";

export const usePortalUserComposable = () => {
  const portalUsersStore = usePortalUsersStore();
  const rolesStore = useRolesStore();

  // route
  const route = useRoute();

  const { roles } = storeToRefs(rolesStore);
  const { portalUsers, portalUsersTotal } = storeToRefs(portalUsersStore);

  const portalUserRows = computed(() => portalUsers.value.map((user: UsersResponse, ind) => ({
    userId: user.id,
    id: ind + 1,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email || "N/A",
    role: user.role ? user.role.name : "N/A",
    phone_number: user.phoneNumber || "N/A",
    isActive: user.isActive
  })));

  // modals
  const usersModal = ref<boolean>(false);
  const statusModal = ref<boolean>(false);

  // pagination
  const selectedNavigation = ref<number>(parseInt(route.query.pageNumber as string) || 1);

  watch(selectedNavigation, async (newValue) => {
    if (newValue <= 1) await navigateTo('/portal-users')
    else await navigateTo({ query: { pageNumber: newValue, pageSize: 10 } });

    await portalUsersStore.getUsers();
  });

  // loadings
  const loading = ref<boolean>(false);

  // edit or add
  const isEdit = ref<boolean>(false);
  const editedId = ref<string | null>(null);

  // status of user
  const status = ref<boolean | null>(null);
  const statusId = ref<string | null>(null);

  // modal user form
  const formUser = reactive<UsersRequest>({
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    phoneNumber: null,
    password: null,
    passwordConfirm: null,
    providerId: getProviderId(),
    carrierId: getCarrierId(),
    roleId: null
  });

  const validateUser = () => {
    const errors = [];

    if (!formUser.firstName) errors.push({ path: 'first_name', message: errorMessages.blank });
    if (!formUser.lastName) errors.push({ path: 'last_name', message: errorMessages.blank });
    if (!formUser.userName) errors.push({ path: 'username', message: errorMessages.blank });
    if (!formUser.password && !isEdit.value) errors.push({ path: 'password', message: errorMessages.blank });
    if (!formUser.passwordConfirm && !isEdit.value) errors.push({ path: 'confirm_password', message: errorMessages.blank });
    if ((formUser.passwordConfirm !== formUser.password && !isEdit.value) || (isEdit.value && formUser.password && formUser.passwordConfirm !== formUser.password)) errors.push({ path: 'confirm_password', message: `Password doesn't match` });
    if (!formUser.roleId) errors.push({ path: 'role', message: errorMessages.blank });
    return errors;
  };

  // status of user
  const statusUser = (id: string) => {
    const user = portalUsers.value.find(user => user.id === id);
    status.value = user?.isActive as boolean;
    statusId.value = user?.id as string;
    statusModal.value = true;
  }

  const submitStatusUser = async () => {
    try {
      loading.value = true;
      await portalUsersStore.updateStatusUser(status.value ? 1 : 0, statusId.value as string);
    } catch (error) {
      console.log(error);
    } finally {
      statusModal.value = false;
      await portalUsersStore.getUsers();
      statusId.value = null;
      loading.value = false;
    }
  }

  // add User
  const addUser = () => {
    isEdit.value = false;
    editedId.value = null;
    clearObject(formUser);
    formUser.providerId = getProviderId();
    formUser.carrierId = getCarrierId();
    usersModal.value = true;
  }

  // submit add User
  const submitAddUser = async () => {
    try {
      loading.value = true;
      await portalUsersStore.addUser(formUser);
    } catch (error) {
      console.log(error);
    } finally {
      usersModal.value = false;
      await portalUsersStore.getUsers();
      loading.value = false;
      clearObject(formUser);
    }
  }

  // edit User
  const editUser = (id: string) => {
    isEdit.value = true;
    editedId.value = id;
    const user = portalUsers.value.find(user => user.id === id);
    clearObject(formUser);
    mergeObjectValues(formUser, user as any);
    formUser.providerId = getProviderId();
    formUser.carrierId = getCarrierId();
    formUser.roleId = user?.role?.id as string;
    usersModal.value = true
  }

  // submit edit User
  const submitEditUser = async () => {
    try {
      loading.value = true;
      if (!formUser.password || !formUser.passwordConfirm) {
        formUser.password = '';
        formUser.passwordConfirm = '';
      }
      await portalUsersStore.updateUser(formUser, editedId.value as string);
    } catch (error) {
      console.log(error);
    } finally {
      usersModal.value = false;
      isEdit.value = false;
      editedId.value = null;
      await portalUsersStore.getUsers();
      loading.value = false;
      clearObject(formUser);
    }
  }

  // modal form additionals
  const isUserDisabled = computed(() => loading.value || !!validateUser().length)

  onMounted(async () => {
    await Promise.all([
      portalUsersStore.getUsers(),
      rolesStore.getRoles()
    ])
  });

  return {
    usersModal,
    statusModal,
    selectedNavigation,
    formUser,
    portalUsersTotal,
    portalUserRows,
    validateUser,
    roles,
    status,
    loading,
    isUserDisabled,
    isEdit,
    addUser,
    submitAddUser,
    submitEditUser,
    editUser,
    statusUser,
    submitStatusUser
  }
}