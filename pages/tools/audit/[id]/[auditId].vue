<template>
	<main>
		<UModal v-model="editProfileModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit Profile Form</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
						icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="editProfileModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateEditDriverDailyForm" :state="editDriverDailyForm"
					@submit="submitDriverDailyForm">
					<div class="w-full space-y-6">
						<!-- <UFormGroup v-slot="{ error }" label="Vehicles" name="vehicles">
							<FormInput type="text" :error="error" placeholder="Select Vehicles" v-model="editDriverDailyForm.vehicles" size="xl" />
						</UFormGroup> -->
						<UFormGroup v-slot="{ error }" label="Co-Drivers" name="co-drivers">
							<USelectMenu size="lg" searchable searchable-placeholder="Search Co-Driver..."
								v-model="editDriverDailyForm.coDrivers" placeholder="Select Co-Drivers"
								value-attribute="id" option-attribute="fullname"
								:options="drivers?.map((driver) => ({ id: driver?.id, fullname: driver?.user.firstName + ' ' + driver?.user.lastName })) || []"
								:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Shipping Docs" name="shipping-docs">
							<FormInput type="text" :error="error" placeholder="Edit Shipping Docs"
								v-model="editDriverDailyForm.shippingDocs" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Trailers" name="trailers">
							<FormInput type="text" :error="error" placeholder="Edit Trailers"
								v-model="editDriverDailyForm.trailers" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Signature path" name="signature">
							<FormInput type="text" :error="error" placeholder="Edit Signature Path"
								v-model="editDriverDailyForm.signaturePath" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="editProfileModal = false" class="w-28 justify-center" size="xl"
								label="Cancel" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }" />
							<UButton :disabled="disableEditDailyForm" :loading="loading" type="submit"
								class="w-28 justify-center" size="xl" label="Send" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg font-bold uppercase tracking-wide ml-3 before:-left-3">Audit</h1>
			<div class="flex items-center gap-x-2">
				<transition-group name="fade">
					<template v-if="tracking">
						<UButton class="h-8 w-8 justify-center items-center" v-for="n in tripNumbers" :key="n"
							active-class="!bg-purple text-white" :label="`${n}`" variant="solid"
							:ui="{ variant: { solid: 'bg-purple/[.4] hover:bg-purple/[.5] text-purple text-sm' } }" />
					</template>
				</transition-group>

				<UButton class="w-20 justify-center" @click="tracking = !tracking"
					:label="tracking ? `Process` : `Tracking`" variant="solid" size="sm" />
			</div>
		</section>
		<transition name="fade" mode="out-in">
			<div v-if="!tracking">
				<section class="card mt-3 space-y-4">
					<div class="flex items-start justify-between gap-x-12">
						<div class="flex gap-2 flex-wrap">
							<TheDatePicker class="!w-fit" v-model="headerDate">
								<UButton variant="outline" :ui="{
									rounded: 'rounded-lg',
									variant: { outline: 'ring-grey-border text-purple dark:text-dark-icon-0 dark:hover:bg-white/[.05] dark:ring-white/[0.1] px-3 py-2.5' }
								}">
									<CalendarIcon class="w-5" />
								</UButton>
							</TheDatePicker>
							<UButton v-for="(violation, ind) in auditWeeklyViolations" :key="ind"
								:label="formatTime(violation.dateOfViolations, 'MMM D')"
								@click="headerDate = acceptAsTimeZone(violation.dateOfViolations)" :variant="violation.violations?.length > 0 && !compareDates(violation.dateOfViolations, headerDate)
									? 'soft'
									: compareDates(violation.dateOfViolations, headerDate)
										? 'solid'
										: 'outline'
									" :ui="{
										rounded: 'rounded-lg',
										variant: {
											solid:
												violation.violations?.length > 0 && compareDates(violation.dateOfViolations, headerDate)
													? 'text-xs px-4 py-3 bg-red-0 hover:bg-red-0/[.8] hover:ring-red-0/[.8] dark:bg-red-1 dark:hover:bg-red-1/[.8] dark:hover:ring-red-1/[.8] dark:ring-red-1 ring-1 ring-red-0 text-white'
													: 'text-xs px-4 py-3 ring-1 ring-purple hover:ring-purple/[.8] hover:bg-purple/[.8] dark:ring-dark-purple-0 dark:bg-dark-purple-0 dark:hover:bg-dark-purple-0/[.8]',
											outline: 'text-xs px-4 py-3 ring-grey-border text-black dark:ring-white/[0.1] dark:text-white/[0.7] dark:hover:bg-white/[.05]',
											soft: 'text-xs px-4 py-3 ring-1 ring-red-0 bg-red-0/[.2] hover:bg-red-0/[0.1] text-red-0 dark:ring-red-1 dark:text-red-1 dark:bg-red-1/[0.1] dark:hover:bg-red-1/[0.2]'
										}
									}" />
						</div>
						<div class="flex items-center gap-x-3 shrink-0">
							<UButton @click="headerDate = subtract(headerDate, 1, 'day')" variant="solid" size="md"
								icon="i-heroicons-chevron-double-left"
								:ui="{ variant: { solid: 'disabled:bg-purple/[.4]' }, icon: { size: { md: 'h-[18px] w-[18px]' } } }" />
							<UButton :disabled="compareDates(headerDate, convertToTimeZone())"
								@click="headerDate = add(headerDate, 1, 'day')" variant="solid" size="md"
								icon="i-heroicons-chevron-double-right"
								:ui="{ variant: { solid: 'disabled:bg-purple/[.4]' }, icon: { size: { md: 'h-[18px] w-[18px]' } } }" />
						</div>
					</div>
					<UDivider />
					<ChartMain @container:update="getChartWidth" :chart-data="auditChartData"
						:daily-summary="auditDailySummary" :violations="dailyPixelViolations" />
				</section>
				<section class="card mt-3">
					<h2 class="title text-sm">Events</h2>
					<div
						class="bg-white overflow-hidden border border-grey-border rounded-lg mt-4 dark:bg-dark-0 dark:border-white/[0.1]">
						<UTable v-model="selectedRow" :columns="columns" :rows="detailList"
							:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
							:progress="{ color: 'primary', animation: 'carousel' }" :ui="{
								th: { base: 'border-r !font-semibold last:border-r-0 dark:border-white/[.1]' },
								td: { font: 'font-normal', base: 'border border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[.1]' }
							}">
							<template #event-data="{ row }">
								<TheEvent :eventType="row.eventType" :eventCode="row.eventCode" />
							</template>
							<template #recordOrigin-data="{ row }">
								{{ EventRecordOrigins[row.recordOrigin ?? 1] }}
							</template>
							<template #recordStatus-data="{ row }">
								{{ EventRecordStatuses[row.recordStatus ?? 1] }}
							</template>
						</UTable>
					</div>
				</section>
				<section class="grid grid-cols-12 mt-3 gap-x-3">
					<div class="col-span-3 card flex flex-col">
						<h2 class="title text-sm">Signature</h2>
						<div class="flex-1 mt-3 flex items-center justify-center">
							<img v-if="driverDailyForm?.signaturePath"
								:style="{ filter: useColorMode().value === 'dark' ? 'invert(0.8358)' : '' }"
								class="object-contain h-full w-full rounded-lg duration-200 select-none pointer-events-none"
								:src="useNuxtApp().$config.public.BASE_URL + '/' + driverDailyForm?.signaturePath"
								alt="signature path" />
							<h2 v-else class="font-semibold tracking-wide">NO SIGNATURE PATH</h2>
						</div>
					</div>
					<div class="col-span-9 card">
						<div class="flex justify-between items-start">
							<h2 class="title text-sm">Profile Form</h2>
							<UButton @click="editDriverDailyFormModal" label="Edit" variant="solid" size="xs"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'text-white tracking-wide' } }">
								<EditIcon class="w-3" /> Edit
							</UButton>
						</div>
						<div class="mt-4 grid grid-cols-2 border border-grey-border rounded-lg dark:border-white/[0.1]">
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Driver</p>
								<p class="text-sm uppercase font-semibold tracking-wide">
									{{ driverDailyForm?.driver?.user?.firstName ?? 'N/A&nbsp;' }} {{
										driverDailyForm?.driver?.user?.lastName ?? 'N/A&nbsp;' }}
								</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Vehicles</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.assignedVehicles.map((vehicle) => vehicle.unit).join(', ') ??
									'N/A&nbsp;'
								}}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">CARRIER</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.carrier?.name ??
									'N/A&nbsp;' }}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Co-Drivers</p>
								<p class="text-sm uppercase font-semibold tracking-wide">
									{{ driverDailyForm?.coDriver?.user?.firstName ?? 'N/A&nbsp;' }} {{
										driverDailyForm?.coDriver?.user?.lastName ?? 'N/A&nbsp;' }}
								</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">DOT number</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.carrier?.usdotNumber ?? 'N/A&nbsp;' }}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Trailers</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.trailers.join(', ')
									?? 'N/A&nbsp;' }}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Home Terminal</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.driver?.homeTerminal?.street ?? 'N/A&nbsp;' }}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Shipping Docs</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{
									driverDailyForm?.shippingDocuments.join(', ') ?? 'N/A&nbsp;' }}</p>
							</div>
							<div
								class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
								<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Distance</p>
								<p class="text-sm uppercase font-semibold tracking-wide">{{ 'N/A&nbsp;' }}</p>
							</div>
						</div>
					</div>
				</section>
			</div>
			<section v-else class="card h-[calc(100vh-95px)] mt-3">
				<div class="rounded-lg h-full overflow-hidden">
					<GoogleMap :map-id="config.public.GOOGLE_MAPS_MAP_ID" :api-key="config.public.GOOGLE_MAPS_API_KEY"
						style="width: 100%; height: 100%" :center="{
							lat:
								(auditTrackings?.reduce((a, b) => a + b?.latitude, 0) / auditTrackings?.length) || 0,
							lng:
								(auditTrackings?.reduce((a, b) => a + b?.longitude, 0) / auditTrackings?.length) || 0
						}" :zoom="8">
						<Polyline v-if="trackingPath.length > 1" :options="polylineOptions" />
						<CustomMarker class="cursor-pointer" v-for="(station, ind) in auditWeightStations" :key="ind"
							:options="{ position: { lat: station.latitude, lng: station.longitude }, anchorPoint: 'CENTER' }">
							<UPopover :popper="{ placement: 'top', arrow: true }" :ui="{ rounded: 'rounded-lg' }">
								<div class="bg-red-2 px-2 py-1 rounded-xl border-2 border-white relative text-white">
									<p class="text-xs text-center">weight <br> station</p>
									<div
										class="before:absolute before:bg-white before:h-3 before:w-3 before:rotate-45 before:left-1/2 before:bottom-0 before:-translate-x-1/2 before:translate-y-1/2 before:z-[-1]">
									</div>
								</div>
								<template #panel>
									<div class="px-2 py-1.5 min-w-36 max-w-44">
										<div class="flex justify-between gap-x-4 text-xs">
											<p class="truncate font-medium flex gap-x-1">
												<MarkerIcon class="w-4 shrink-0" />{{ station.location || 'N/A' }}
											</p>
											<ULink target="_blank" class="shrink-0"
												:to="`https://maps.google.com/maps?q=${station.latitude},${station.longitude}`">
												<ArrowUpIcon class="w-4 text-purple dark:text-dark-icon-0" />
											</ULink>
										</div>
										<div class="mt-3 flex justify-center">
											<p class="text-xs text-grey-0 dark:text-white/[.8] flex gap-x-1">
												<FileCheckIcon class="w-4" />{{ station.name }}
											</p>
										</div>
									</div>
								</template>
							</UPopover>
						</CustomMarker>
						<CustomMarker v-for="(tracking, ind) in auditTrackings" :key="ind"
							:options="{ position: { lat: tracking?.latitude, lng: tracking?.longitude }, anchorPoint: 'CENTER' }">
							<CursorIcon v-if="
								auditTrackings?.at(-1)?.eventCode === 3 && auditTrackings?.at(-1)?.eventType === 1
							" class="w-8" :style="{
								transform: `rotate(${calculateBearing(auditTrackings[ind - 1]?.latitude, auditTrackings[ind - 1]?.longitude, tracking?.latitude, tracking?.longitude) + 45}deg bg-[green])`
							}" />
							<!-- <DownIcon
								v-else
								class="text-white w-3"
								:style="{
									transform: `rotate(${calculateBearing(tracking?.latitude, tracking?.longitude, everyTrackings[ind + 1]?.latitude, everyTrackings[ind + 1]?.longitude) - 180}deg)`
								}"
							/> -->
						</CustomMarker>
						<CustomMarker class="cursor-pointer" v-for="(tracking, ind) in auditTrackings" :key="ind"
							:options="{ position: { lat: tracking.latitude, lng: tracking.longitude }, anchorPoint: 'CENTER' }">
							<UPopover :open="trackingTooltip[tracking.eventId]" :popper="{
								placement: 'top',
								arrow: true,
								strategy: 'fixed'
							}" :ui="{ rounded: 'rounded-lg' }">
								<CircleIcon ref="markerRefs"
									class="w-6 cursor-pointer hover:scale-110 transition-transform"
									@click="(event) => toggleTooltip(tracking.eventId, event)" />

								<template #panel>
									<Teleport to="body">
										<div v-if="trackingTooltip[tracking.eventId]"
											class="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 min-w-36 max-w-44 z-[999999]"
											:style="getTooltipPosition(tracking.eventId)" @click.stop>
											<div class="flex justify-between align-center gap-x-4 text-xs">
												<p
													class="truncate font-medium flex gap-x-1 text-gray-900 dark:text-white">
													<MarkerIcon class="w-4 shrink-0" />
													{{ tracking.calculatedLocation || tracking.manualLocation || 'N/A'
													}}
												</p>
												<button
													@click.stop="openGoogleMaps(tracking.latitude, tracking.longitude)"
													class="shrink-0 text-blue-600">
													<ArrowUpIcon class="w-4 h-4" />
												</button>
											</div>

											<div class="mt-2 flex justify-center">
												<p class="text-xs text-gray-600 dark:text-gray-400 flex gap-x-1">
													<FileCheckIcon class="w-4" />
													{{ tracking.annotation }}
												</p>
											</div>

											<button @click.stop="closeTooltip(tracking.eventId)"
												class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
												×
											</button>
										</div>
									</Teleport>
								</template>
							</UPopover>
						</CustomMarker>
					</GoogleMap>
				</div>
			</section>
		</transition>
	</main>
</template>

<script setup>
// importing google map components
import { CustomMarker, GoogleMap, Polyline } from 'vue3-google-map';

// importing icons
import EditIcon from 'assets/icons/edit-01.svg';
import ArrowUpIcon from '~/assets/icons/arrow-circle-broken-up-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import CircleIcon from '~/assets/icons/circle.svg';
import CursorIcon from '~/assets/icons/cursor-02.svg';
import FileCheckIcon from '~/assets/icons/file-check-03.svg';
import MarkerIcon from '~/assets/icons/marker-pin-01.svg';

// importing config
const config = useRuntimeConfig();
const tripNumbers = ref(JSON.parse(localStorage.getItem('tripNumbers') || '[]'));
const activeTooltips = ref({});
const tooltipPositions = ref({});

const toggleTooltip = (eventId, event) => {
	// Get click position
	const rect = event.target.getBoundingClientRect();

	// Calculate tooltip position
	tooltipPositions.value[eventId] = {
		top: `${rect.top - 75}px`, // 80px yuqorida
		left: `${rect.left - 75}px`, // 80px chapda (markazlash uchun)
		transform: 'translateX(-50%)', // Markazga keltirish
	};

	// Close all other tooltips
	//   const newTooltips = {};
	//   if (!activeTooltips.value[eventId]) {
	//     newTooltips[eventId] = true;
	//   }
	//   activeTooltips.value = newTooltips;
	activeTooltips.value = {
		[eventId]: true  // Faqat shu tooltip ochiq bo'ladi
	};
};

const closeTooltip = (eventId) => {
	const newTooltips = { ...activeTooltips.value };
	delete newTooltips[eventId];
	activeTooltips.value = newTooltips;

	// Clear position
	delete tooltipPositions.value[eventId];
};

const getTooltipPosition = (eventId) => {
	return tooltipPositions.value[eventId] || {
		top: '50px',
		left: '50px'
	};
};

const trackingTooltip = computed(() => activeTooltips.value);

const openGoogleMaps = (lat, lng) => {
	window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
};

// Close tooltips when clicking outside
onMounted(() => {
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.fixed') && !e.target.closest('svg')) {
			activeTooltips.value = {};
			tooltipPositions.value = {};
		}
	});
});
// importing composables
import { useToolsAuditId } from '~/composables/pages/tools/audit/id';
const {
	// loading
	loading,

	// drivers by carrierId
	drivers,

	// trackings
	auditTrackings,
	// weight stations,
	auditWeightStations,

	// violations
	auditWeeklyViolations,
	dailyPixelViolations,

	// daily summary
	auditDailySummary,

	// driver daily form
	driverDailyForm,

	// graph
	auditChartData,
	getChartWidth,

	// daily driver form
	editProfileModal,
	editDriverDailyForm,
	disableEditDailyForm,
	editDriverDailyFormModal,
	submitDriverDailyForm,
	validateEditDriverDailyForm,

	// header date
	headerDate,

	// table
	columns,
	detailList,
	selectedRow,

	// tracking
	tracking,
	trackingTooltips,
	// timezone
	acceptAsTimeZone,
	convertToTimeZone
} = await useToolsAuditId();

const validTrackings = computed(() => {
	return auditTrackings.value?.filter(tracking =>
		tracking?.latitude &&
		tracking?.longitude &&
		!isNaN(tracking.latitude) &&
		!isNaN(tracking.longitude)
	) || [];
});

const trackingPath = computed(() => {
	return validTrackings.value.map(tracking => ({
		lat: tracking.latitude,
		lng: tracking.longitude
	}));
});
const polylineOptions = computed(() => ({
	geodesic: true,
	strokeColor: '#5F6874', // Blue color
	strokeOpacity: 1.0,
	strokeWeight: 4,
	path: trackingPath.value,
	icons: [
		{
			//   icon: {
			//     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			//     scale: 3,
			//     strokeColor: '#465A95'
			//   },
			offset: '100%',
			repeat: '10px'
		}
	]
}));
</script>

<style></style>
