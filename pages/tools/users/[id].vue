<template>
	<main>
		<UModal v-model="editModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit user</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="editModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateUserEdit" :state="formUser" @submit="() => console.log('123')">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Role" name="role">
							<USelectMenu
								size="lg"
								v-model="formUser.role"
								placeholder="Select vehicle"
								value-attribute="id"
								:options="[
									{ label: 'Owner', id: 1 },
									{ label: 'Admin', id: 2 },
									{ label: 'User', id: 3 }
								]"
								:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Name" name="name">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="formUser.name" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Username" name="username">
							<FormInput type="text" :error="error" placeholder="Username" v-model="formUser.username" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Password" name="password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.password" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Confirm password" name="confirm_password">
							<FormInput type="password" :error="error" placeholder="********" v-model="formUser.confirm_password" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="editModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton type="submit" class="w-28 justify-center" size="xl" label="Save" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="permissonsModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Permissions</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="permissonsModal = false" />
				</div>
				<UDivider />
				<UForm :state="formPermissons" @submit="() => console.log('123')">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Role" name="role">
							<USelectMenu
								disabled
								size="lg"
								v-model="formPermissons.role"
								placeholder="Select vehicle"
								value-attribute="id"
								:options="[
									{ label: 'Owner', id: 1 },
									{ label: 'Admin', id: 2 },
									{ label: 'User', id: 3 }
								]"
								:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<ul class="space-y-4">
							<li v-for="p in permissons" :key="p.key" class="flex items-center justify-between px-3">
								<p class="text-black-2 text-sm font-medium dark:text-white/[0.8]">{{ p.label }}</p>
								<UToggle size="md" v-model="formPermissons.permissons[p.key]" />
							</li>
						</ul>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="permissonsModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton type="submit" class="w-28 justify-center" size="xl" label="Save" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="logoutModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Log Out</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="logoutModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you want to log out ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="logoutModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
					/>
					<UButton
						@click="
							logoutModal = false;
							navigateTo('/auth/login');
						"
						class="w-28 justify-center"
						size="xl"
						label="Log out"
						variant="solid"
						:ui="{ rounded: 'rounded-lg' }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="disableModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Disable</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="disableModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] max-w-[80%] text-center dark:text-white/[0.8]">Do you want to disable the user from the system?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="disableModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
					/>
					<UButton @click="disableModal = false" class="w-28 justify-center" size="xl" label="Save" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<div class="flex gap-x-2 items-center">
				<h1 class="title text-lg">Bessie Cooper</h1>
				<div class="px-2 h-6 flex items-center rounded-lg bg-purple/[.1] text-xs font-medium text-black-2 dark:text-white/[0.7]">Admin</div>
				<div class="px-2 h-6 flex items-center rounded-lg bg-purple/[.1]">
					<WifiIcon v-if="true" class="text-purple" />
					<WifiOffIcon v-else class="text-grey-0" />
				</div>
			</div>
			<div class="flex items-center gap-x-3">
				<UPopover class="shrink-0" :popper="{ placement: 'bottom' }">
					<UButton variant="outline" :ui="{ variant: { outline: 'ring-grey-border text-black' }, icon: { base: 'bg-grey-2' } }">
						<template #leading>
							<CalendarIcon class="text-grey-2 w-5" />
						</template>
						{{ headerDate.start?.toISOString().substr(0, 10) }} | {{ headerDate.end?.toISOString().substr(0, 10) }}
					</UButton>
					<template #panel="{ close }">
						<DatePicker v-model="headerDate" is-required @close="close" />
					</template>
				</UPopover>
				<UButton @click="permissonsModal = true" size="sm" variant="soft" label="Permissions" :ui="{ variant: { soft: 'ring-1 ring-purple text-purple bg-purple/[.2]' } }" />
				<UButton @click="editModal = true" size="sm" variant="solid" label="Edit">
					<template #leading>
						<EditIcon class="text-white w-4" />
					</template>
				</UButton>
				<UButton @click="logoutModal = true" size="sm" variant="solid" label="Logout">
					<template #leading>
						<LogoutIcon class="text-white" />
					</template>
				</UButton>
				<UButton @click="disableModal = true" size="sm" variant="solid" label="Disable">
					<template #leading>
						<PowerIcon class="text-white w-4 h-4" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="rows" :ui="{ strategy: 'override', tbody: 'divide-y divide-grey-border dark:divide-white/[0.1]', divide: 'divide-y divide-grey-border dark:divide-white/[0.1]' }">
				<template #duration-data="{ row }">
					{{ row.duration.value }}
				</template>
				<template #action-data="{ row }">
					<UButton size="sm" variant="soft" :ui="{ variant: { soft: 'bg-purple/[.2] hover:bg-purple/[.4] text-purple dark:bg-transparent' } }">
						<template #leading>
							<ClockIcon class="text-purple h-5 w-5" />
						</template>
					</UButton>
				</template>
			</UTable>
			<UPagination
				class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="100"
				v-model="selectedNavigation"
				show-first
				show-last
				:ui="{
					wrapper: 'mx-auto'
				}"
			/>
		</section>
	</main>
</template>

<script setup>
// importing icons
import CalendarIcon from '~/assets/icons/calendar.svg';
import LogoutIcon from '~/assets/icons/log-out-02.svg';
import ClockIcon from '~/assets/icons/clock-rewind.svg';
import PowerIcon from '~/assets/icons/power-02.svg';
import EditIcon from '~/assets/icons/edit-01.svg';
import WifiIcon from '~/assets/icons/wifi.svg';
import WifiOffIcon from '~/assets/icons/wifi-off.svg';

// importing composable
import { useToolsUsersId } from '~/composables/pages/tools/users/id';
const { headerDate, disableModal, logoutModal, editModal, permissonsModal, selectedNavigation, formPermissons, permissons, formUser, validateUserEdit, columns, rows } = await useToolsUsersId();
</script>
