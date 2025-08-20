<template>
	<main>
		<section class="card">
			<h1 class="title">Overview</h1>
		</section>
		<section class="grid grid-cols-12 gap-x-1.5 mt-1.5">
			<div class="col-span-3 flex flex-col gap-y-1.5">
				<div class="card space-y-6">
					<h2 class="title text-sm">Info</h2>
					<div class="space-y-4">
						<div class="flex items-center gap-x-3">
							<p class="text-sm font-medium text-grey-0 uppercase tracking-wide">Vehicle Id</p>
							<div class="grow h-[1px] bg-grey-border"></div>
							<p class="text-sm text-black-1 dark:text-white/[0.8]">
								<strong>{{ dailyTrackings?.trackingEventResponse?.[0]?.vehicleUnit || 'N/A' }}</strong>
							</p>
						</div>
						<div class="flex items-center gap-x-3">
							<p class="text-sm font-medium text-grey-0 uppercase tracking-wide">Driver name</p>
							<div class="grow h-[1px] bg-grey-border"></div>
							<p class="text-sm text-black-1 dark:text-white/[0.8]">
								<strong>{{ dailyTrackings?.firstName }} {{ dailyTrackings?.lastName }}</strong>
							</p>
						</div>
						<div class="flex items-center gap-x-3">
							<p class="text-sm font-medium text-grey-0 uppercase tracking-wide">Phone Number</p>
							<div class="grow h-[1px] bg-grey-border"></div>
							<p class="text-sm text-black-1 dark:text-white/[0.8]">
								<strong>{{ dailyTrackings?.phoneNumber }}</strong>
							</p>
						</div>
						<div class="flex items-center gap-x-3">
							<p class="text-sm font-medium text-grey-0 uppercase tracking-wide">Email</p>
							<div class="grow h-[1px] bg-grey-border"></div>
							<p class="text-sm text-black-1 dark:text-white/[0.8]">
								<strong>{{ dailyTrackings?.email }}</strong>
							</p>
						</div>
					</div>
					<UButton
						:to="`/logs/${dailyTrackings?.driverId}/driver`"
						variant="outline"
						label="Logs"
						block
						trailing-icon="i-heroicons-chevron-right-20-solid"
						size="xl"
						:ui="{
							rounded: 'rounded-lg',
							block: 'justify-between',
							padding: { xl: 'px-3 py-1' },
							size: { xl: 'text-sm' },
							font: 'font-medium',
							base: 'tracking-wide',
							variant: { outline: 'ring-grey-border text-black ' }
						}"
					></UButton>
				</div>
				<div class="rounded-lg bg-white dark:bg-dark-0">
					<div class="py-3 px-4 flex items-center justify-between">
						<h2 class="title text-sm">History</h2>
						<TheDatePicker @update:model-value="updateHeaderDate" class="!w-fit" v-model="headerDate">
							<UButton variant="outline" :ui="{ rounded: 'rounded-lg', padding: { sm: 'py-2 px-2' }, variant: { outline: 'ring-grey-border text-black' } }">
								<CalendarIcon class="w-5" />
							</UButton>
						</TheDatePicker>
					</div>
					<div class="h-[calc(100dvh-360px)] overflow-y-auto">
						<template v-for="tracking in dailyTrackings?.trackingEventResponse" :key="tracking.eventId">
							<div
								v-if="tracking.eventType === 1 && tracking.eventCode === 3"
								@click="selectEvent(tracking)"
								:class="[selectedEvent && selectedEvent.eventId === tracking.eventId && 'bg-purple/[.08] dark:bg-white/[0.08]']"
								class="cursor-pointer hover:bg-purple/[.08] pt-2 duration-200 min-h-28 px-3 flex gap-x-3 last:rounded-b-lg dark:hover:bg-white/[0.08]"
							>
								<div class="flex flex-col items-center gap-y-2">
									<div class="flex items-center justify-center w-6 h-6 bg-purple rounded-full">
										<CursorMiniIcon class="text-white w-3.5" />
									</div>
									<div class="grow w-[2px] bg-purple"></div>
								</div>
								<div class="space-y-2">
									<p class="text-black-1 text-sm dark:text-white/[0.8]"><strong>Drive</strong></p>
									<div class="space-y-1">
										<div class="flex items-center gap-x-6">
											<p class="text-grey-0 font-normal text-sm flex items-center gap-x-1"><RoadIcon class="w-4" />{{ tracking.vehicleMiles || 0 }}mi</p>
											<p class="text-grey-0 font-normal text-sm flex items-center gap-x-1"><SpeedIcon class="w-4" />{{ tracking.vehicleSpeed || 0 }}mph</p>
										</div>
										<p class="text-grey-0 font-normal text-sm flex items-center gap-x-1"><ClockIcon class="mr-1 w-4" />{{ formatDuration(tracking.duration, true) }}</p>
									</div>
								</div>
							</div>
							<div
								@click="selectEvent(tracking)"
								v-else
								:class="[selectedEvent && selectedEvent.eventId === tracking.eventId && 'bg-purple/[.08] dark:bg-white/[0.08]']"
								class="cursor-pointer hover:bg-purple/[.08] pt-2 duration-200 min-h-28 px-3 flex gap-x-3 dark:hover:bg-white/[0.08]"
							>
								<div class="flex flex-col items-center gap-y-2">
									<div class="flex items-center justify-center w-6 h-6 bg-grey-0 rounded-full">
										<MarkerIcon class="text-white w-3.5" />
									</div>
									<div class="grow w-[2px] bg-purple"></div>
								</div>
								<div class="space-y-2">
									<p class="text-black-1 text-sm dark:text-white/[0.8]">
										<strong>{{ tracking.calculatedLocation || tracking.manualLocation || 'N/A' }}</strong>
									</p>
									<div class="space-y-1">
										<p class="text-grey-0 font-normal text-sm flex items-center gap-x-1">
											<CalendarIcon class="w-4" />{{ formatTime(tracking.startTime, 'hh:mm A') }} <ArrowNarrowRightIcon />{{ formatTime(tracking.endTime, 'hh:mm A') }}
										</p>
										<p class="text-grey-0 font-normal text-sm flex items-center gap-x-1"><ClockIcon class="mr-1 w-4" />{{ formatDuration(tracking.duration, true) }}</p>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
			<div class="col-span-9 rounded-lg overflow-hidden">
				<GoogleMap
					v-if="dailyTrackings?.trackingEventResponse?.length"
					:map-id="config.public.GOOGLE_MAPS_MAP_ID"
					:api-key="config.public.GOOGLE_MAPS_API_KEY"
					style="width: 100%; height: 100%"
					:center="{
						lat:
							(selectedEvent && selectedEvent.latitude) ||
							dailyTrackings?.trackingEventResponse?.reduce((a, b) => a + b?.latitude, 0) / dailyTrackings?.trackingEventResponse?.length,
						lng:
							(selectedEvent && selectedEvent.longitude) ||
							dailyTrackings?.trackingEventResponse?.reduce((a, b) => a + b?.longitude, 0) / dailyTrackings?.trackingEventResponse?.length
					}"
					:zoom="selectedEvent ? 12 : 8"
				>
					<Polyline
						:options="{
							geodesic: true,
							strokeColor: selectedEvent && selectedEvent.eventCode === 3 && selectedEvent.eventType === 1 ? '#9295A1' : '#465A95',
							strokeOpacity: 1.0,
							strokeWeight: 10,
							path: everyTrackings.map((tracking) => ({ lat: tracking.latitude, lng: tracking.longitude }))
						}"
					/>
					<Polyline
						v-if="selectedEvent && selectedEvent.eventCode === 3 && selectedEvent.eventType === 1"
						:options="{
							geodesic: true,
							strokeColor: '#465A95',
							strokeOpacity: 1.0,
							strokeWeight: 10,
							path: selectedTrackingEvents.map((tracking) => ({ lat: tracking.latitude, lng: tracking.longitude }))
						}"
					/>
					<CustomMarker v-for="(tracking, ind) in everyTrackings" :key="ind" :options="{ position: { lat: tracking?.latitude, lng: tracking?.longitude }, anchorPoint: 'CENTER' }">
						<CursorIcon
							v-if="
								dailyTrackings?.trackingEventResponse.at(-1)?.eventCode === 3 && dailyTrackings?.trackingEventResponse.at(-1)?.eventType === 1 && ind + 1 === everyTrackings.length
							"
							class="w-8"
							:style="{
								transform: `rotate(${calculateBearing(everyTrackings[ind - 1]?.latitude, everyTrackings[ind - 1]?.longitude, tracking?.latitude, tracking?.longitude) + 45}deg)`
							}"
						/>
						<!-- <DownIcon
							v-else
							class="text-white w-3"
							:style="{
								transform: `rotate(${calculateBearing(tracking?.latitude, tracking?.longitude, everyTrackings[ind + 1]?.latitude, everyTrackings[ind + 1]?.longitude) - 180}deg)`
							}"
						/> -->
					</CustomMarker>
					<CustomMarker
						class="cursor-pointer"
						v-for="(tracking, ind) in dailyTrackings?.trackingEventResponse"
						:key="ind"
						:options="{ position: { lat: tracking.latitude, lng: tracking.longitude }, anchorPoint: 'CENTER' }"
					>
						<UPopover :open="trackingTooltips[tracking.eventId]" :popper="{ placement: 'top', arrow: true }" :ui="{ rounded: 'rounded-lg' }">
							<CircleIcon class="w-6" />
							<template #panel>
								<div class="px-2 py-1.5 min-w-36 max-w-44">
									<div class="flex justify-between gap-x-4 text-xs">
										<p class="truncate font-normal flex gap-x-1">
											<MarkerIcon class="w-4 shrink-0" />{{ tracking.calculatedLocation || tracking.manualLocation || 'N/A' }}
										</p>
										<ULink target="_blank" class="shrink-0" :to="`https://maps.google.com/maps?q=${tracking.latitude},${tracking.longitude}`"
											><ArrowUpIcon class="w-4 text-purple dark:text-dark-icon-0"
										/></ULink>
									</div>
									<div class="mt-3 flex justify-center">
										<p class="text-xs text-grey-0 dark:text-white/[.8] flex gap-x-1"><FileCheckIcon class="w-4" />{{ tracking.annotation }}</p>
									</div>
								</div>
							</template>
						</UPopover>
					</CustomMarker>
				</GoogleMap>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing google map components
import { GoogleMap, CustomMarker, Polyline } from 'vue3-google-map';

// importing icons
import CalendarIcon from '~/assets/icons/calendar.svg';
import CursorMiniIcon from '~/assets/icons/cursor-01.svg';
import FileCheckIcon from '~/assets/icons/file-check-03.svg';
import ArrowNarrowRightIcon from '~/assets/icons/arrow-narrow-right.svg';
import RoadIcon from '~/assets/icons/yol.svg';
import ClockIcon from '~/assets/icons/clock.svg';
import MarkerIcon from '~/assets/icons/marker-pin-01.svg';
import ArrowUpIcon from '~/assets/icons/arrow-circle-broken-up-right.svg';
import SpeedIcon from '~/assets/icons/speed.svg';
import CursorIcon from '~/assets/icons/cursor-02.svg';
import CircleIcon from '~/assets/icons/circle.svg';
import DownIcon from '~/assets/icons/chevron-down.svg';

// importing composable
import { useOverviewId } from '~/composables/pages/overview/id';

// importing config
const config = useRuntimeConfig();

const { headerDate, dailyTrackings, updateHeaderDate, everyTrackings, trackingTooltips, selectEvent, selectedEvent, selectedTrackingEvents } =
	await useOverviewId();
</script>
