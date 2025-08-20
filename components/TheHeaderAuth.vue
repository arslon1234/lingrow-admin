<template>
	<header class="container mt-3">
		<UModal v-model="userModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">User Profile</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="userModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateUser" :state="formUser" @submit="updateUser" @cancel="resetFormUser">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Name" name="name">
							<FormInput type="text" :error="error" placeholder="Edit Name" v-model="formUser.name" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Username" name="username">
							<FormInput type="text" :error="error" placeholder="Edit Username" v-model="formUser.username" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Password" name="password">
							<FormInput type="password" :error="error" placeholder="Edit Password" v-model="formUser.password"
								size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="userModal = false" class="w-28 justify-center" size="xl" label="Cancel" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }" />
							<UButton type="submit" class="w-28 justify-center" size="xl" label="Save" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="logoutModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Log Out</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="logoutModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you want to log out ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton @click="logoutModal = false" class="w-28 justify-center" size="xl" label="No" variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }" />
					<UButton @click="
						logoutModal = false;
					onLogout();
					navigateTo('/auth/login');
					" class="w-28 justify-center" size="xl" label="Yes" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<div class="rounded-lg px-4 bg-white flex items-center justify-between dark:bg-dark-0">
			<UHorizontalNavigation :links="links"
				:ui="{ base: 'py-3 font-semibold text-base', active: 'text-purple after:bg-purple dark:text-dark-icon-0 ', inactive: 'text-black  dark:text-white/[0.8]' }" />
			<UDropdown class="shrink-0" v-model:open="headerDropdown" :items="dropdownItems" :popper="{ placement: 'bottom' }"
				:ui="{ width: 'w-32', rounded: 'rounded-lg', ring: 'ring-grey-border', divide: 'divide-grey-border dark:divide-white/[0.05]', background: 'dark:bg-dark-0' }">
				<UButton label="Route Eld Team" size="sm" variant="soft"
					:ui="{ variant: { soft: 'ring-1 ring-purple/[.2] bg-purple/[.08] text-purple hover:bg-purple/[.3] uppercase  dark:ring-dark-button_border-0 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] dark:text-dark-icon-0' } }" />
				<template #username="{ item }">
					<div class="flex gap-x-2 items-center truncate">
						<UserIcon class="h-5 w-5 text-background-grey_1 shrink-0" />
						<p class="truncate font-medium text-gray-900 dark:text-white/[0.8] pr-2">
							{{ item.label }}
						</p>
					</div>
				</template>
				<template #logout="{ item }">
					<div class="flex gap-x-2 items-center">
						<LogoutIcon class="h-5 w-5 text-background-grey_1 shrink-0" />
						<p class="truncate font-medium text-black dark:text-white/[0.8]">
							{{ item.label }}
						</p>
					</div>
				</template>
			</UDropdown>
		</div>
	</header>
</template>

<script setup>
// import icons
import LogoutIcon from '~/assets/icons/log-out-02.svg';
import UserIcon from '~/assets/icons/user-02.svg';

import { useHeaderAuthComposable } from '~/composables/components/HeaderAuth';

const {
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
} = await useHeaderAuthComposable();

</script>
