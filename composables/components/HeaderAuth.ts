// import helpers
import { userService } from "~/helpers/user";

// import stores
import { useAuthStore } from '~/store/auth';
import { useUsersStore } from "~/store/users";

export const useHeaderAuthComposable = async () => {
  const user = userService.user;

  const portalUsersStore = useUsersStore();
  const authStore = useAuthStore();

  const onLogout = async () => {
    authStore.logout();
  }

  // header dropdown
  const headerDropdown = ref<boolean>(false);
  const userModal = ref<boolean>(false);
  const logoutModal = ref<boolean>(false);

  // form data
  const formUser = reactive({
    name: userService?.name,
    username: user?.userName,
    password: '',
    passwordConfirm: ''
  });

  const validateUser = () => {
    const errors = [];
    if (!formUser.name) errors.push({ path: 'name', message: errorMessages.blank });
    if (!formUser.username) errors.push({ path: 'username', message: errorMessages.blank });
    if (!formUser.password) errors.push({ path: 'password', message: errorMessages.blank });
    return errors;
  };

  const dropdownItems = [
    [
      {
        label: user?.userName ?? 'Unknown',
        slot: 'username',
        click: () => {
          userModal.value = true;
          formUser.name = userService?.name;
          formUser.username = user?.userName;
        }
      }
    ],
    [
      {
        label: 'Logout',
        slot: 'logout',
        click: () => {
          logoutModal.value = true;
        }
      }
    ]
  ];

  // nav links
  const links = [
    {
      label: 'Carriers',
      to: '/carriers'
    },
    {
      label: 'Manage Clients',
      to: '/clients'
    }
  ];

  // watch(() => userModal.value, (newVal) => {
  //   if (newVal) {
  //     formUser.name = userService?.name;
  //     formUser.username = user?.userName;
  //   }
  // });

  async function updateUser() {
    // const roleIds = (user?.roles?.map((role: RoleResponse) => role.id) ?? []);
    const roleIds = (user?.roles?.map((role: any) => role.id) ?? []);

    const updateUserRequest: any = {
      userName: formUser.username ?? '',
      firstName: formUser.name.split(' ')[0],
      lastName: formUser.name.split(' ')[1],
      email: user?.email ?? '',
      phoneNumber: '',
      password: formUser.password,
      passwordConfirm: formUser.passwordConfirm,
      carrierId: user?.companyId ?? '',
      providerId: user?.providerId ?? '',
      roleIds,
    };

    const ok: boolean = await portalUsersStore.updateUser(updateUserRequest, user?.id!);
    if (ok) {
      userService.changeUserProperty(formUser.username ?? '', formUser.name ?? '');
      resetFormUser();
    }
    return updateUserRequest;
  }

  function resetFormUser() {
    userModal.value = false;

    formUser.name = '';
    formUser.username = '';
    formUser.password = '';
  }

  return {
    user,
    onLogout,
    headerDropdown,
    userModal,
    logoutModal,
    formUser,
    validateUser,
    dropdownItems,
    links,
    updateUser,
    resetFormUser
  }
}