<template>
	<main>
		<UModal v-model="addOrUpdateDriverModal" :ui="{ base: 'sm:!max-w-[1000px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ modalSelectedDriverId ? 'Edit Driver' : 'Add Driver' }}</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="closeAddOrUpdateDriverModal" />
				</div>
				<UDivider />
				<UForm :validate="validateDot" :state="driverForm" @submit.prevent="addOrUpdateDriver">
					<div class="w-full grid grid-cols-6 gap-x-6 gap-y-7">
						<UFormGroup v-slot="{ error }" label="Username" class="col-span-2" name="userName">
							<FormInput type="text" :error="error" placeholder="Joanne22" v-model="driverForm.userName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-2" label="Password" name="password">
							<FormInput type="password" :error="error" placeholder="********" v-model="driverForm.password" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-2" label="Confirm password" name="passwordConfirm">
							<FormInput type="password" :error="error" placeholder="********" v-model="driverForm.passwordConfirm"
								size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="First Name" class="col-span-3" name="firstName">
							<FormInput type="text" :error="error" placeholder="Joanne" v-model="driverForm.firstName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Last Name" class="col-span-3" name="lastName">
							<FormInput type="text" :error="error" placeholder="Joanne22" v-model="driverForm.lastName" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Phone number" class="col-span-3" name="phoneNumber">
							<FormInput type="text" :error="error" placeholder="+1 (999) 999-1234" v-maska="'+1 (###) ###-####'" v-model="driverForm.phoneNumber"
								size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Email" class="col-span-3" name="email">
							<FormInput type="email" :error="error" placeholder="info@gmail.com" v-model="driverForm.email" size="xl" />
						</UFormGroup>
						<!-- :options="['612 W 12th Ave, Emporia, KS 66801', '612 W 12th Ave, Emporia, KS 66802', '612 W 12th Ave, Emporia, KS 66803', '612 W 12th Ave, Emporia, KS 66804']" -->
						<UFormGroup class="col-span-3" v-slot="{ error }" label="Home terminal" name="homeTerminalId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search a terminal..."
								v-model="driverForm.homeTerminalId" placeholder="Home terminal" :options="homeTerminalOptions"
								option-attribute="name" value-attribute="id"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup class="col-span-3" v-slot="{ error }" label="Vehicles" name="assignedVehicleIds">
							<USelectMenu size="xl" searchable searchable-placeholder="Search a vehicle..."
								v-model="driverForm.assignedVehicleIds" placeholder="003943" :options="vehicles" value-attribute="id"
								option-attribute="unit"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								multiple>
								<template #label>
									<span v-if="driverForm.assignedVehicleIds?.length" class="truncate">{{
										driverForm.assignedVehicleIds.map(vehicleId =>
											vehicles.filter(p => p.unit !== '').find(p => p.id === vehicleId)?.unit).join(', ')
									}}</span>
									<span v-else>Select vehicle</span>
								</template>
							</USelectMenu>
						</UFormGroup>
							<UFormGroup v-slot="{ error }" class="col-span-3" label="Issuer State Parent" name="issuerStateId">
								<USelectMenu
									size="lg"
									searchable
									searchable-placeholder="Search an issuer state parent..."
									v-model="issuerStateParentId"
									placeholder="Issuer State parent"
									:options="parentIssuerStates"
									value-attribute="id"
									option-attribute="name"
									:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								/>
							</UFormGroup>
							<UFormGroup v-slot="{ error }" class="col-span-3" label="Issuer State" required name="issuerStateId">
								<USelectMenu
									size="lg"
									v-model="driverForm.issuerStateId"
									class="w-full"
									placeholder="Issuer State"
									searchable
									searchable-placeholder="Search an issuer state..."
									:options="filterIssuerStatesByParent(issuerStateParentId, issuerStates)"
									value-attribute="id"
									option-attribute="name"
									:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
								/>
							</UFormGroup>
						<!-- <UFormGroup class="col-span-6" v-slot="{ error }" label="Driving license issuing state" name="issuerStateId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search an issuer state..."
								v-model="driverForm.issuerStateId" placeholder="Select State / Province" :options="issuerStates"
								value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup> -->
						<UFormGroup v-slot="{ error }" label="Driving license number" class="col-span-6" name="licenseNumber">
							<FormInput type="text" :error="error" placeholder="License Number" v-model="driverForm.licenseNumber"
								size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-4 mt-6">
						<div class="flex items-center gap-x-4">
							<h3 class="font-semibold shrink-0">Log Settings</h3>
							<UDivider />
						</div>
						<div class="grid grid-cols-1 gap-x-6 gap-y-4">
							<div class="grid grid-cols-2 gap-x-6 gap-y-4">
								<!-- <label v-for="log in logSettings" :key="log.value"
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.log_settings[log.value]" />
									<span class="font-medium text-sm">{{ log.label }}</span>
								</label> -->
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.exemptDriver" />
									<span class="font-medium text-sm"> Exempt Driver</span>
								</label>
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.shortHaulException" />
									<span class="font-medium text-sm">Short Haul Exception</span>
								</label>
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.allowPersonalUse" />
									<span class="font-medium text-sm">Allow Personal Use</span>
								</label>
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.allowYardMoves" />
									<span class="font-medium text-sm">Allow Yard Move</span>
								</label>
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.unlimitedTrailers" />
									<span class="font-medium text-sm">Unlimited Trailers</span>
								</label>
								<label
									class="px-4 py-2 rounded-lg bg-black-0/[.04] border border-grey-border flex items-center gap-x-2 cursor-pointer dark:border-white/[0.1] dark:bg-dark-3">
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="driverForm.unlimitedShippingDocuments" />
									<span class="font-medium text-sm">Unlimited Shipping Documents</span>
								</label>
							</div>
						</div>
					</div>
					<div class="mt-4 mb-8 grid grid-cols-2 gap-x-6 gap-y-5">
						<UFormGroup v-slot="{ error }" label="HOS Roles" name="hosRuleId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search hos roles..." placeholder="HOS Roles"
								v-model="driverForm.hosRuleId" :options="hosRoles" value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
							<!-- <FormInput type="text" :error="error" placeholder="HOS Roles" size="xl"
								v-model="driverForm.hosRuleId" /> -->
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Cargo Type" name="cargoTypeId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search cargo types..." placeholder="Cargo Type"
								v-model="driverForm.cargoTypeId" :options="cargoTypes" value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
							<!-- <FormInput type="text" :error="error" placeholder="Cargo Type" size="xl"
								v-model="driverForm.cargoTypeId" /> -->
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Restart" name="restartId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search restarts..." placeholder="Restart"
								v-model="driverForm.restartId" :options="restarts" value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
							<!-- <FormInput type="text" :error="error" placeholder="Restart" size="xl"
								v-model="formCreate.carrierDriverLogSetting.restartId" /> -->
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Rest Break" name="restBreakId">
							<USelectMenu size="lg" searchable searchable-placeholder="Search rest breaks..." placeholder="Rest Break"
								v-model="driverForm.restBreakId" :options="restBreaks" value-attribute="id" option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
							<!-- <FormInput type="text" :error="error" placeholder="Rest Break" size="xl"
								v-model="formCreate.carrierDriverLogSetting.restBreakId" /> -->
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="closeAddOrUpdateDriverModal" class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl"
								label="Cancel" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
							<UButton :disabled="isAddOrUpdateDriverDisabled" :loading="loading" @click="addOrUpdateDriver" type="submit"
								class="w-28 justify-center" size="xl" :label="modalSelectedDriverId ? 'Edit' : 'Create'" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>

		<UModal v-model="activateModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Driver</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="closeStatusModal" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you really want to {{ statusDriverModal ?
						'deactivate' : 'activate'
					}} ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton @click="closeStatusModal" class="w-28 justify-center" size="xl" label="Cancel" variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0' } }" />
					<UButton :disabled="loading" :loading="loading" @click.prevent="changeDriverStatus(modalSelectedDriverId)"
						class="w-28 justify-center" size="xl" :label="statusDriverModal ? 'Deactivate' : 'Activate'" variant="solid"
						:ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>

		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">Drivers</h1>
			<div class="flex items-center gap-x-3">
				<UFormGroup name="driverSearch">
					<USelectMenu size="md" v-model="selectedDriver" placeholder="Driver search" searchable
						searchable-placeholder="Search a driver..."
						:options="drivers && drivers.length > 0 ? [{ id: 'all', fullname: 'All Drivers' }, ...driverOptions] : []"
						value-attribute="id" option-attribute="fullname"
						:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
				</UFormGroup>
				<UFormGroup name="statusSearch">
					<USelectMenu size="md" v-model="selectedStatus" placeholder="Select status"
						:options="statusOptions && statusOptions.length > 0 ? [{ value: 'all', label: 'All Status' }, ...statusOptions] : []"
						value-attribute="value" option-attribute="label"
						:ui="{ wrapper: 'w-36', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
				</UFormGroup>
				<UButton @click="openAddOrUpdateDriverModal()" size="sm" variant="solid" label="Add driver">
					<template #leading>
						<PlusCircleIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="filteredRows">
				<template #status-data="{ row }">
					<div class="flex items-center gap-x-4">
						<UButton @click="openAddOrUpdateDriverModal(row.id)" size="sm" variant="soft"
							:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0 text-purple' } }">
							<template #leading>
								<EditIcon class="text-purple dark:text-dark-icon-0" @click="openAddOrUpdateDriverModal(row.id)" />
							</template>
						</UButton>
						<UToggle size="md" v-model="row.status" @click.prevent="openStatusModal(row.id)" />
					</div>
				</template>
				<template #app_version-data="{ row }">
					<p class="font-medium">
						<span class="font-extrabold">{{ row.app_version?.version ? `(${row.app_version.version})` : ''
						}}</span>
						{{ row.app_version || 'N/A' }}
					</p>
				</template>
			</UTable>
			<UPagination v-if="driversTotal > pageSize" class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="driversTotal" v-model="selectedNavigation" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}" />
		</section>
	</main>
</template>

<script setup>
// importing icons
import EditIcon from '~/assets/icons/edit-02.svg';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';
import { useCarrier } from '~/composables/pages/carrier';
// importing composables
import { useDrivers } from '~/composables/pages/drivers';

// importing helpers
import { filterIssuerStatesByParent } from '~/helpers/issuerState';
const {
	loading,
	isAddOrUpdateDriverDisabled,
	homeTerminalOptions,
	addOrUpdateDriverModal,
	closeAddOrUpdateDriverModal,
	addOrUpdateDriver,
	modalSelectedDriverId,
	currentPage,
	pageSize,
	selectedDriver,
	selectedStatus,
	drivers,
	driverOptions,
	driversTotal,
	activateModal,
	driverForm,
	logSettings,
	// issuerStates,
	vehicles,
	validateDot,
	selectedDriverId,
	openEditDriverModal,
	columns,
	filteredRows,
	filterStatus,
	statusOptions,
	activateDriver,
	openActivateDriverModal,
	openAddOrUpdateDriverModal,
	issuerStateParentId,
	hosRoles,
	cargoTypes,
	restarts,
	restBreaks,
	openStatusModal,
	closeStatusModal,
	statusDriverModal,
	changeDriverStatus,
} = await useDrivers();
const { parentIssuerStates, issuerStates } = await useCarrier();

</script>
