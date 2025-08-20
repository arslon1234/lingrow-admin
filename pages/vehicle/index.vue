<template>
	<main>
		<UModal v-model="activateModal" :ui="{ base: 'sm:!max-w-[450px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ statusVehicleModal ? 'Activated' : 'Deactivated' }}</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="activateModal = false" />
				</div>
				<UDivider />
				<div class="flex items-center justify-center h-16">
					<h3 class="font-semibold text-black/[.7] dark:text-white/[0.8]">Do you want to {{ statusVehicleModal ? 'deactivate' : 'activate' }} ?</h3>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="closeStatusModal"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
					/>
					<UButton
						:disabled="loading"
						:loading="loading"
						@click="changeVehicleStatus(modalSelectedVehicleId)"
						class="w-28 justify-center"
						size="xl"
						:label="statusVehicleModal ? 'Deactivate' : 'Activate'"
						variant="solid"
						:ui="{ rounded: 'rounded-lg' }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="addOrUpdateVehicleModal" :ui="{ base: 'sm:!max-w-[670px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ modalSelectedVehicleId ? 'Update vehicle' : 'Add vehicle' }}</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeAddOrUpdateVehicleModal" />
				</div>
				<UDivider />
				<UForm :validate="validateVehicle" :state="formVehicle" @submit="addOrUpdateVehicle">
					<div class="w-full grid grid-cols-2 gap-x-6 gap-y-7">
						<UFormGroup v-slot="{ error }" label="Unit" name="unit">
							<FormInput type="text" :error="error" placeholder="1200358" v-model="formVehicle.unit" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Year" name="manufactureYear">
							<FormInput type="number" :error="error" placeholder="2024" v-model.number="formVehicle.manufactureYear" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Make" name="make">
							<FormInput type="text" :error="error" placeholder="FRHT" v-model="formVehicle.make" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Model" name="model">
							<FormInput type="text" :error="error" placeholder="TT" v-model="formVehicle.model" size="xl" />
						</UFormGroup>

						<div class="col-span-2 grid grid-cols-2 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" class="col-span-1" label="Issuer State Parent" name="issuerStateId">
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
							<UFormGroup v-slot="{ error }" label="Issuer State" class="col-span-" required name="issuerStateId">
								<USelectMenu
									size="lg"
									class="w-full"
									v-model="licensePlate.issuerStateId"
									placeholder="Issuer State"
									searchable
									searchable-placeholder="Search an issuer state..."
									:options="filterIssuerStatesByParent(issuerStateParentId, issuerStates)"
									value-attribute="id"
									option-attribute="name"
									:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
								/>
							</UFormGroup>
						</div>

						<UFormGroup v-slot="{ error }" class="col-span-2" label="License plate number" name="plateNumber">
							<FormInput type="text" :error="error" placeholder="993044" v-model="licensePlate.plateNumber" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-2" label="ELD connection interface" name="eldVehicleConnectionId">
							<USelectMenu
								size="lg"
								v-model="formVehicle.eldVehicleConnectionId"
								searchable
								searchable-placeholder="Search a vehicle connection..."
								placeholder="Select ELD connection interface"
								:options="eldConnectionInterfaces"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-2" label="Fuel" name="vehicleFuelId">
							<USelectMenu
								size="lg"
								v-model="formVehicle.vehicleFuelId"
								placeholder="Diesel"
								:options="fuels"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							class="col-span-2 pb-16"
							label="VIN"
							name="vin"
							:ui="{ error: 'top-[95%]' }"
							help="You may not modify the VIN on existing vehicle. To change the VIN you can create a new vehicle with that VIN and deactivate the current vehicle. Please contact technical support if you have questions or concerns e"
						>
							<FormInput type="text" :error="error" placeholder="210L003AQ1" v-model="formVehicle.vin" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="closeAddOrUpdateVehicleModal"
								class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }"
							/>
							<UButton
								:disabled="isAddOrUpdateVehicleDisabled"
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
			<h1 class="title text-lg">Vehicles</h1>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedVehicle"
					placeholder="Select vehicle"
					searchable
					searchable-placeholder="Search a vehicle..."
					:options="vehicles && vehicles.length ? [{ id: 'all', unit: 'All vehicles' }, ...vehicles] : []"
					value-attribute="id"
					option-attribute="unit"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<USelectMenu
					size="md"
					v-model="selectedStatus"
					placeholder="Select status"
					searchable
					:options="['All Status', 'Active', 'Inactive']"
					:ui="{ wrapper: 'w-36', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UButton @click="openAddOrUpdateVehicleModal()" size="sm" variant="solid" label="Add vehicle">
					<template #leading>
						<PlusCircleIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="filteredVehicleRowDatas" :ui="{
							td: { base: '!font-medium' }
						}">
				<template #status-data="{ row }">
					<div class="flex items-center gap-x-4">
						<UButton
							size="sm"
							variant="soft"
							@click="openAddOrUpdateVehicleModal(row.id)"
							:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0 text-purple' } }"
						>
							<template #leading>
								<EditIcon class="text-purple dark:text-dark-icon-0 w-4" />
							</template>
						</UButton>
						<UToggle @click.prevent="openStatusModal(row.id)" size="md" v-model="row.status" />
						<UButton
							:to="`/vehicle/${row.id}`"
							size="sm"
							variant="soft"
							:ui="{ variant: { soft: 'bg-purple/[.04] hover:bg-purple/[.06] dark:bg-dark-icon-0/[.2] dark:hover:bg-dark-icon-0/[.4] dark:text-dark-icon-0 text-purple' } }"
						>
							<template #leading>
								<EyeIcon class="text-purple dark:text-dark-icon-0 w-4" />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination
				v-if="vehiclesTotal > pageSize"
				class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:page-count="pageSize"
				:total="vehiclesTotal"
				v-model="currentPage"
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
import EditIcon from '~/assets/icons/edit-01.svg';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';
import EyeIcon from '~/assets/icons/eye.svg';
import { useCarrier } from '~/composables/pages/carrier';
import { useVehiclesComposable } from '~/composables/pages/vehicles';

import { filterIssuerStatesByParent } from '~/helpers/issuerState';
const {
	isAddOrUpdateVehicleDisabled,
	loading,
	selectedStatus,
	selectedVehicle,
	modalSelectedVehicleId,
	statusVehicleModal,
	addOrUpdateVehicleModal,
	closeAddOrUpdateVehicleModal,
	addOrUpdateVehicle,
	resetForm,
	changeVehicleStatus,
	activateModal,
	formVehicle,
	licensePlate,
	validateVehicle,
	eldConnectionInterfaces,
	columns,
	people,
	vehicles,
	filteredVehicleRowDatas,
	fuels,
	issuerStateOptions,
	fuelOptions,
	openAddOrUpdateVehicleModal,
	openStatusModal,
	vehiclesTotal,
	currentPage,
	pageSize,
	closeStatusModal,
	issuerStateParentId
} = await useVehiclesComposable();

const { parentIssuerStates, issuerStates } = await useCarrier();
</script>
