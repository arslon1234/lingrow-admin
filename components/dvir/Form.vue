<template>
	<UForm :validate="validateDvir" :state="formDvir" @submit="() => console.log('123')">
		<div class="w-full space-y-6">
			<UFormGroup v-slot="{ error }" label="Driver" name="driver">
				<USelectMenu
					@change="dvirDriverChanged"
					size="lg"
					searchable
					searchable-placeholder="Search a driver..."
					v-model="formDvir.driver"
					placeholder="Select driver"
					value-attribute="id"
					option-attribute="fullname"
					:options="
						drivers?.map((driver) => {
							return { id: driver.id, fullname: `${driver.user.firstName} ${driver.user.lastName}` };
						})
					"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				/>
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Vehicle" name="vehicle">
				<USelectMenu
					size="lg"
					searchable
					searchable-placeholder="Search a vehicle..."
					v-model="formDvir.vehicle"
					placeholder="Select vehicle"
					value-attribute="id"
					option-attribute="unit"
					:options="vehicles"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				/>
			</UFormGroup>
			<UFormGroup v-if="!!formDvir.driver" v-slot="{ error }" label="Signatures" name="signaturePath">
				<USelectMenu
					size="lg"
					searchable
					searchable-placeholder="Search a signature..."
					v-model="formDvir.signaturePath"
					placeholder="Select signature"
					:options="signatureAndLocation.signaturesPath"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				/>
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Location" name="location">
				<FormInput type="text" :error="error" placeholder="Location" v-model="formDvir.location" size="xl" />
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Odometer" name="odometer">
				<FormInput type="text" :error="error" placeholder="Odometer" v-model="formDvir.odometer" size="xl" />
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Remarks" name="remarks">
				<FormInput type="text" :error="error" placeholder="Remarks" v-model="formDvir.remarks" size="xl" />
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Trailer" name="trailer">
				<FormInput type="text" :error="error" placeholder="Trailer" v-model="formDvir.trailer" size="xl" />
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Statuses" name="statuses">
				<USelectMenu
					size="lg"
					v-model="formDvir.status"
					placeholder="Select status"
					value-attribute="id"
					option-attribute="name"
					:options="filteredStatuses"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				/>
			</UFormGroup>
			<UFormGroup v-slot="{ error }" label="Add Vehicle Defects" help="Report any vehicle defects promptly to ensure safety on the road" name="vehicle_defects">
				<USelectMenu
					size="lg"
					multiple
					searchable
					searchable-placeholder="Search a vehicle defect..."
					v-model="formDvir.vehicleDefects"
					placeholder="Select defects"
					value-attribute="id"
					option-attribute="name"
					:options="vehicleDefectsList"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				>
					<template #label>
						<div v-if="formDvir.vehicleDefects?.length > 0" class="flex gap-2 flex-wrap">
							<UBadge variant="outline" size="xs" v-for="defect in formDvir.vehicleDefects" :key="defect" :label="vehicleDefectsList.find(df => df.id === defect)?.name || '&nbsp;'" />
						</div>
						<p v-else>Select trailer defects</p>
					</template>
				</USelectMenu>
			</UFormGroup>
			<UFormGroup :ui="{wrapper: '!my-12'}" v-slot="{ error }" label="Add Trailer Defects" help="Report any trailer defects promptly to ensure safety on the road" name="trailer_defects">
				<USelectMenu
					size="lg"
					multiple
					searchable
					searchable-placeholder="Search a trailer defect..."
					v-model="formDvir.trailerDefects"
					placeholder="Select defects"
					value-attribute="id"
					option-attribute="name"
					:options="trailerDefectsList"
					:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
				>
					<template #label>
						<div v-if="formDvir.trailerDefects?.length > 0" class="flex gap-2 flex-wrap">
							<UBadge variant="outline" size="xs" v-for="defect in formDvir.trailerDefects" :key="defect" :label="trailerDefectsList.find(df => df.id === defect)?.name || '&nbsp;'" />
						</div>
						<p v-else>Select trailer defects</p>
					</template>
				</USelectMenu>
			</UFormGroup>
		</div>
	</UForm>
</template>

<script setup>
// importing icons
import { useDvirForm } from '~/composables/components/dvir/Form';

const isDisabled = defineModel('isDvirDisabled');

// props
const props = defineProps({
	form: Object
});

// emits
const emits = defineEmits(['mergeFormDvir']);

const {
	formDvir,
	validateDvir,
	dvirDriverChanged,
	trailerDefectsList,
	vehicleDefectsList,
	vehicles,
	drivers,
	signatureAndLocation,
	filteredStatuses
} = await useDvirForm(props, isDisabled, emits);
</script>
