<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Overview</h1>
			<UInput
				class="min-w-[264px]"
				v-model="search"
				:ui="{
					base: 'placeholder:font-medium',
					rounded: 'rounded-lg',
					color: { white: { outline: 'shadow-none ring-grey-border' } }
				}"
				color="white"
				icon="i-heroicons-magnifying-glass-20-solid"
				size="lg"
				placeholder="Search truck no or name"
			/>
		</section>
		<section class="grid grid-cols-12 gap-x-1.5 mt-1.5">
			<div class="col-span-3 h-[calc(100vh-70px)] overflow-y-auto flex flex-col gap-y-1.5">
				<ULink
					:to="`/overview/${tracking.driverDetails.driverId}`"
					v-for="(tracking, ind) in lastTrackings"
					:key="ind"
					class="rounded-lg border border-white dark:border-dark-0 dark:hover:border-transparent hover:border-purple/[.15] bg-white duration-500 hover:bg-purple/[.08] py-2.5 px-4 space-y-2 dark:bg-dark-0 dark:hover:bg-white/[.08]"
				>
					<div class="flex justify-between items-center">
						<p class="flex items-center gap-x-2 text-xs font-medium">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M16 16V6.2C16 5.0799 16 4.51984 15.782 4.09202C15.5903 3.71569 15.2843 3.40973 14.908 3.21799C14.4802 3 13.9201 3 12.8 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V12.8C2 13.9201 2 14.4802 2.21799 14.908C2.40973 15.2843 2.71569 15.5903 3.09202 15.782C3.51984 16 4.0799 16 5.2 16H16ZM16 16H20.4C20.9601 16 21.2401 16 21.454 15.891C21.6422 15.7951 21.7951 15.6422 21.891 15.454C22 15.2401 22 14.9601 22 14.4V11.6627C22 11.4182 22 11.2959 21.9724 11.1808C21.9479 11.0787 21.9075 10.9812 21.8526 10.8917C21.7908 10.7908 21.7043 10.7043 21.5314 10.5314L19.4686 8.46863C19.2957 8.29568 19.2092 8.2092 19.1083 8.14736C19.0188 8.09253 18.9213 8.05213 18.8192 8.02763C18.7041 8 18.5818 8 18.3373 8H16M9 18.5C9 19.8807 7.88071 21 6.5 21C5.11929 21 4 19.8807 4 18.5C4 17.1193 5.11929 16 6.5 16C7.88071 16 9 17.1193 9 18.5ZM20 18.5C20 19.8807 18.8807 21 17.5 21C16.1193 21 15 19.8807 15 18.5C15 17.1193 16.1193 16 17.5 16C18.8807 16 20 17.1193 20 18.5Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							{{ tracking.driverDetails.vehicleUnit }}
						</p>
						<p class="flex items-center gap-x-1 text-xs text-purple dark:text-dark-icon-0">
							<SpeedIcon />
							{{ tracking.vehicleSpeed }}
						</p>
					</div>
					<div class="flex justify-between items-center">
						<p class="flex items-center gap-x-2 font-medium tracking-wide dark:text-white/[0.8]">
							<UserIcon class="w-4" />
							<strong>{{ tracking.driverDetails.firstName }} {{ tracking.driverDetails.lastName }}</strong>
						</p>
						<TheEvent :event-code="tracking.eventCode" :event-type="tracking.eventType" size="md" />
					</div>
					<div class="flex justify-between items-center">
						<p class="flex items-center gap-x-1 font-medium tracking-wide text-grey-1 text-xs">
							<LocationIcon class="w-4" />
							{{ tracking.calculatedLocation || tracking.manualLocation || '' }}
						</p>
						<WifiIcon v-if="tracking.driverDetails.isConnected" class="text-purple dark:text-dark-icon-0" />
						<WifiOffIcon v-else class="text-purple dark:text-dark-icon-0" />
					</div>
				</ULink>
			</div>
			<div class="col-span-9 rounded-lg overflow-hidden">
				<GoogleMap
					:map-id="config.public.GOOGLE_MAPS_MAP_ID"
					:api-key="config.public.GOOGLE_MAPS_API_KEY"
					style="width: 100%; height: 100%"
					:center="{
						lat: lastTrackings?.reduce((a, b) => a + b.latitude, 0) / lastTrackings?.length,
						lng: lastTrackings?.reduce((a, b) => a + b.longitude, 0) / lastTrackings?.length
					}"
					:zoom="4"
				>
					<CustomMarker
						class="cursor-pointer"
						v-for="(tracking, ind) in lastTrackings"
						:key="ind"
						:options="{ position: { lat: tracking.latitude, lng: tracking.longitude }, anchorPoint: 'CENTER' }"
					>
						<UPopover v-if="tracking.eventType === 1 && tracking.eventCode === 3" :popper="{ placement: 'right', arrow: true }" :ui="{ rounded: 'rounded-lg' }">
							<CursorIcon class="w-8" />
							<template #panel>
								<div class="px-2 py-1.5 max-w-44">
									<div class="flex justify-between gap-x-4 text-xs">
										<p class="flex items-center gap-x-1 text-xs text-purple dark:text-dark-icon-0 font-bold">
											<SpeedIcon />
											{{ tracking.vehicleSpeed }}
										</p>
										<p>
											<strong>{{ tracking.driverDetails.vehicleUnit }}</strong>
										</p>
									</div>
									<div class="flex justify-between gap-x-4 mt-3 text-xs">
										<p class="truncate font-medium">{{ tracking.calculatedLocation }}</p>
										<ULink target="_blank" class="shrink-0" :to="`https://maps.google.com/maps?q=${tracking.latitude},${tracking.longitude}`"
											><ArrowUpIcon class="w-4 text-purple dark:text-dark-icon-0"
										/></ULink>
									</div>
								</div>
							</template>
						</UPopover>
						<UPopover v-else :popper="{ placement: 'right', arrow: true }" :ui="{ rounded: 'rounded-lg' }">
							<RecatngleIcon class="w-6" />
							<template #panel>
								<div class="px-2 py-1.5 max-w-44">
									<div class="flex justify-between gap-x-4 text-xs">
										<p class="flex items-center gap-x-1 text-xs text-purple dark:text-dark-icon-0 font-bold">
											<SpeedIcon />
											{{ tracking.vehicleSpeed }}
										</p>
										<p>
											<strong>{{ tracking.driverDetails.vehicleUnit }}</strong>
										</p>
									</div>
									<div class="flex justify-between gap-x-4 mt-3 text-xs">
										<p class="truncate font-medium">{{ tracking.calculatedLocation }}</p>
										<ULink target="_blank" class="shrink-0" :to="`https://maps.google.com/maps?q=${tracking.latitude},${tracking.longitude}`"
											><ArrowUpIcon class="w-4 text-purple dark:text-dark-icon-0"
										/></ULink>
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
import { GoogleMap, CustomMarker } from 'vue3-google-map';

// importing icons
import UserIcon from '~/assets/icons/user-01.svg';
import LocationIcon from '~/assets/icons/marker-pin-01.svg';
import ArrowUpIcon from '~/assets/icons/arrow-circle-broken-up-right.svg';
import SpeedIcon from '~/assets/icons/speed.svg';
import CursorIcon from '~/assets/icons/cursor-02.svg';
import RecatngleIcon from '~/assets/icons/rectangle.svg';
import WifiIcon from '~/assets/icons/wifi.svg';
import WifiOffIcon from '~/assets/icons/wifi-off.svg';

const config = useRuntimeConfig();

// importing composable
import { useOverview } from '~/composables/pages/overview';
const {
	// header search
	search,

	// trackings
	lastTrackings
} = await useOverview();
</script>
