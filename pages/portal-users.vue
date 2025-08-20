<template>
	<main>
		<UModal v-model="statusModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ status ? 'Activated' : 'Deactivated' }}</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="statusModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[.8]">Do you want to {{ status ? 'deactivate' : 'activate' }} ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="statusModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.6]' } }"
					/>
					<UButton
						:disabled="loading"
						:loading="loading"
						@click="submitStatusUser"
						class="min-w-28 justify-center"
						size="xl"
						:label="status ? 'Deactivate' : 'Activate'"
						variant="solid"
						:ui="{ rounded: 'rounded-lg' }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="usersModal" :ui="{ base: 'sm:!max-w-[600px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ isEdit ? 'Edit' : 'Add' }} users</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="usersModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateUser" :state="formUser" @submit.prevent="isEdit ? submitEditUser() : submitAddUser()">
					<div class="w-full gap-y-6 grid-cols-2 grid gap-x-3">
						<UFormGroup class="col-span-2" required v-slot="{ error }" label="Role" name="role">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search roles..."
								placeholder="Select role"
								v-model="formUser.roleId"
								:options="roles"
								option-attribute="name"
								value-attribute="id"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" required label="First Name" name="first_name">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="formUser.firstName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" required label="Last Name" name="last_name">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="formUser.lastName" size="xl" />
						</UFormGroup>
						<UFormGroup class="col-span-2" required v-slot="{ error }" label="Username" name="username">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="formUser.userName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Email" name="email">
							<FormInput type="email" :error="error" placeholder="info@gmail.com" v-model="formUser.email" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Phone number" name="phone_number">
							<FormInput type="text" :error="error" placeholder="(999) 123-8799" v-model="formUser.phoneNumber" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" :required="!isEdit" label="Password" name="password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.password" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" :required="!isEdit" label="Confirm password" name="confirm_password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.passwordConfirm" size="xl" />
						</UFormGroup>
					</div>

					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="usersModal = false"
								class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.6]"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }"
							/>
							<UButton
								:disabled="isUserDisabled"
								:loading="loading"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Save"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">Portal Users</h1>
			<UButton @click="addUser" size="sm" variant="solid" label="Add user">
				<template #leading>
					<PlusCircleIcon class="text-white" />
				</template>
			</UButton>
		</section>
		<section class="mt-3 space-y-3">
			<div v-for="(user, ind) in portalUserRows" :key="ind" style="grid-template-columns: repeat(4, 1fr) 150px" class="card grid">
				<div class="space-y-1">
					<p class="font-bold text-grey-0">Name</p>
					<p class="text-sm font-medium">{{ user.name }}</p>
				</div>
				<div class="space-y-1">
					<p class="font-bold text-grey-0">Email</p>
					<p class="text-sm font-medium">{{ user.email }}</p>
				</div>
				<div class="space-y-1">
					<p class="font-bold text-grey-0">Role</p>
					<p class="text-sm font-medium">{{ user.role }}</p>
				</div>
				<div class="space-y-1">
					<p class="font-bold text-grey-0">Phone number</p>
					<p class="text-sm font-medium">{{ user.phone_number }}</p>
				</div>
				<div class="flex items-center gap-x-8">
					<UButton @click="editUser(user.userId)" size="sm" variant="ghost" label="Edit" :ui="{ variant: { ghost: 'text-purple dark:hover:bg-dark-icon-0/[.2]' } }">
						<template #leading>
							<EditIcon class="w-4" />
						</template>
					</UButton>
					<UToggle @click.capture.stop="statusUser(user.userId)" size="md" :model-value="user.isActive" />
				</div>
			</div>
			<UPagination
				v-if="portalUsersTotal >  10"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="portalUsersTotal"
				v-model="selectedNavigation"
				show-first
				show-last
				:ui="{
					wrapper: 'mx-auto mt-auto'
				}"
			/>
		</section>
	</main>
</template>

<script setup>
// importing icons
import EditIcon from '~/assets/icons/edit-01.svg';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';
import { usePortalUserComposable } from '~/composables/pages/portal-users';

const {
	usersModal,
	portalUsersTotal,
	portalUserRows,
	statusModal,
	formUser,
	selectedNavigation,
	validateUser,
	status,
	roles,
	loading,
	isUserDisabled,
	addUser,
	submitAddUser,
	editUser,
	submitEditUser,
	isEdit,
	statusUser,
	submitStatusUser
} = usePortalUserComposable();
</script>
