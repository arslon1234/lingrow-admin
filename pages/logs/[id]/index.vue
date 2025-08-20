<template>
	<main id="logs-id">
		<UModal v-model="modals.driverLogsModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Reassign logs to another driver</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modals.driverLogsModal = false" />
				</div>
				<UDivider />
				<div class="space-y-2">
					<UInput
						@input="debouncedInput"
						v-model="driver.searchDriver"
						:ui="{
							padding: { xl: 'px-3 py-2' },
							rounded: 'rounded-lg',
							color: { white: { outline: 'shadow-none ring-grey-border dark:ring-white/[.1]' } }
						}"
						color="white"
						icon="i-heroicons-magnifying-glass-20-solid"
						size="xl"
						placeholder="Select Driver"
					/>
					<ul v-if="driver.driverListFiltered.length" class="border max-h-60 overflow-y-auto rounded-lg border-grey-border dark:border-white/[0.1]">
						<li
							@click="selectReassignedDriver(drivers.id)"
							v-for="(drivers, i) in driver.driverListFiltered"
							:key="i"
							:style="{ backgroundColor: driver.selectedDriver == drivers.id ? 'rgba(70, 90, 149, 0.1)' : '' }"
							class="border-b border-grey-border last:border-b-0 py-2 px-4 duration-200 first:rounded-t-lg last:rounded-b-lg hover:bg-purple/[.04] cursor-pointer flex items-center justify-between dark:border-white/[0.1]"
						>
							{{ drivers.user.firstName }} {{ drivers.user.lastName }}
							<UIcon v-if="driver.selectedDriver === drivers.id" name="i-heroicons-check" class="text-purple" />
						</li>
					</ul>
					<div v-else class="border rounded-lg py-2 px-4 flex items-center justify-center min-h-40 font-bold uppercase">no data</div>
				</div>
				<UDivider />
				<div class="flex items-center justify-end gap-x-3">
					<UButton
						@click="modals.driverLogsModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
					/>
					<UButton :loading="loading" @click="applyReassignDriver" class="w-28 justify-center" size="xl" label="Send" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
				</div>
			</div>
		</UModal>
		<UModal v-model="modals.editProfileModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit Profile Form</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modals.editProfileModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateEditDriverDailyForm" :state="editDriverDailyForm" @submit="submitDriverDailyForm">
					<div class="w-full space-y-6">
						<!-- <UFormGroup v-slot="{ error }" label="Vehicles" name="vehicles">
							<FormInput type="text" :error="error" placeholder="Select Vehicles" v-model="editDriverDailyForm.vehicles" size="xl" />
						</UFormGroup> -->
						<UFormGroup v-slot="{ error }" label="Co-Drivers" name="co-drivers">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search Co-Driver..."
								v-model="editDriverDailyForm.coDrivers"
								placeholder="Select Co-Drivers"
								value-attribute="id"
								option-attribute="fullname"
								:options="drivers.map((driver) => ({ id: driver?.id, fullname: driver?.user.firstName + ' ' + driver?.user.lastName })) || []"
								:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Shipping Docs" name="shipping-docs">
							<FormInput type="text" :error="error" placeholder="Edit Shipping Docs" v-model="editDriverDailyForm.shippingDocs" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Trailers" name="trailers">
							<FormInput type="text" :error="error" placeholder="Edit Trailers" v-model="editDriverDailyForm.trailers" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Signature path" name="signature">
							<FormInput type="text" :error="error" placeholder="Edit Signature Path" v-model="editDriverDailyForm.signaturePath" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="modals.editProfileModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
							/>
							<UButton
								:disabled="disableEditDailyForm"
								:loading="loading"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Send"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="modals.statusModal" :ui="{ base: 'sm:!max-w-[1000px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">{{ action.statusAction === 'edit' ? 'Edit' : 'Add' }} Status</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modals.statusModal = false" />
				</div>
				<UDivider />
				<div class="">
					<ChartMain
						ref="editChart"
						@container:update="getChartEditWidth"
						@dutyEvent:update="getDutyEventStatus"
						:edit="action.statusAction === 'edit' && true"
						:add="action.statusAction === 'add' && true"
						:event-id="event.editEventId"
						:event-time="headerDate"
						:event-type="event.editEventType"
						:event-code="event.editEventCode"
						:chart-data="editChartData"
						:daily-summary="dailySummary"
					/>
					<h1 :class="[chartError ? 'text-red-1 font-medium text-md text-center' : 'min-h-6']">{{ chartError }}</h1>
				</div>

				<div class="flex items-center justify-between gap-x-6">
					<UButton
						v-for="events in events"
						:key="events.key"
						@click="
							event.editEventStatus = events.key;
							statusForm.eventType = event.editEventType = events.eventType;
							statusForm.eventCode = event.editEventCode = events.eventCode;
						"
						type="submit"
						class="justify-center grow"
						size="xl"
						:label="events.label"
						variant="solid"
						:ui="{
							rounded: 'rounded-lg',
							variant: {
								solid:
									events.key === event.editEventStatus
										? 'bg-brown hover:bg-brown text-sm dark:bg-white/[0.2] dark:hover:bg-white/[0.25]'
										: 'bg-brown/[.1] hover:bg-brown/[.2] text-black text-sm dark:bg-white/[0.1] dark:hover:bg-white/[0.2]'
							}
						}"
					/>
				</div>
				<UDivider />
				<UForm :validate="validateStatusForm" :state="statusForm" @submit.prevent="submitEventStatus">
					<div class="w-full grid grid-cols-2 gap-x-6 gap-y-4">
						<UFormGroup v-slot="{ error }" label="Event" name="event-start">
							<TheTimePicker
								@change="(time) => editChart.onEditMouseMove(`${time.hours}:${time.minutes}:${time.seconds}`, true)"
								:check="(time) => shouldBeLess(time, event.editEventEnd)"
								v-model="event.editEventStart"
								:limitless="false"
							>
								<UButton
									class="w-full"
									size="md"
									variant="outline"
									:label="`${event.editEventStart.hours.toString().padStart(2, '0')}:${event.editEventStart.minutes.toString().padStart(2, '0')}:${event.editEventStart.seconds
										.toString()
										.padStart(2, '0')}`"
									:ui="{
										variant: {
											outline: 'text-base ring-grey-border text-black bg-black-0/[.04] dark:text-white/[.8] dark:ring-white/[0.2] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]'
										}
									}"
								/>
							</TheTimePicker>
							<p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Event" name="event-end">
							<TheTimePicker
								@change="(time) => editChart.onEditMouseMove(`${time.hours}:${time.minutes}:${time.seconds}`, false)"
								:check="(time) => shouldBeLess(event.editEventStart, time)"
								v-model="event.editEventEnd"
								:showSeconds="true"
								:limitless="false"
							>
								<UButton
									class="w-full"
									size="md"
									variant="outline"
									:error="error"
									:label="`${event.editEventEnd.hours.toString().padStart(2, '0')}:${event.editEventEnd.minutes.toString().padStart(2, '0')}:${event.editEventEnd.seconds
										.toString()
										.padStart(2, '0')}`"
									:ui="{
										variant: {
											outline: 'text-base ring-grey-border text-black bg-black-0/[.04] dark:text-white/[.8] dark:ring-white/[0.2] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]'
										}
									}"
								/>
							</TheTimePicker>
							<p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Coordination" name="latitude">
							<FormInput type="text" :error="error" placeholder="Edit Latitude" v-model.number="statusForm.latitude" size="xl" />
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							name="longitude"
							:ui="{
								wrapper: 'mt-5'
							}"
						>
							<FormInput type="text" :error="error" placeholder="Edit Longitude" v-model.number="statusForm.longitude" size="xl" />
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							label="Location"
							name="location"
							:ui="{
								wrapper: 'col-span-2'
							}"
						>
							<FormInput type="text" :error="error" placeholder="Edit Location" v-model="statusForm.calculatedLocation" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Engine Hours" name="engine-hours">
							<FormInput type="number" :error="error" placeholder="Edit Engine Hours" v-model="statusForm.totalEngineHours" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Odometer" name="odometer">
							<FormInput type="number" :error="error" placeholder="Edit Odometer" v-model="statusForm.totalVehicleMiles" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Vehicle" name="vehicle" :ui="{ wrapper: 'col-span-2' }">
							<USelectMenu
								size="lg"
								searchable
								searchable-placeholder="Search Vehicle..."
								v-model="statusForm.vehicleId"
								placeholder="Select Vehicle"
								value-attribute="id"
								option-attribute="unit"
								:options="driverVehicles"
								:ui="{ placeholder: 'text-grey-2 font-normal text-sm', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							label="Notes"
							name="notes"
							:ui="{
								wrapper: 'col-span-2'
							}"
						>
							<FormInput type="text" :error="error" placeholder="Edit Notes" v-model="statusForm.annotation" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="modals.statusModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
							/>
							<UButton
								:loading="loading"
								:disabled="disabledSubmit"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Send"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="modals.historyTransferEventsModal" :ui="{ base: 'sm:!max-w-[560px]' }">
			<div class="w-full py-6 px-4 space-y-6">
				<h2 class="text-center font-bold text-lg">Choosen events will be transferred to current log.</h2>
				<UDivider />
				<div class="flex items-center gap-x-3">
					<UButton
						@click="
							modals.historyTransferEventsModal = false;
							historyTransferForm.selectedRowBtnClicked = false;
						"
						class="justify-center flex-1"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
					/>
					<UButton
						@click="historyTransferEventsSubmit"
						class="flex-1 justify-center"
						size="xl"
						:label="!historyTransferForm.dateRange ? 'Apply' : 'Submit'"
						variant="solid"
						:ui="{ rounded: 'rounded-lg' }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="modals.historyTransferLogsByPeriodModal" :ui="{ base: 'sm:!max-w-[560px]' }">
			<transition name="fade" mode="out-in">
				<TheDatePicker
					v-if="!historyTransferForm.dateRangeSubmit"
					@cancel-submit="modals.historyTransferLogsByPeriodModal = false"
					@update:model-value="historyTransferLogsByPeriodSubmit"
					teleport-center
					v-model="historyTransferForm.dateRange"
					:default-open="true"
				></TheDatePicker>
				<div v-else class="w-full py-6 px-4 space-y-6">
					<h2 class="text-center font-bold text-lg">
						Your log will be transferred to original. <br />
						From {{ formatTime(historyTransferForm.dateRange[0], 'MMM D') }}, to {{ formatTime(historyTransferForm.dateRange[1], 'MMM D') }}.
					</h2>
					<UDivider />
					<div class="flex items-center gap-x-3">
						<UButton
							@click="
								modals.historyTransferLogsByPeriodModal = false;
								historyTransferForm.dateRangeSubmit = false;
							"
							class="justify-center flex-1"
							size="xl"
							label="Cancel"
							variant="solid"
							:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
						/>
						<UButton
							@click="historyTransferLogsByPeriodSubmit"
							class="flex-1 justify-center"
							size="xl"
							:label="!historyTransferForm.dateRange ? 'Apply' : 'Submit'"
							variant="solid"
							:ui="{ rounded: 'rounded-lg' }"
						/>
					</div>
				</div>
			</transition>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title">Logs</h1>
			<UButton
				:to="`/driver-logs/${route.params.id}`"
				label="Driver Logs"
				variant="solid"
				size="sm"
				:ui="{ rounded: 'rounded-lg', variant: { solid: 'text-white tracking-wide text-xs' } }"
			>
			</UButton>
		</section>
		<section class="card mt-1.5">
			<div class="grid grid-cols-3 gap-x-4">
				<div class="space-y-[10px]">
					<div class="flex items-center gap-x-4">
						<p class="flex text-[#222222B2] items-center gap-x-1 text-sm font-medium">
							<UserIcon class="w-4 text-purple dark:text-dark-icon-0 shrink-0" />
							{{ driverInfos?.firstName }} {{ driverInfos?.lastName }}
						</p>
						<UBadge
							class="gap-x-1"
							variant="solid"
							:ui="{
								variant: {
									solid: driverInfos?.isConnected
										? 'bg-background-green/[.9] dark:bg-white/[0.1] dark:text-white/[0.8] font-normal py-0.5 text-xs'
										: 'bg-grey-0 font-normal py-0.5 text-xs'
								}
							}"
						>
							<WifiIcon v-if="driverInfos?.isConnected" />
							<WifiOffIcon v-else /> {{ driverInfos?.isConnected ? 'Online' : 'Offline' }}
						</UBadge>
					</div>
					<p class="flex text-[#222222B2] items-center gap-x-1 text-sm font-medium">
						<MailIcon class="text-purple dark:text-dark-icon-0" />
						{{ driverInfos?.email }}
					</p>
					<p class="flex text-[#222222B2] items-center gap-x-1 text-sm font-medium">
						<PhoneIcon class="text-purple dark:text-dark-icon-0" />
						{{ driverInfos?.phoneNumber }}
					</p>
					<p class="flex text-[#222222B2] items-center gap-x-1 text-sm font-medium">
						<TruckIcon class="w-4 text-purple dark:text-dark-icon-0" />
						{{ driverInfos?.vehicleUnit }}
					</p>
				</div>
				<transition name="fade" mode="out-in">
					<div v-if="compareDates(headerDate, convertToTimeZone())" class="flex gap-x-[36px] justify-center items-center">
						<div class="flex items-center flex-col">
							<h3 class="font-semibold uppercase text-[#222222B2]">Break</h3>
							<TheTimer :duration="dailyTimeRemainder?.breakDuration" :total="hosTimeRemainder.breakDuration" />
						</div>
						<div class="flex items-center flex-col">
							<h3 class="font-semibold text-[#222222B2] uppercase">Drive</h3>
							<TheTimer :duration="dailyTimeRemainder?.drivingDuration" :total="hosTimeRemainder.drivingDuration" />
						</div>
						<div class="flex items-center flex-col">
							<h3 class="font-semibold text-[#222222B2] uppercase">Shift</h3>
							<TheTimer :duration="dailyTimeRemainder?.shiftDuration" :total="hosTimeRemainder.shiftDuration" />
						</div>
						<div class="flex items-center flex-col">
							<h3 class="font-semibold text-[#222222B2] uppercase">Cycle</h3>
							<TheTimer :duration="dailyTimeRemainder?.cycleDuration" :total="hosTimeRemainder.cycleDuration" />
						</div>
					</div>
					<div v-else class="h-[114px] w-full"></div>
				</transition>
				<div class="space-y-3 text-end">
					<div class="space-y-2">
						<p class="text-sm font-medium text-[#222222B2]">Worked hours {{ formatDuration(driverInfos?.workedDurationInSeconds) }}</p>
						<p class="text-sm font-medium text-[#222222B2]">
							Violations: {{ weeklyViolations?.find((day) => compareDates(day.dateOfViolations, headerDate))?.violations?.length > 0 ? 'yes' : 'no' }}
						</p>
						<!-- dark:text-white/[0.8] -->
						<p class="text-sm font-medium text-[#222222B2]">Signature: {{ driverDailyForm?.signaturePath ? 'yes' : 'no' }}</p>
					</div>
					<div>
						<UToggle v-model="ui.selectedToggle" />
					</div>
				</div>
			</div>
			<div class="flex mt-4 items-start justify-between gap-x-12">
				<div class="flex gap-2 flex-wrap">
					<TheDatePicker class="!w-fit" v-model="headerDate" @update:model-value="updateHeaderDate([$event, $event])">
						<UButton
							variant="outline"
							:ui="{
								rounded: 'rounded-lg',
								variant: { outline: 'ring-grey-border text-purple dark:text-dark-icon-0 dark:hover:bg-white/[.05] dark:ring-white/[0.1] px-3 py-2.5' }
							}"
						>
							<CalendarIcon class="w-5" />
						</UButton>
					</TheDatePicker>
					<UButton
						v-for="(violation, ind) in weeklyViolations"
						:key="ind"
						:label="formatTime(violation.dateOfViolations, 'MMM D')"
						@click="
							headerDate = acceptAsTimeZone(violation.dateOfViolations);
							updateHeaderDate();
						"
						:variant="
							violation.violations?.length > 0 && !compareDates(violation.dateOfViolations, headerDate)
								? 'soft'
								: compareDates(violation.dateOfViolations, headerDate)
								? 'solid'
								: 'outline'
						"
						:ui="{
							rounded: 'rounded-lg',
							variant: {
								solid:
									violation.violations?.length > 0 && compareDates(violation.dateOfViolations, headerDate)
										? 'text-xs px-4 py-3 bg-red-0 hover:bg-red-0/[.8] hover:ring-red-0/[.8] dark:bg-red-1 dark:hover:bg-red-1/[.8] dark:hover:ring-red-1/[.8] dark:ring-red-1 ring-1 ring-red-0 text-white'
										: 'text-xs px-4 py-3 ring-1 ring-purple hover:ring-purple/[.8] hover:bg-purple/[.8] dark:ring-dark-purple-0 dark:bg-dark-purple-0 dark:hover:bg-dark-purple-0/[.8]',
								outline: 'text-xs px-4 py-3 ring-grey-border text-black dark:ring-white/[0.1] dark:text-white/[0.7] dark:hover:bg-white/[.05]',
								soft: 'text-xs px-4 py-3 ring-1 ring-red-0 bg-red-0/[.2] hover:bg-red-0/[0.1] text-red-0 dark:ring-red-1 dark:text-red-1 dark:bg-red-1/[0.1] dark:hover:bg-red-1/[0.2]'
							}
						}"
					/>
				</div>

				<div class="flex gap-2 flex-wrap">
					<UButton
						v-for="(n, i) in ['AI', 'Boost', 'Optimize', 'History', 'Tracking', 'Insert Info Log', 'Reassign'].slice(7 - (ui.selectedToggle ? 7 : 3), 7)"
						:key="i"
						:label="n"
						@click="
							n === 'History' && route.query.tab !== 'history'
								? navigateTo({ query: { tab: 'history' } })
								: n === 'AI'
								? navigateTo(`/logs/${route.params.id}/ai`)
								: n === 'Boost'
								? navigateTo(`/logs/${route.params.id}/boost`)
								: n === 'Optimize'
								? navigateTo(`/logs/${route.params.id}/optimize`)
								: n === 'Tracking'
								? navigateTo({ hash: '#tracking' })
								: n === 'Insert Info Log'
								? openDailyEvents('add')
								: n === 'Reassign'
								? (modals.driverLogsModal = true)
								: route.query.tab === 'history'
								? navigateTo(`/logs/${route.params.id}`)
								: null
						"
						variant="outline"
						:ui="{
							rounded: 'rounded-lg',
							padding: { sm: 'py-3 px-4' },
							variant: {
								outline:
									'uppercase disabled:opacity-50 text-purple text-xs font-semibold ring-purple/[.5] dark:text-dark-icon-0 dark:ring-dark-icon-0/[.4] dark:hover:bg-dark-icon-0/[.2]' +
									(route.query.tab === n.toLocaleLowerCase() || route.params.tab === n.toLocaleLowerCase()
										? `bg-purple/[.2] hover:bg-purple/[.2] dark:bg-dark-icon-0/[.2] dark:text-white/[.8]`
										: '')
							}
						}"
					/>
				</div>
			</div>
		</section>
		<section class="card mt-1.5 px-0">
			<ChartMain @container:update="getChartWidth" :loading="isGraphLoading" :chart-data="chartData" :daily-summary="dailySummary" :violations="toRaw(dailyPixelViolations)" />
		</section>
		<section
			v-if="weeklyViolations?.find((day) => compareDates(day.dateOfViolations, headerDate))?.violations?.length > 0"
			class="card flex items-center gap-x-7 gap-y-2 mt-3 flex-wrap"
		>
			<h2 class="title text-sm before:bg-red-0 dark:before:bg-red-1">Violations</h2>
			<div v-for="(violation, ind) in weeklyViolations?.find((day) => compareDates(day.dateOfViolations, headerDate))?.violations" :key="ind" class="flex items-center gap-x-3">
				<UBadge variant="outline" :ui="{ variant: { outline: 'ring-red-0 text-red-0 dark:ring-red-1 dark:text-red-1 tracking-wide font-bold' } }">
					{{ violation.description.shortName || violation.description.description || 'No Description' }}</UBadge
				>
				<p class="text-xs font-bold">{{ formatTime(violation.startedAt, 'YYYY-MM-DD hh:mm:ss A') }}</p>
			</div>
		</section>
		<section class="card mt-1.5">
			<div class="flex justify-between items-center">
				<h2 class="title text-sm">Events</h2>
				<div v-if="route.query.tab === 'history'" class="flex items-center gap-x-3">
					<UButton
						@click="modals.historyTransferEventsModal = true"
						size="md"
						label="Transfer Events"
						:disabled="!table.selectedRow.length"
						:variant="table.selectedRow.length ? 'solid' : 'outline'"
						:ui="{
							rounded: 'rounded-lg',
							variant: { solid: 'uppercase tracking-wide font-bold text-sm', outline: 'uppercase tracking-wide font-bold text-sm ring-purple/[.4] text-purple/[.5]' }
						}"
					/>
					<UButton
						@click="modals.historyTransferLogsByPeriodModal = true"
						:disabled="!!table.selectedRow.length"
						size="md"
						label="Transfer Logs By Period"
						:variant="!table.selectedRow.length ? 'solid' : 'outline'"
						:ui="{
							rounded: 'rounded-lg',
							variant: { solid: 'uppercase tracking-wide font-bold text-sm', outline: 'uppercase tracking-wide font-bold text-sm ring-purple/[.4] text-purple/[.5]' }
						}"
					/>
				</div>
			</div>
			<div class="bg-white overflow-hidden border border-grey-border rounded-lg mt-4 dark:bg-dark-0 dark:border-white/[0.1]">
				<UTable
					v-model="table.selectedRow"
					:loading="isDailyEventsLoading"
					:columns="columns"
					:rows="detailList"
					@select="onSelectRow"
					:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
					:progress="{ color: 'primary', animation: 'carousel' }"
					:ui="{
						th: { base: 'border-r last:border-r-0 border-grey-border dark:border-white/[.1]' },
						td: { base: 'border !font-medium border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[.1]' }
					}"
				>
					<template #event-data="{ row }">
						<div v-if="isDailyEventsLoading" class="flex items-center space-x-2">
							<USkeleton class="h-6 w-6 rounded-full" />
							<USkeleton class="h-4 w-16" />
						</div>
						<TheEvent v-else :eventType="row.eventType" :eventCode="row.eventCode" size="md" />
					</template>
					<template #sequence-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #time-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #duration-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #location-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #odometer-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #hours-data>
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
					</template>
					<template #recordOrigin-data="{ row }">
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-20" />
						<span v-else>{{ EventRecordOrigins[row.recordOrigin ?? 1] }}</span>
					</template>
					<template #recordStatus-data="{ row }">
						<USkeleton v-if="isDailyEventsLoading" class="h-4 w-16" />
						<span v-else>{{ EventRecordStatuses[row.recordStatus ?? 1] }}</span>
					</template>
					<template #notes-data="{ row }">
						<div v-if="isDailyEventsLoading" class="flex gap-x-2 items-center justify-between">
							<USkeleton class="h-4 w-32 grow" />
							<USkeleton class="h-7 w-7 rounded" />
						</div>
						<div v-else class="flex gap-x-2 items-center justify-between">
							<p class="grow break-keep whitespace-normal text-xs font-medium">{{ row.notes }}</p>
							<UButton
								v-if="
									!(row.eventType === 1 && row.eventCode === 3 && row.recordOrigin === 1) &&
									row.recordStatus === 1 &&
									[1, 3].includes(row.eventType) &&
									acceptAsTimeZone(row.time).format('MM-DD') === acceptAsTimeZone(headerDate).format('MM-DD') &&
									route.query.tab !== 'history'
								"
								class="shrink-0"
								@click="openDailyEvents('edit', row.eventId)"
								variant="ghost"
								size="xs"
								:ui="{
									variant: {
										ghost: 'hover:bg-purple/[.1] p-2'
									}
								}"
							>
								<template #leading>
									<EditIcon class="w-3.5" />
								</template>
							</UButton>
							<div v-else class="h-[29.5px]"></div>
						</div>
					</template>
				</UTable>
			</div>
		</section>
		<section class="grid grid-cols-12 mt-1.5 gap-x-1.5">
			<div class="col-span-3 card flex flex-col">
				<h2 class="title text-sm">Signature</h2>
				<div class="flex-1 mt-3 flex items-center justify-center">
					<img
						v-if="driverDailyForm?.signaturePath"
						:style="{ filter: useColorMode().value === 'dark' ? 'invert(0.8358)' : '' }"
						class="object-contain h-full w-full rounded-lg duration-200 select-none pointer-events-none"
						:src="useNuxtApp().$config.public.BASE_URL + '/' + driverDailyForm?.signaturePath"
						alt="signature path"
					/>
					<h2 v-else class="font-semibold tracking-wide">NO SIGNATURE PATH</h2>
				</div>
			</div>
			<div class="col-span-9 card">
				<div class="flex justify-between items-start">
					<h2 class="title text-sm">Profile Form</h2>
					<UButton @click="editDriverDailyFormModal" label="Edit" variant="solid" size="xs" :ui="{ rounded: 'rounded-lg', variant: { solid: 'text-white tracking-wide' } }">
						<EditIcon class="w-3" /> Edit
					</UButton>
				</div>
				<div class="mt-4 grid grid-cols-2 border border-grey-border rounded-lg dark:border-white/[0.1]">
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Driver</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">
							{{ driverDailyForm?.driver?.user?.firstName || '&nbsp;' }} {{ driverDailyForm?.driver?.user?.lastName || '&nbsp;' }}
						</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Vehicles</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.assignedVehicles.map((vehicle) => vehicle.unit).join(', ') || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">CARRIER</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.carrier?.name || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Co-Drivers</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">
							{{ driverDailyForm?.coDriver?.user?.firstName || '&nbsp;' }} {{ driverDailyForm?.coDriver?.user?.lastName || '&nbsp;' }}
						</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">DOT number</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.carrier?.usdotNumber || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Trailers</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.trailers.join(', ') || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Home Terminal</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.driver?.homeTerminal?.street || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Shipping Docs</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ driverDailyForm?.shippingDocuments.join(', ') || '&nbsp;' }}</p>
					</div>
					<div class="profile__form--item py-2.5 px-4 space-y-1 border-r border-b border-grey-border even:border-r-0 last:border-b-0 dark:border-white/[0.1]">
						<p class="text-xs uppercase text-grey-0 tracking-wide !font-medium">Distance</p>
						<p class="text-sm uppercase !font-semibold tracking-wide">{{ '&nbsp;' }}</p>
					</div>
				</div>
			</div>
		</section>
		<section id="tracking" class="card mt-1.5">
			<div class="flex items-center justify-between">
				<h2 class="title text-sm">Tracking</h2>
				<UButton
					@click="ui.trackingCollapse = !ui.trackingCollapse"
					variant="solid"
					size="lg"
					:icon="ui.trackingCollapse ? 'i-heroicons-chevron-double-up' : 'i-heroicons-chevron-double-down'"
					:ui="{ rounded: 'rounded-lg', variant: { solid: 'text-white tracking-wide' }, icon: { size: { lg: 'w-4 h-4' } } }"
				>
				</UButton>
			</div>
			<div v-show="ui.trackingCollapse" class="grid grid-cols-12 gap-x-3 mt-3">
				<div class="col-span-3 h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-y-2">
					<div class="rounded-lg border overflow-scroll [&::-webkit-scrollbar]:hidden border-grey-border dark:border-white/[0.1]">
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
											<p class="text-grey-0 font-medium text-sm flex items-center gap-x-1"><RoadIcon class="w-4" />{{ tracking.vehicleMiles || 0 }}mi</p>
											<p class="text-grey-0 font-medium text-sm flex items-center gap-x-1"><SpeedIcon class="w-4" />{{ tracking.vehicleSpeed || 0 }}mph</p>
										</div>
										<p class="text-grey-0 font-medium text-sm flex items-center gap-x-1"><ClockIcon class="mr-1 w-4" />{{ formatDuration(tracking.duration, true) }}</p>
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
										<p class="text-grey-0 font-medium text-sm flex items-center gap-x-1">
											<CalendarIcon class="w-4" />{{ formatTime(tracking.startTime, 'hh:mm A') }} <ArrowNarrowRightIcon />{{ formatTime(tracking.endTime, 'hh:mm A') }}
										</p>
										<p class="text-grey-0 font-medium text-sm flex items-center gap-x-1"><ClockIcon class="mr-1 w-4" />{{ formatDuration(tracking.duration, true) }}</p>
									</div>
								</div>
							</div>
						</template>
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
						<CustomMarker
							v-for="(tracking, ind) in everyTrackings"
							:key="ind"
							:options="{ position: { lat: tracking?.latitude, lng: tracking?.longitude }, anchorPoint: 'CENTER' }"
						>
							<CursorIcon
								v-if="
									dailyTrackings?.trackingEventResponse.at(-1)?.eventCode === 3 &&
									dailyTrackings?.trackingEventResponse.at(-1)?.eventType === 1 &&
									ind + 1 === everyTrackings.length
								"
								class="w-8"
								:style="{
									transform: `rotate(${calculateBearing(everyTrackings[ind - 1]?.latitude, everyTrackings[ind - 1]?.longitude, tracking?.latitude, tracking?.longitude) + 45}deg)`
								}"
							/>
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
											<p class="truncate font-medium flex gap-x-1"><MarkerIcon class="w-4 shrink-0" />{{ tracking.calculatedLocation || tracking.manualLocation || 'N/A' }}</p>
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
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import ArrowNarrowRightIcon from 'assets/icons/arrow-narrow-right.svg';
import CursorMiniIcon from 'assets/icons/cursor-01.svg';
import ArrowUpIcon from '~/assets/icons/arrow-circle-broken-up-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import CircleIcon from '~/assets/icons/circle.svg';
import ClockIcon from '~/assets/icons/clock.svg';
import CursorIcon from '~/assets/icons/cursor-02.svg';
import EditIcon from '~/assets/icons/edit-01.svg';
import FileCheckIcon from '~/assets/icons/file-check-03.svg';
import MailIcon from '~/assets/icons/mail-02.svg';
import MarkerIcon from '~/assets/icons/marker-pin-01.svg';
import PhoneIcon from '~/assets/icons/phone-02.svg';
import SpeedIcon from '~/assets/icons/speed.svg';
import TruckIcon from '~/assets/icons/truck-02.svg';
import UserIcon from '~/assets/icons/user-02.svg';
import WifiOffIcon from '~/assets/icons/wifi-off.svg';
import WifiIcon from '~/assets/icons/wifi.svg';
import RoadIcon from '~/assets/icons/yol.svg';
// importing google map components
import { CustomMarker, GoogleMap, Polyline } from 'vue3-google-map';

// importing config
const config = useRuntimeConfig();

// importing composables
import { useLogsId } from '~/composables/pages/logs/id';
import { useOverviewId } from '~/composables/pages/overview/id';
import { toRaw } from 'vue';
const { dailyTrackings, everyTrackings, calculateBearing, trackingTooltips, selectEvent, selectedEvent, selectedTrackingEvents } = await useOverviewId();

const route = useRoute();

const editChart = ref();

const {
	// state
	modals,
	ui,
	driver,
	event,
	table,
	action,
	// loading
	isGraphLoading,
	isDailyEventsLoading,

	// disabled
	disabledSubmit,
	chartError,
	// graph
	chartData,
	editChartData,
	getChartWidth,
	getChartEditWidth,

	// driver logs
	drivers,
	driverInfos,

	// driver daily form
	driverDailyForm,

	// violations
	weeklyViolations,
	dailyPixelViolations,
	// daily time remainder
	dailyTimeRemainder,

	// daily summary
	dailySummary,

	// reassign form
	debouncedInput,
	selectReassignedDriver,
	applyReassignDriver,

	// history transfer
	historyTransferForm,
	historyTransferEventsSubmit,
	historyTransferLogsByPeriodSubmit,

	// header date
	headerDate,
	updateHeaderDate,

	// daily driver form
	editDriverDailyForm,
	disableEditDailyForm,
	editDriverDailyFormModal,
	submitDriverDailyForm,
	validateEditDriverDailyForm,

	// edit daily events
	statusForm,
	editEventTime,
	shouldBeLess,
	getDutyEventStatus,
	openDailyEvents,
	validateStatusForm,
	submitEventStatus,
	driverVehicles,

	// table
	columns,
	detailList,
	onSelectRow,

	// timezone
	acceptAsTimeZone,
	convertToTimeZone
} = await useLogsId();
</script>

<style></style>
