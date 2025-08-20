<template>
	<main class="h-[calc(100dvh-72px)] flex flex-col">
		<UModal v-model="createModal" :ui="{ base: 'sm:!max-w-[850px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Create Carrier</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
						icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeAddCarrierModal" />
				</div>
				<UDivider />
				<UForm :validate="validateFormCreate" :state="formCreate" @submit="addCarrier">
					<div class="w-full gap-y-6 gap-x-6">
						<div class="grid grid-cols-2 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="Carrier Name" required name="name">
								<FormInput type="text" :error="error" placeholder="Edit Carrier Name"
									v-model="formCreate.name" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Phone" required name="phoneNumber">
								<FormInput type="tel" :error="error" v-maska="'+1 (###) ###-####'" placeholder="Edit Phone"
									v-model="formCreate.phoneNumber" size="xl" />
							</UFormGroup>
						</div>
						<div class="grid grid-cols-2 mt-4 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="USDOT" required name="usdotNumber">
								<FormInput type="text" :error="error" placeholder="Edit USDOT"
									v-model="formCreate.usdotNumber" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Email" required name="email">
								<FormInput type="email" :error="error"  placeholder="Edit Email"
									v-model="formCreate.email" size="xl" />
							</UFormGroup>
						</div>
						<div class="grid grid-cols-2 mt-4 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="Street" required name="city">
								<FormInput type="text" :error="error" placeholder="Street" v-model="formCreate.city"
									size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="City" required name="street">
								<FormInput type="text" :error="error" placeholder="City" v-model="formCreate.street"
									size="xl" />
							</UFormGroup>
						</div>
						<div class="grid grid-cols-3 mt-4 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="Issuer State Parent" class="mt-3" required
								name="issuerStateParentId">
								<USelectMenu size="lg" class="w-full" v-model="issuerStateParentId"
									placeholder="Issuer State parent" searchable
									searchable-placeholder="Search an issuer state parent..."
									:options="parentIssuerStates" value-attribute="id" option-attribute="name"
									:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Issuer State" class="mt-3" required
								name="issuerStateId">
								<USelectMenu size="lg" class="w-full" v-model="formCreate.issuerStateId"
									placeholder="Issuer State" searchable
									searchable-placeholder="Search an issuer state..."
									:options="filterIssuerStatesByParent(issuerStateParentId, issuerStates)"
									value-attribute="id" option-attribute="name"
									:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Zipcode" class="mt-3" required name="zipCode">
								<FormInput type="text" :error="error" placeholder="Zipcode" v-model="formCreate.zipCode"
									size="xl" />
							</UFormGroup>
						</div>
						<UFormGroup v-slot="{ error }" label="Time zone" class="col-span-2 mt-4" required
							name="timeZoneId">
							<div class="grid grid-cols-5 mt-4 gap-y-6 gap-x-6">
								<UButton @click="formCreate.timeZoneId = timeZone.id" v-for="timeZone in timeZones"
									:label="timeZone.shortName" size="lg" class="justify-center flex-1"
									:variant="timeZone.id === formCreate.timeZoneId ? 'solid' : 'outline'"
									:ui="{ variant: { outline: 'ring-grey-border bg-black-0/[.04] hover:bg-black-0/[.08] text-black dark:ring-white/[0.1] dark:text-white/[0.6] dark:hover:bg-white/[0.1] dark:bg-white/[0.05] ' + (!!error && 'ring-red-500 text-red-500 bg-white'), solid: 'bg-purple hover:bg-purple/[.8]' } }" />
							</div>
						</UFormGroup>
					</div>
					<!-- <div class="grid grid-cols-3 mt-4 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="Home Terminal Address" required name="home_terminal_address">
								<FormInput type="text" :error="error" placeholder="Edit Home Terminal Address"
									v-model="formCreate.home_terminal_address" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Home Terminal Street" required name="home_terminal_address">
								<FormInput type="text" :error="error" placeholder="Edit Home Terminal Address"
									v-model="formCreate.home_terminal_address" size="xl" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Home Terminal ZipCode" required name="home_terminal_address">
								<FormInput type="text" :error="error" placeholder="Edit Home Terminal Address"
									v-model="formCreate.home_terminal_address" size="xl" />
							</UFormGroup>
						</div> -->
					<!-- <UDivider class="mt-6" />
					<div class="w-full">
						<h1 class="text-md font-bold mt-4 mb-3">Default Driver Log Settings</h1>
						<div class="w-full grid grid-cols-2 gap-y-6 gap-x-6">
							<UFormGroup v-slot="{ error }" label="HOS Rules" required>
								<USelectMenu size="lg" searchable placeholder="Select hos rule" value-attribute="id" :options="[
									{ label: 'USA 70 hour / 8 day', id: 1 },
									{ label: 'USA 70 hour / 9 day', id: 2 },
									{ label: 'USA 70 hour / 10 day', id: 3 }
								]" :ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Cargo Type" required>
								<USelectMenu size="lg" searchable placeholder="Select cargo type" value-attribute="id" :options="[
									{ label: 'Property', id: 1 },
									{ label: 'Passenger', id: 2 },
									{ label: 'Gas', id: 3 }
								]" :ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Restart" required>
								<USelectMenu size="lg" searchable placeholder="Select hos rule" value-attribute="id" :options="[
									{ label: '34 Hour Start', id: 1 },
									{ label: '24 Hour Start', id: 2 },
								]" :ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }" />
							</UFormGroup>
							<UFormGroup v-slot="{ error }" label="Rest Break" required>
								<USelectMenu size="lg" searchable placeholder="Select hos rule" value-attribute="id" :options="[
									{ label: '30 Minute Rest Break Required', id: 1 },
									{ label: 'No Rest Break Required', id: 2 },
								]" :ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }" />
							</UFormGroup>
							<UCheckbox label="Exempt Driver" :model-value="false" />
							<UCheckbox label="Short-Haul Exception" :model-value="false" />
							<UCheckbox label="Allow Yard Moves" :model-value="false" />
							<UCheckbox label="Allow Personal Use" :model-value="false" />
						</div>
					</div> -->
					<div class="space-y-6 mt-6 mb-4">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="closeAddCarrierModal" class="w-28 justify-center" size="xl" label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }" />
							<UButton :disabled="isDisabledAddCarrier" :loading="loading" type="submit"
								class="w-28 justify-center" size="xl" label="Save" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="container mt-3">
			<div class="card flex items-center justify-between">
				<h1 class="title">Carriers</h1>
				<div class="flex items-center gap-x-3">
					<USelectMenu placeholder="Select Carrier" size="sm" v-model="selectedCarrier" searchable
						searchable-placeholder="Search a company..." :options="[{ id: '', name: 'All' }, ...carriers]"
						value-attribute="id" option-attribute="name"
						:ui="{ base: 'w-48', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }" />
					<USelectMenu placeholder="USDOT" required size="sm" v-model="selectedCurrency" searchable
						searchable-placeholder="Search a dot number..." :options="[{ id: '', name: 'All' }, ...dotList]"
						value-attribute="id" option-attribute="name"
						:ui="{ base: 'w-48', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black ' } } }" />
					<UButton @click="openAddCarrierModal" variant="solid" size="sm" label="Create Carrier" />
				</div>
			</div>
		</section>
		<section class="container mt-3 flex-1">
			<div class="card px-0 h-full flex flex-col justify-between gap-y-5">
				<UTable :columns="columns" :rows="filteredCarrierRowDatas" @select="handleSelectCarrier" :ui="{
					th: { base: '!font-semibold !leading-6'},
					td: { base: '!font-medium' },
				}" />
				<UPagination v-if="carriersTotal > pageSize"
					:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
					:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
					:page-count="pageSize" :total="carriersTotal" v-model="currentPage" show-first show-last :ui="{
						wrapper: 'mx-auto'
					}" />
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import { useCarrier } from "~/composables/pages/carrier";
import { filterIssuerStatesByParent } from "~/helpers/issuerState";

const {
	pageSize,
	currentPage,
	carriersTotal,
	loading, isDisabledAddCarrier,
	columns, createModal, formCreate, selectedCarrier,
	selectedCurrency, validateFormCreate, filteredCarrierRowDatas, carriers, dotList,
	handleSelectCarrier, homeTerminalsCount, timeZones, issuerStateParentId, issuerStates, parentIssuerStates, addCarrier, openAddCarrierModal, closeAddCarrierModal
} = await useCarrier();

definePageMeta({
	layout: 'after-auth'
});

</script>
