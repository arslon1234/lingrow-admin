<template>
	<UForm :state="auditForm" :validate="validateAudit">
		<div class="grid grid-cols-2 gap-3">
			<div class="card col-span-2 space-y-4">
				<div class="grid grid-cols-4 gap-x-6">
					<UFormGroup v-slot="{ error }" label="Carrier" name="carrier">
						<USelectMenu
							size="lg"
							searchable
							searchable-placeholder="Search a carrier..."
							v-model="auditForm.carrier"
							placeholder="Select carrier"
							value-attribute="id"
							option-attribute="name"
							:options="carriers"
							:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
						/>
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Driver" name="driver">
						<USelectMenu
							size="lg"
							searchable
							searchable-placeholder="Search a driver..."
							v-model="auditForm.driver"
							placeholder="Select driver"
							value-attribute="id"
							option-attribute="fullname"
							:options="drivers?.map((driver) => ({ fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id }))"
							:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
						/>
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Bol" name="bol">
						<FormInput type="text" :error="error" placeholder="Bol number" v-model="auditForm.bol" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Trailer" name="trailer">
						<FormInput type="text" :error="error" placeholder="Trailer number" v-model="auditForm.trailer" size="xl" />
					</UFormGroup>
				</div>
			</div>
			<div v-if="order === 1" class="card space-y-4">
				<h3 class="title text-sm">Insert Info</h3>
				<UDivider />
				<div class="grid grid-cols-3 gap-x-6">
					<UFormGroup v-slot="{ error }" label="Odometer" name="odometer">
						<FormInput type="number" :error="error" placeholder="Odometer number" v-model="auditForm.insert_info.odometer" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Eng hours" name="eng_hours">
						<FormInput type="number" :error="error" placeholder="Eng hours" v-model="auditForm.insert_info.eng_hours" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Daily distance" name="daily_distance">
						<FormInput type="number" :error="error" placeholder="Daily distance" v-model="auditForm.insert_info.daily_distance" size="xl" />
					</UFormGroup>
				</div>
			</div>
			<div v-if="order === 1" class="card space-y-4">
				<h3 class="title text-sm">Start Date and Time</h3>
				<UDivider />
				<div class="grid grid-cols-2 gap-x-6">
					<UFormGroup v-slot="{ error }" label="Time" name="time">
						<TheTimePicker v-model="auditForm.start_date_and_time.time" :showSeconds="true" :limitless="false">
							<UButton
								variant="outline"
								block
								class="justify-between"
								size="lg"
								:label="`${auditForm.start_date_and_time.time.hours.toString().padStart(2, '0')}:${auditForm.start_date_and_time.time.minutes.toString().padStart(2, '0')}:${auditForm.start_date_and_time.time.seconds.toString().padStart(2, '0')}`"
								:ui="{
									variant: {
										outline: 'ring-grey-border bg-black-0/[.04] text-black dark:bg-white/[.05] dark:ring-white/[.2] dark:text-grey-1/[.8] dark:hover:bg-white/[0.1] tracking-wide'
									},
									icon: { base: 'bg-grey-2' }
								}"
							/>
						</TheTimePicker>
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Date" name="date">
						<TheDatePicker v-model="auditForm.start_date_and_time.date">
							<UButton
								variant="outline"
								block
								class="justify-between"
								size="lg"
								:ui="{
									variant: {
										outline: 'ring-grey-border bg-black-0/[.04] text-black dark:bg-white/[.05] dark:ring-white/[.2] dark:text-grey-1/[.8] dark:hover:bg-white/[0.1] tracking-wide'
									},
									icon: { base: 'bg-grey-2' }
								}"
							>
								{{ formatTime(auditForm.start_date_and_time.date, 'DD/MM/YYYY') }}
							</UButton>
						</TheDatePicker>
					</UFormGroup>
				</div>
			</div>
			<div class="card space-y-4">
				<div class="flex justify-between items-center">
					<h3 class="title text-sm">Load Location</h3>
					<p class="uppercase text-purple text-sm"><strong>from</strong></p>
				</div>
				<UDivider />
				<div class="grid grid-cols-2 gap-4">
					<UFormGroup class="col-span-2" v-slot="{ error }" label="Location" name="from_location">
						<FormInput type="text" :error="error" placeholder="Location" v-model="auditForm.from.location" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Latitude" name="from_latitude">
						<FormInput type="text" pattern="[0-9]*\.?[0-9]*" @input="restrictToNumeric($event, 'from.latitude')" :error="error" placeholder="20.4131312312" v-model="auditForm.from.latitude" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Longitude" name="from_longitude">
						<FormInput type="text" pattern="[0-9]*\.?[0-9]*" @input="restrictToNumeric($event, 'from.longitude')" :error="error" placeholder="-20.4131312312" v-model="auditForm.from.longitude" size="xl" />
					</UFormGroup>
				</div>
			</div>
			<div class="card space-y-4">
				<div class="flex justify-between items-center">
					<h3 class="title text-sm">Load Location</h3>
					<p class="uppercase text-purple text-sm"><strong>to</strong></p>
				</div>
				<UDivider />
				<div class="grid grid-cols-2 gap-4">
					<UFormGroup class="col-span-2" v-slot="{ error }" label="Location" name="to_location">
						<FormInput type="text" :error="error" placeholder="Location" v-model="auditForm.to.location" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Latitude" name="to_latitude">
						<FormInput type="text" @input="restrictToNumeric($event, 'to.latitude')" :error="error" placeholder="20.4131312312" v-model="auditForm.to.latitude" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Longitude" name="to_longitude">
						<FormInput type="text" @input="restrictToNumeric($event, 'to.longitude')" :error="error" placeholder="-20.4131312312" v-model="auditForm.to.longitude" size="xl" />
					</UFormGroup>
				</div>
			</div>
			<div class="card col-span-2 space-y-4">
				<div class="flex justify-between items-center">
					<h3 class="title text-sm">fuel Location</h3>
					<UButton @click="addFuelLocation" size="sm" label="Add location" />
				</div>
				<UDivider />
				<div class="grid grid-cols-4 gap-4">
					<UFormGroup class="col-span-2" v-slot="{ error }" label="Location" name="fuel_location">
						<FormInput type="text" :error="error" placeholder="Location" v-model="auditForm.fuel.location" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Latitude" name="fuel_latitude">
						<FormInput type="text" @input="restrictToNumeric($event, 'fuel.latitude')" :error="error" placeholder="20.4131312312" v-model="auditForm.fuel.latitude" size="xl" />
					</UFormGroup>
					<UFormGroup v-slot="{ error }" label="Longitude" name="fuel_longitude">
						<FormInput type="text" @input="restrictToNumeric($event, 'fuel.longitude')" :error="error" placeholder="-20.4131312312" v-model="auditForm.fuel.longitude" size="xl" />
					</UFormGroup>
				</div>
				<UDivider v-if="auditForm.fuelLocations.length > 0" />
				<transition-group tag="ul" name="list" class="flex gap-3 flex-wrap">
					<li v-for="(fuel, ind) in auditForm.fuelLocations" :key="fuel?.id" class="flex border border-purple/[.5] rounded-lg bg-purple/[.1] items-center">
						<div class="w-9 h-9 rounded-md bg-purple text-white flex items-center justify-center">
							<p>{{ ind + 1 }}</p>
						</div>
						<div class="p-2">
							<p class="text-sm font-medium">{{ fuel?.location }}</p>
						</div>
						<UButton @click="removeFuel(fuel?.id)" size="sm" class="dark:hover:bg-white/[.05]" variant="ghost">
							<template #leading>
								<XIcon class="text-black dark:text-white/[.6] w-6" />
							</template>
						</UButton>
					</li>
				</transition-group>
			</div>
		</div>
	</UForm>
</template>
<script setup>
// importing stores
import { useCarrierStore } from '~/store/carrier.ts';
import { useDriversStore } from '~/store/drivers.ts';
import { useGeoLocations } from '~/store/geoLocations.ts';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone.ts';

// importing icons
import XIcon from '~/assets/icons/x.svg';

// declaring stores
const carriersStore = useCarrierStore();
const driversStore = useDriversStore();
const geoLocationsStore = useGeoLocations();

// destructuring helpers
const { convertToTimeZone } = useTimeZoneHelper();

// destructuring stores
const { carriers } = storeToRefs(carriersStore);
const { drivers } = storeToRefs(driversStore);

// declaring emit
const emit = defineEmits(['trip:update', 'constantas:update']);

// declaring props
const props = defineProps({
	constantas: {
		type: Object,
		required: true
	},
	order: {
		type: Number,
		required: true
	}
});

// form data
const auditForm = reactive({
	carrier: props.constantas.carrierId || '',
	driver: props.constantas.driverId || '',
	bol: '',
	trailer: '',
	start_date_and_time: {
		time: {
			hours: props.constantas.time.hours || convertToTimeZone().hour(),
			minutes: props.constantas.time.minutes || convertToTimeZone().minute(),
			seconds: props.constantas.time.seconds || convertToTimeZone().second()
		},
		date: props.constantas.date || convertToTimeZone()
	},
	insert_info: {
		odometer: props.order !== 1 ? props.constantas.odometer : 0,
		eng_hours: props.order !== 1 ? props.constantas.engineHours : 0,
		daily_distance: props.order !== 1 ? props.constantas.distance : 0
	},
	from: {
		location: '',
		latitude: '',
		longitude: ''
	},
	to: {
		location: '',
		latitude: '',
		longitude: ''
	},
	fuel: {
		location: '',
		latitude: '',
		longitude: ''
	},
	fuelLocations: []
});

const restrictToNumeric = (event, fieldPath) => {
  const input = event.target;
  const value = input.value;
  const regex = /^-?\d*\.?\d*$/; // Allow digits, optional decimal, optional negative sign

  // Split fieldPath (e.g., "from.latitude") to access nested properties
  const pathParts = fieldPath.split('.');
  let target = auditForm;
  for (let i = 0; i < pathParts.length - 1; i++) {
    target = target[pathParts[i]];
  }
  const finalKey = pathParts[pathParts.length - 1];

  if (!regex.test(value)) {
    // Revert to last valid value if input is invalid
    input.value = target[finalKey] || '';
  } else {
    // Update reactive object with valid input
    target[finalKey] = value;
  }
};

watch(
	() => props.constantas,
	(newValue) => {
		auditForm.carrier = newValue.carrierId;
		auditForm.driver = newValue.driverId;
		auditForm.start_date_and_time.date = newValue.date;
		auditForm.start_date_and_time.time = newValue.time;
		auditForm.insert_info.odometer = newValue.odometer;
		auditForm.insert_info.eng_hours = newValue.engineHours;
		auditForm.insert_info.daily_distance = newValue.distance;
	},
	{ deep: true }
);

watch(
	[
		() => auditForm.carrier,
		() => auditForm.driver,
		() => auditForm.start_date_and_time.date,
		() => auditForm.start_date_and_time.time,
		() => auditForm.insert_info.odometer,
		() => auditForm.insert_info.eng_hours,
		() => auditForm.insert_info.daily_distance
	],
	([newCarrierId, newDriverId, newDate, newTime, newOdometer, newEngHours, newDistance]) => {
		emit('constantas:update', {
			carrierId: newCarrierId,
			driverId: newDriverId,
			date: newDate,
			time: newTime,
			odometer: newOdometer,
			engineHours: newEngHours,
			distance: newDistance
		});
	},
	{ deep: true }
);

watch(
	() => auditForm.carrier,
	(newValue) => {
		if (newValue) {
			driversStore.getDriversFilter(false, newValue);
		}
	}
);

watch([() => auditForm.from.latitude, () => auditForm.from.longitude], async ([newLat, newLon]) => {
	if (newLat && newLon && newLat >= -90 && newLat <= 90 && newLon >= -180 && newLon <= 180) {
		auditForm.from.location = await geoLocationsStore.getCalculatedAddress({ latitude: newLat, longitude: newLon });
	}
});

watch([() => auditForm.to.latitude, () => auditForm.to.longitude], async ([newLat, newLon]) => {
	if (newLat && newLon && newLat >= -90 && newLat <= 90 && newLon >= -180 && newLon <= 180) {
		auditForm.to.location = await geoLocationsStore.getCalculatedAddress({ latitude: newLat, longitude: newLon });
	}
});

watch([() => auditForm.fuel.latitude, () => auditForm.fuel.longitude], async ([newLat, newLon]) => {
	if (newLat && newLon && newLat >= -90 && newLat <= 90 && newLon >= -180 && newLon <= 180) {
		auditForm.fuel.location = await geoLocationsStore.getCalculatedAddress({
			latitude: newLat,
			longitude: newLon
		});
	}
});

const validateAudit = () => {
	const errors = [];
	if (!auditForm.carrier) errors.push({ path: 'carrier', message: errorMessages.blank });
	if (!auditForm.driver) errors.push({ path: 'driver', message: errorMessages.blank });
	if (!auditForm.start_date_and_time.time) errors.push({ path: 'time', message: errorMessages.blank });
	if (!auditForm.start_date_and_time.date) errors.push({ path: 'date', message: errorMessages.blank });
	if (typeof auditForm.insert_info.odometer !== 'number') errors.push({ path: 'odometer', message: errorMessages.blank });
	if (typeof auditForm.insert_info.eng_hours !== 'number') errors.push({ path: 'eng_hours', message: errorMessages.blank });
	if (!auditForm.insert_info.daily_distance) errors.push({ path: 'daily_distance', message: errorMessages.blank });
	if (!auditForm.from.latitude) errors.push({ path: 'from_latitude', message: errorMessages.blank });
	if (!auditForm.from.longitude) errors.push({ path: 'from_longitude', message: errorMessages.blank });
	if (!auditForm.to.latitude) errors.push({ path: 'to_latitude', message: errorMessages.blank });
	if (!auditForm.to.longitude) errors.push({ path: 'to_longitude', message: errorMessages.blank });
	if (auditForm.fuelLocations.length === 0 && !auditForm.fuel.latitude) errors.push({ path: 'fuel_latitude', message: errorMessages.blank });
	if (auditForm.fuelLocations.length === 0 && !auditForm.fuel.longitude) errors.push({ path: 'fuel_longitude', message: errorMessages.blank });
	return errors;
};

watch(
	() => validateAudit(),
	(newValue) => {
		if (newValue.length === 0) {
			const trip = {
				bolNumber: auditForm.bol,
				trailerNumber: auditForm.trailer,
				odometer: auditForm.insert_info.odometer,
				engineHours: auditForm.insert_info.eng_hours,
				dailyDistanceInMile: auditForm.insert_info.daily_distance,
				from: {
					latitude: auditForm.from.latitude,
					longitude: auditForm.from.longitude,
					address: auditForm.from.location,
					locationType: 2
				},
				to: {
					latitude: auditForm.to.latitude,
					longitude: auditForm.to.longitude,
					address: auditForm.to.location,
					locationType: 2
				},
				fuelLocations: auditForm.fuelLocations.map((fuel) => ({ latitude: fuel.latitude, longitude: fuel.longitude, address: fuel.location, locationType: 3 }))
			};
			emit('trip:update', trip);
		}
	}
);

// add fuel location
const addFuelLocation = () => {
	if (
		auditForm.fuel.latitude &&
		auditForm.fuel.longitude &&
		auditForm.fuel.latitude >= -90 &&
		auditForm.fuel.latitude <= 90 &&
		auditForm.fuel.longitude >= -180 &&
		auditForm.fuel.longitude <= 180
	) {
		auditForm.fuelLocations.push({
			id: Date.now(),
			latitude: parseInt(auditForm.fuel.latitude),
			longitude: parseInt(auditForm.fuel.longitude),
			location: auditForm.fuel.location
		});
		clearObject(auditForm.fuel);
	}
};

// remove fuel location
const removeFuel = (id) => {
	auditForm.fuelLocations = auditForm.fuelLocations.filter((fuel) => fuel.id !== id);
};

onMounted(async () => {
	await Promise.all([carriersStore.getCarriesFilter()]);
});
</script>
