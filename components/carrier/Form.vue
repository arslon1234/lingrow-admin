<template>
	<UForm :state="formCreate" :validate="validateFormCreate">
		<div class="grid grid-cols-1 mt-1.5 gap-1.5">
			<div class="gap-y-1.5 flex flex-col">
				<div class="card space-y-4">
					<h3 class="title text-sm">Insert Info</h3>
					<UDivider />
					<div>
						<UFormGroup v-slot="{ error }" label="Carrier name" name="name">
							<FormInput type="text" placeholder="Carrier Name" :error="error" v-model="formCreate.name" size="xl" />
						</UFormGroup>
					</div>
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Dot number" name="usdotNumber">
							<FormInput type="text" placeholder="Dot number" :error="error" v-model="formCreate.usdotNumber" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Carrier Time Zone" name="timeZoneId">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search time zone..."
								placeholder="Select time zone"
								v-model="formCreate.timeZoneId"
								:options="timeZones"
								option-attribute="displayName"
								value-attribute="id"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
					</div>
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Carrier Address" name="street">
							<FormInput type="text" placeholder="Carrier Address" :error="error" v-model="formCreate.street" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="city" class="mt-5">
							<FormInput type="text" placeholder="Carrier Address" :error="error" v-model="formCreate.city" size="xl" />
						</UFormGroup>
					</div>
					<div class="grid grid-cols-3 gap-x-6">
						<UFormGroup v-slot="{ error }" name="state_id">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search state..."
								placeholder="Select parent issuerState"
								v-model="issuerStateParentId"
								:options="parentIssuerStates"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'mt-2 ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="issuerStateId">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search city..."
								placeholder="Select issuerState"
								v-model="formCreate.issuerStateId"
								:options="filterIssuerStatesByParent(issuerStateParentId, issuerStates)"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'mt-2 ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="city_code" class="mt-2">
							<FormInput type="text" placeholder="City Code" :error="error" v-model="formCreate.zipCode" size="xl" />
						</UFormGroup>
					</div>
				</div>

				<!--	TERMINALS		-->
				<div class="card space-y-3 flex-1" v-if="formCreate.carrierTerminals && formCreate.carrierTerminals.length >= 1">
					<h3 class="title text-sm">Terminal 1</h3>
					<UDivider />
					<div class="grid grid-cols-1 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Carrier Time Zone" name="carrier_time_zone">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search time zone..."
								placeholder="Select time zone"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								v-model="formCreate.carrierTerminals[0].timeZoneId"
								:options="timeZones"
								value-attribute="id"
								option-attribute="displayName"
							/>
						</UFormGroup>
					</div>
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Carrier Address" name="period_starting_terminal">
							<FormInput type="text" :error="error" size="xl" placeholder="Enter City Name" v-model="formCreate.carrierTerminals[0].city" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="carrier_address_terminal" class="mt-5">
							<FormInput type="text" :error="error" size="xl" placeholder="Enter Street Name" v-model="formCreate.carrierTerminals[0].street" />
						</UFormGroup>
					</div>
					<div class="grid grid-cols-3 gap-x-6">
						<UFormGroup v-slot="{ error }" name="state_terminal" class="mt-4">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search parent issuerState..."
								placeholder="Select state"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								v-model="terminalsIssuerStateParentIds[0]"
								:options="parentIssuerStates"
								value-attribute="id"
								option-attribute="name"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="city_terminal" class="mt-4">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search issuerState"
								placeholder="Select city"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								v-model="formCreate.carrierTerminals[0].issuerStateId"
								:options="filterIssuerStatesByParent(terminalsIssuerStateParentIds[0], issuerStates)"
								value-attribute="id"
								option-attribute="name"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" name="city_code_terminal" class="mt-4">
							<FormInput type="text" :error="error" placeholder="City Code" size="xl" v-model="formCreate.carrierTerminals[0].zipCode" />
						</UFormGroup>
					</div>
					<div class="flex gap-4">
						<!-- <UButton size="sm" label="Delete Terminal 1" class="bg-red-700 mt-2" /> -->
						<UButton v-if="formCreate.carrierTerminals.length === 1" size="sm" label="+ Add New Terminal" @click="addNewTerminal" class="bg-purple mt-2" />
					</div>
				</div>
				<template v-if="formCreate.carrierTerminals && formCreate.carrierTerminals.length >= 2">
					<div class="card col-span-2" v-for="(terminal, ind) in formCreate.carrierTerminals.slice(1)" :key="terminal.id">
						<div class="space-y-4">
							<h3 class="title text-sm">Terminal {{ ind + 2 }}</h3>
							<UDivider />
							<div class="grid grid-cols-1 gap-x-6">
								<UFormGroup v-slot="{ error }" label="Carrier Time Zone" name="carrier_time_zone_terminal_2">
									<USelectMenu
										size="lg"
										searchable
										searchable-placeholder="Search time zone..."
										placeholder="Time zone"
										:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
										v-model="formCreate.carrierTerminals[ind + 1].timeZoneId"
										:options="timeZones"
										value-attribute="id"
										option-attribute="displayName"
									/>
								</UFormGroup>
							</div>
							<div class="grid grid-cols-2 gap-x-6">
								<UFormGroup v-slot="{ error }" label="Carrier Address" name="period_starting_terminal_2">
									<FormInput placeholder="Enter City Name" type="text" :error="error" size="xl" v-model="formCreate.carrierTerminals[ind + 1].city" />
								</UFormGroup>
								<UFormGroup v-slot="{ error }" name="carrier_address_terminal_2" class="mt-5">
									<FormInput placeholder="Enter Street Name" type="text" :error="error" size="xl" v-model="formCreate.carrierTerminals[ind + 1].street" />
								</UFormGroup>
							</div>
							<div class="grid grid-cols-3 gap-x-6">
								<UFormGroup v-slot="{ error }" name="state_terminal" class="mt-4">
									<USelectMenu
										size="lg"
										searchable
										searchable-placeholder="Search state..."
										placeholder="Select state"
										:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
										v-model="terminalsIssuerStateParentIds[ind + 1]"
										:options="parentIssuerStates"
										option-attribute="name"
										value-attribute="id"
									/>
								</UFormGroup>
								<UFormGroup v-slot="{ error }" name="city_terminal" class="mt-4">
									<USelectMenu
										size="lg"
										searchable
										searchable-placeholder="Search city..."
										placeholder="Select city"
										:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
										v-model="formCreate.carrierTerminals[ind + 1].issuerStateId"
										:options="filterIssuerStatesByParent(issuerStateParentId, issuerStates)"
										option-attribute="name"
										value-attribute="id"
									/>
								</UFormGroup>
								<UFormGroup v-slot="{ error }" name="city_code_terminal" class="mt-4">
									<FormInput type="text" :error="error" placeholder="City Code" size="xl" v-model="formCreate.carrierTerminals[ind + 1].zipCode" />
								</UFormGroup>
							</div>
							<div class="flex gap-4">
								<UButton v-if="ind + 1 === formCreate.carrierTerminals.length - 1" size="sm" label="+ Add New Terminal" class="bg-purple mt-2" @click="addNewTerminal" />
								<UButton
									v-if="ind + 1 === formCreate.carrierTerminals.length - 1"
									size="sm"
									:label="`Delete Terminal ${ind + 2}`"
									class="bg-red-0 hover:bg-red-0/[.8] dark:bg-red-1 dark:hover:bg-red-1/[.8] mt-2"
									@click="deleteTerminal(ind + 1)"
								/>
							</div>
						</div>
					</div>
				</template>

				<!--	SETTINGS	-->
				<div class="card space-y-5 flex-1">
					<h3 class="title text-sm">Carrier Settings</h3>
					<UDivider />
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Exempt" name="exempt_driver">
							<UButton
								variant="outline"
								size="lg"
								label="Exempt Driver"
								:ui="{
									variant: {
										outline:
											' w-full bg-black-0/[.04] text-black-1 ring-purple/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1] hover:bg-purple/[.05]'
									}
								}"
								@click="formCreate.carrierDriverLogSetting.exemptDriver = !formCreate.carrierDriverLogSetting.exemptDriver"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="formCreate.carrierDriverLogSetting.exemptDriver" />
								</template>
							</UButton>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="24H Period Starting Time" name="period_starting">
							<FormInput v-model="formCreate.carrierDriverLogSetting.startingTime24HourPeriod" disabled type="text" :error="error" placeholder="000000" size="xl" />
						</UFormGroup>
<!--						<UFormGroup v-slot="{ error }" label="Vehicle Motion Theshold" name="vehicle_motion_threshold">-->
<!--							<FormInput type="text" :error="error" placeholder="Vehicle Motion Theshold" size="xl" />-->
<!--						</UFormGroup>-->
					</div>
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="HOS Roles" name="hos_roles">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search hos roles..."
								placeholder="HOS Roles"
								v-model="formCreate.carrierDriverLogSetting.hosRuleId"
								:options="hosRoles"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
							<!-- <FormInput type="text" :error="error" placeholder="HOS Roles" size="xl"
								v-model="formCreate.carrierDriverLogSetting.hosRuleId" /> -->
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Cargo Type" name="cargo_type">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search cargo types..."
								placeholder="Cargo Type"
								v-model="formCreate.carrierDriverLogSetting.cargoTypeId"
								:options="cargoTypes"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
							<!-- <FormInput type="text" :error="error" placeholder="Cargo Type" size="xl"
								v-model="formCreate.carrierDriverLogSetting.cargoTypeId" /> -->
						</UFormGroup>
					</div>
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Restart" name="restart">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search restarts..."
								placeholder="Restart"
								v-model="formCreate.carrierDriverLogSetting.restartId"
								:options="restarts"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
							<!-- <FormInput type="text" :error="error" placeholder="Restart" size="xl"
								v-model="formCreate.carrierDriverLogSetting.restartId" /> -->
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Rest Break" name="rest_break">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search rest breaks..."
								placeholder="Rest Break"
								v-model="formCreate.carrierDriverLogSetting.restBreakId"
								:options="restBreaks"
								value-attribute="id"
								option-attribute="name"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
							<!-- <FormInput type="text" :error="error" placeholder="Rest Break" size="xl"
								v-model="formCreate.carrierDriverLogSetting.restBreakId" /> -->
						</UFormGroup>
					</div>
					<div class="grid grid-cols-1 gap-x-6">
						<UFormGroup v-slot="{ error }" name="shor_haul_exception">
							<UButton
								variant="outline"
								size="lg"
								label="Shor-Haul Exception"
								:ui="{
									variant: {
										outline:
											' w-full bg-black-0/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
								@click="formCreate.carrierDriverLogSetting.shortHaulException = !formCreate.carrierDriverLogSetting.shortHaulException"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="formCreate.carrierDriverLogSetting.shortHaulException" />
								</template>
							</UButton>
						</UFormGroup>
					</div>
					<div class="grid grid-cols-1 gap-x-6">
						<UFormGroup v-slot="{ error }" name="allow_yard_moves">
							<UButton
								variant="outline"
								size="lg"
								label="Allow Yard Moves"
								:ui="{
									variant: {
										outline:
											' w-full bg-black/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
								@click="formCreate.carrierDriverLogSetting.allowYardMoves = !formCreate.carrierDriverLogSetting.allowYardMoves"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="formCreate.carrierDriverLogSetting.allowYardMoves" />
								</template>
							</UButton>
						</UFormGroup>
					</div>
					<div class="grid grid-cols-1 gap-x-6">
						<UFormGroup v-slot="{ error }" name="allow_personal_use">
							<UButton
								variant="outline"
								size="lg"
								label="Allow Personal Use"
								:ui="{
									variant: {
										outline:
											' w-full bg-black-0/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
								@click="formCreate.carrierDriverLogSetting.allowPersonalUse = !formCreate.carrierDriverLogSetting.allowPersonalUse"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" v-model="formCreate.carrierDriverLogSetting.allowPersonalUse" />
								</template>
							</UButton>
						</UFormGroup>
					</div>
				</div>
			</div>
			<div class="gap-y-1.5 flex flex-col">
				<div v-if="false" class="card space-y-4">
					<h3 class="title">Integrations</h3>
					<UDivider />
					<div class="grid grid-cols-2 gap-x-6">
						<UFormGroup
							v-slot="{ error }"
							name="project_44"
							help="Powered by HOSConnect AP| - HOSConnect must be selected from the list of providers on Proiect44's endi"
							:ui="{ help: 'relative' }"
						>
							<UButton
								variant="outline"
								size="lg"
								label="Project 44"
								:ui="{
									variant: {
										outline:
											' w-full bg-black-0/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
								@click="formCreate.carrierDriverLogSetting.exemptDriver = !formCreate.carrierDriverLogSetting.exemptDriver"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							name="macropoint"
							help="Powered by HOSConnect API - HOSConnect must be selected from the list of providers on Macropoint's end."
							:ui="{ help: 'relative' }"
						>
							<UButton
								variant="outline"
								size="lg"
								label="MacroPoint"
								:ui="{
									variant: {
										outline:
											' w-full bg-black-0/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
							>
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup>
					</div>
				</div>
				<div v-if="false" class="card space-y-3">
					<h3 class="title">Compliance Settings</h3>
					<UDivider />
					<div class="grid grid-cols-1 gap-x-6">
						<UFormGroup v-slot="{ error }" label="Compliance Mode" name="compliance_mode">
							<FormInput type="text" :error="error" placeholder="Compliance Mode" size="xl" />
						</UFormGroup>
					</div>
				</div>
				<div class="card space-y-3">
					<h3 class="title text-sm">Plan Features</h3>
					<UDivider />
					<div class="grid grid-cols-3 gap-x-6">
						<UFormGroup v-slot="{ error }" name="allow_tracking">
							<UButton
								@click="formCreate.carrierDriverLogSetting.allowTracking = !formCreate.carrierDriverLogSetting.allowTracking"
								variant="outline"
								size="lg"
								label="Allow Tracking"
								:ui="{
									variant: {
										outline:
											'w-full bg-black/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
							>
								<template #leading>
									<UCheckbox v-model="formCreate.carrierDriverLogSetting.allowTracking" :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup>
						<!-- <UFormGroup v-slot="{ error }" name="allow_gps_tracking">
							<UButton variant="outline" size="sm" label="Allow GPS Tracking"
								:ui="{ variant: { outline: ' w-full bg-black/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05]' } }">
								<template #leading>
									<UCheckbox :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup> -->
						<UFormGroup v-slot="{ error }" name="allow_ifta">
							<UButton
								variant="outline"
								size="lg"
								label="Allow IFTA"
								@click="formCreate.carrierDriverLogSetting.allowIFTA = !formCreate.carrierDriverLogSetting.allowIFTA"
								:ui="{
									variant: {
										outline:
											'w-full bg-black/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.1]'
									}
								}"
							>
								<template #leading>
									<UCheckbox v-model="formCreate.carrierDriverLogSetting.allowIFTA" :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup>
					</div>
				</div>
			</div>
		</div>
	</UForm>
</template>
<script setup>
import { useCarrierEdit } from '~/composables/pages/carrier/edit';
import { filterIssuerStatesByParent } from '~/helpers/issuerState';

const {
	createModal,
	formCreate,
	selectedCarrier,
	selectedCurrency,
	validateFormCreate,
	filteredCarrierRowDatas,
	carrier,
	dotList,
	handleSelectCarrier,
	issuerStateParentId,
	timeZones,
	issuerStates,
	parentIssuerStates,
	terminalsIssuerStateParentIds,
	addNewTerminal,
	deleteTerminal,
	hosRoles,
	cargoTypes,
	restBreaks,
	restarts
} = await useCarrierEdit();
</script>
