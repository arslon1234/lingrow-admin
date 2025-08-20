<template>
	<main>
		<UModal v-model="optimizeModal" :ui="{ base: 'sm:!max-w-[600px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Optimize</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="optimizeModal = false" />
				</div>
				<UDivider />
				<div class="grid grid-cols-3 gap-y-8 gap-x-4">
					<UCheckbox v-for="category in optimizeCategories" :key="category.id" :label="category.name" v-model="selectedOptimizeCategories[category.id]" />
				</div>
				<UDivider />
				<div class="flex items-center justify-between">
					<UCheckbox label="All" v-model="selectAllOptimizeCategories" />
					<div class="flex items-center gap-x-3">
						<UButton
							@click="optimizeModal = false"
							class="w-28 justify-center"
							size="xl"
							label="Cancel"
							variant="solid"
							:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
						/>
						<UButton
							:loading="loading"
							:disabled="isOptimized[selectedTab?.id] || loading || !Object.values(selectedOptimizeCategories).some((value) => value === true)"
							@click="submitOptimizeCategories"
							class="w-28 justify-center"
							size="xl"
							label="Optimize"
							variant="solid"
							:ui="{ rounded: 'rounded-lg' }"
						/>
					</div>
				</div>
			</div>
		</UModal>
		<UModal v-model="violationModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Violation</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="violationModal = false" />
				</div>
				<UDivider />
				<div class="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
					<UButton
						@click="
							chart.handleSelectedLineId(violation.violationEventId);
							violationModal = false;
						"
						v-for="(violation, ind) in boostViolations"
						:key="ind + violation?.startedAt"
						block
						class="justify-between"
						variant="outline"
						size="xl"
						trailing-icon="i-heroicons-chevron-right"
						:ui="{ variant: { outline: 'bg-red-0/[.1] ring-red-0/[.5] hover:bg-red-0/[.2]  dark:hover:bg-red-0[0.2]' }, icon: { base: 'text-red-0', size: { xl: 'h-4 w-4' } } }"
					>
						<div class="text-start">
							<p class="text-red-0 font-medium text-xs">{{ formatTime(violation?.startedAt, 'MMM D, YYYY hh:mm A') }}</p>
							<p class="font-medium text-black dark:text-white/[0.8]">{{ violation?.description?.description }}</p>
						</div>
					</UButton>
				</div>
				<UDivider />
				<div class="flex items-center justify-end">
					<UButton
						@click="violationModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="showAllErrorsAndWarningsModal" :ui="{ base: 'sm:!max-w-[1200px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Errors & Warnings</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="showAllErrorsAndWarningsModal = false" />
				</div>
				<div class="max-h-[60vh] overflow-y-auto">
					<UTable
						:columns="errorAndWarningColumns"
						:rows="
							detailList
								?.filter((eventParent) => eventParent?.events?.length > 0)
								?.flatMap((eventPa) => eventPa.events)
								?.filter((evnt) => evnt?.errorTitles?.length > 0 || evnt?.warningTitles?.length > 0)
								?.map((ev) => ({
									count: ev.count,
									event: ev.event,
									time: ev.est,
									error:
										(ev?.errorTitles?.length ? ev.errorTitles.join(' | ') : '') +
										(ev?.warningTitles?.length ? (ev?.errorTitles?.length ? ' | ' : '') + ev.warningTitles.join(' | ') : '')
								}))
						"
						:ui="{
							wrapper: 'border border-grey-border rounded-lg overflow-y-auto dark:border-white/[0.08] max-h-full',
							base: (!detailList?.length && 'h-full') || 'h-auto',
							tbody: 'divide-grey-border',
							thead: 'sticky top-0 left-0 bg-white z-[20] dark:bg-dark-0',
							tr: { selected: 'bg-purple/[.04] dark:bg-white/[.02]', base: 'dark:hover:bg-white/[.02]' },
							th: { base: 'border-r border-b last:border-r-0 border-grey-border dark:border-white/[0.08]' },
							td: { base: 'border border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[0.08] dark:text-white/[0.8]' }
						}"
					>
						<template #event-data="{ row }">
							<TheEvent :event-code="row.event.eventCode" :event-type="row.event.eventType" />
						</template>
					</UTable>
				</div>
				<UDivider />
				<div class="flex items-center justify-end">
					<UButton
						@click="showAllErrorsAndWarningsModal = false"
						class="w-28 justify-center"
						size="xl"
						label="Cancel"
						variant="solid"
						:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
					/>
				</div>
			</div>
		</UModal>
		<UModal v-model="editStatusModal" :ui="{ base: 'sm:!max-w-[650px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit Status</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="editStatusModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateStatusForm" :state="editStatus" @submit.prevent="submitEditBoostEvent">
					<div class="w-full gap-x-4 gap-y-6 grid grid-cols-12">
						<UFormGroup v-slot="{ error }" class="col-span-3" label="Id" name="id">
							<FormInput type="text" :error="error" placeholder="Id" v-model="editStatus.id" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-9" label="Events" name="events">
							<USelectMenu
								size="lg"
								v-model="editStatus.event"
								placeholder="Select Event"
								value-attribute="event"
								@update:modelValue="handleEventSelect"
								:options="allEvents.map((eldEvent) => ({ event: { eventCode: eldEvent.eventCode, eventType: eldEvent.eventType }, label: eldEvent.label }))"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							>
								<template #label>
									<TheEvent :showDate="false" size="md" :event-code="editStatus.event.eventCode" :event-type="editStatus.event.eventType" />
								</template>
							</USelectMenu>
						</UFormGroup>
						<UFormGroup v-if="!isVisibleCertifiedDate" v-slot="{ error }" label="Certified Date" class="col-span-12" name="certifiedDate">
							<TheDatePicker :show-time-picker="true" :show-seconds="true" v-model="editStatus.certifiedDate">
								<UButton
									class="w-full"
									size="lg"
									variant="outline"
									:label="formatTime(editStatus.certifiedDate, 'YYYY-MM-DD hh:mm:ss A')"
									:ui="{
										variant: {
											outline:
												'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.2] bg-black-0/[.04] hover:bg-black-0/[.04] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]'
										}
									}"
								/>
							</TheDatePicker>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Start time" class="col-span-6" name="startDate">
							<TheDatePicker :show-time-picker="true" :show-seconds="true" v-model="editStatus.startDate">
								<UButton
									class="w-full"
									size="lg"
									variant="outline"
									:label="formatTime(editStatus.startDate, 'YYYY-MM-DD hh:mm:ss A')"
									:ui="{
										variant: {
											outline:
												'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.2] bg-black-0/[.04] hover:bg-black-0/[.04] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]'
										}
									}"
								/>
							</TheDatePicker>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Origin" name="origin">
							<USelectMenu
								size="lg"
								v-model="editStatus.origin"
								placeholder="Select Origin"
								value-attribute="type"
								option-attribute="label"
								:options="[
									{ type: 1, label: RecordOrigin[1]?.shortName },
									{ type: 2, label: RecordOrigin[2]?.shortName },
									{ type: 3, label: RecordOrigin[3]?.shortName }
								]"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<!-- <UFormGroup v-slot="{ error }" class="col-span-6" label="Vehicle" name="vehicle">
							<FormInput type="text" :error="error" placeholder="Vehicle" v-model="editStatus.vehicle" size="xl" />
						</UFormGroup> -->

						<UFormGroup v-slot="{ error }" class="col-span-6" label="Vehicle" name="vehicle">
							<USelectMenu
								size="lg"
								v-model="editStatus.vehicleId"
								placeholder="Select Vehicle"
								:error="error"
								:options="editStatus.vehicles.map(vehicle => ({ id: vehicle.id, unit: vehicle.unit, label: vehicle.unit }))"
								value-attribute="id"
								option-attribute="label"
								:ui="{
								color: {
									white: {
									outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]'
									}
								}
								}"
							>
							</USelectMenu>
						</UFormGroup>

						<UFormGroup v-slot="{ error }" class="col-span-3" label="Odometer" name="odometer">
							<FormInput type="number" :error="error" placeholder="Odometer" v-model="editStatus.odometer" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-3" label="Engine Hours" name="engineHours">
							<FormInput type="number" :offset="0.1" :decimalRound="1" :error="error" placeholder="Engine hours" v-model="editStatus.engine_hours" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location origin" name="locationOrigin">
							<USelectMenu
								size="lg"
								v-model="editStatus.location_origin"
								placeholder="Select Location Origin"
								value-attribute="type"
								:options="[
									{ label: 'Automatic', type: 1 },
									{ label: 'Manual', type: 2 }
								]"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Latitude" name="latitude">
							<FormInput
								:disabled="editStatus.location_origin === 2"
								type="number"
								:offset="0.1"
								:decimalRound="6"
								:error="error"
								placeholder="Edit Latitude"
								v-model="editStatus.latitude"
								size="xl"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Longitude" name="longitude">
							<FormInput
								:disabled="editStatus.location_origin === 2"
								type="number"
								:offset="0.1"
								:decimalRound="6"
								:error="error"
								placeholder="Edit Longitude"
								v-model="editStatus.longitude"
								size="xl"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location" name="location">
							<FormInput disabled="true" type="text" :error="error" placeholder="Edit Location" v-model="editStatus.location" size="xl" />
						</UFormGroup>
						<UButton
							class="col-span-4"
							size="lg"
							@click="copyLongLat"
							variant="outline"
							label="Copy"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }"
						>
							<template #leading>
								<CopyIcon class="text-black dark:text-white/[0.8]" />
							</template>
						</UButton>
						<UButton
							class="col-span-4"
							size="lg"
							@click="pasteLongLat"
							variant="outline"
							label="Paste"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }"
						>
							<template #leading>
								<PasteIcon class="text-black dark:text-white/[0.8]" />
							</template>
						</UButton>
						<UButton
							class="col-span-4"
							size="lg"
							@click="redirectToMap"
							variant="outline"
							label="Map"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }"
						>
							<template #leading>
								<MapIcon class="text-black dark:text-white/[0.8] w-4" />
							</template>
						</UButton>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location note" name="locationNote">
							<FormInput :disabled="editStatus.location_origin === 1" type="text" :error="error" placeholder="Edit Location" v-model="editStatus.location_note" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Notes" name="notes">
							<FormInput type="text" :error="error" placeholder="Edit Notes" v-model="editStatus.notes" size="xl" />
						</UFormGroup>
						<div class="col-span-12 flex items-center gap-x-2 -mt-4">
							<UButton
								@click="editStatus.notes = b"
								class="flex-1 justify-center"
								v-for="b in ['PTI', 'Fuel', 'Pick up', 'Delivery', 'DOT', 'Break']"
								:key="b"
								size="sm"
								variant="solid"
								:label="b"
								:ui="{
									variant: {
										solid: 'bg-background-grey_6 hover:bg-background-grey_5 ring-1 ring-grey-border text-black dark:bg-white/[0.1] dark:ring-white/[0.2] dark:hover:bg-white/[0.2]'
									}
								}"
							/>
						</div>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="editStatusModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
							/>
							<UButton
								:loading="loading"
								:disabled="isEditBoostEventDisabled"
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
		<UModal v-model="editProfileModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit Profile Form</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="editProfileModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateProfileForm" :state="editProfile" @submit.prevent="submitEditDailyForm">
					<div class="w-full space-y-6">
						<TheDatePicker @update:model-value="openEditDriverDailyForm" v-model="editProfile.date">
							<UButton
								size="lg"
								:label="formatTime(editProfile?.date, 'YYYY-MM-DD')"
								variant="outline"
								class="justify-between"
								block
								:ui="{
									variant: { outline: 'text-black ring-grey-border bg-black-0/[.04] dark:ring-white/[.2] dark:bg-white/[.04] dark:hover:bg-white/[.08] dark:text-white/[.8]' },
									icon: { base: 'text-grey-1' }
								}"
							>
								<template #leading>
									<button type="button" class="flex items-center justify-center" @click.capture.stop="setEditProfileDate('subtract')">
										<UIcon name="i-heroicons-chevron-left" class="text-grey-1" />
									</button>
								</template>
								<template #trailing>
									<button type="button" class="flex items-center justify-center" @click.capture.stop="setEditProfileDate('add')">
										<UIcon name="i-heroicons-chevron-right" class="text-grey-1" />
									</button>
								</template>
							</UButton>
						</TheDatePicker>
						<UFormGroup label="Co driver" name="co_driver">
							<USelectMenu
								size="lg"
								v-model="editProfile.co_driver"
								value-attribute="driverId"
								option-attribute="fullname"
								placeholder="Select driver"
								:options="editProfile?.co_drivers?.map((driver) => ({ fullname: `${driver.firstName} ${driver.lastName}`, ...driver }))"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
							/>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Trailer" name="trailer">
							<FormInput type="text" :error="error" placeholder="Trailer" v-model="editProfile.trailer" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Shipping docs" name="shipping_docs">
							<FormInput type="text" :error="error" placeholder="Shipping docs" v-model="editProfile.shipping_docs" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Signature" name="signature">
							<FormInput type="text" :error="error" placeholder="Signature" v-model="editProfile.signature" size="xl" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="editProfileModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.1]' } }"
							/>
							<UButton
								:disabled="isEditDriverDailyFormDisabled"
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
		<UModal v-model="boostModal" :ui="{ base: 'sm:!max-w-[600px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Boost</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="boostModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateBoostForm" :state="formBoost" @submit="submitBoostForm">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Tranferring time" name="transferring_time">
							<TheTimePicker v-model="formBoost.transferring_time" :showSeconds="true" :limitless="true">
								<UButton
									class="w-full"
									size="lg"
									variant="outline"
									:label="`${formBoost.transferring_time.hours.toString().padStart(2, '0')}:${formBoost.transferring_time.minutes
										.toString()
										.padStart(2, '0')}:${formBoost.transferring_time.seconds.toString().padStart(2, '0')}`"
									:ui="{ variant: { outline: 'text-base ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.2] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]' } }"
								/>
							</TheTimePicker>
						</UFormGroup>

						<div class="flex items-center justify-between gap-x-4">
							<ul class="px-3 py-1 rounded-xl bg-background-grey_6 dark:bg-dark-modal_select">
								<li class="px-3.5 py-4 flex items-center gap-x-2 border-b border-white dark:border-white/[0.1]">
									<TheEvent size="md" :event-code="copiedMoveEvents[selectedTab.id].at(0).eventCode" :event-type="copiedMoveEvents[selectedTab.id].at(0).eventType" />
								</li>
								<li class="px-3.5 py-2.5 border-b border-white dark:border-white/[0.1]">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Date</p>
									<p class="font-bold">
										{{ formatTime(copiedMoveEvents[selectedTab.id].at(0).eventTime, 'MMM D, hh:mm:ss A') }}
									</p>
								</li>
								<li class="px-3.5 py-2.5 border-b border-white dark:border-white/[0.1]">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Duration</p>
									<p class="font-bold">
										{{ convertSecondsToHours(copiedMoveEvents[selectedTab.id].at(0).duration, ':', ':', true) }}
									</p>
								</li>
								<li class="px-3.5 py-2.5">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Free time</p>
									<p class="font-bold">
										{{
											convertSecondsToHours(
												boostFreeTimes?.find((event) => event.eventId === copiedMoveEvents[selectedTab.id].at(0).eventId)?.freeDurationInSeconds || 0,
												':',
												':',
												true
											)
										}}
									</p>
								</li>
							</ul>
							<UButton @click="reverseMoveTimeEvents" variant="ghost" size="md" :ui="{ variant: { ghost: 'dark:hover:bg-dark-button-1/[.1]' } }">
								<ArrowBlockRightIcon class="duration-200" :class="[isMoveTimeEventsReversed && 'rotate-180']" />
							</UButton>
							<ul class="px-3 py-1 rounded-xl bg-background-grey_6 dark:bg-dark-modal_select">
								<li class="px-3.5 py-4 flex items-center gap-x-2 border-b border-white dark:border-white/[0.1]">
									<TheEvent size="md" :event-code="copiedMoveEvents[selectedTab.id].at(-1).eventCode" :event-type="copiedMoveEvents[selectedTab.id].at(-1).eventType" />
								</li>
								<li class="px-3.5 py-2.5 border-b border-white dark:border-white/[0.1]">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Date</p>
									<p class="font-bold">
										{{ formatTime(copiedMoveEvents[selectedTab.id].at(-1).eventTime, 'MMM D, hh:mm:ss A') }}
									</p>
								</li>
								<li class="px-3.5 py-2.5 border-b border-white dark:border-white/[0.1]">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Duration</p>
									<p class="font-bold">
										{{ convertSecondsToHours(copiedMoveEvents[selectedTab.id].at(-1).duration, ':', ':', true) }}
									</p>
								</li>
								<li class="px-3.5 py-2.5">
									<p class="text-black-1 text-xs dark:text-dark-text-0">Free time</p>
									<p class="font-bold">
										{{
											convertSecondsToHours(
												boostFreeTimes?.find((event) => event.eventId === copiedMoveEvents[selectedTab.id].at(-1).eventId)?.freeDurationInSeconds || 0,
												':',
												':',
												true
											)
										}}
									</p>
								</li>
							</ul>
						</div>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="boostModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }"
							/>
							<UButton
								:disabled="isBoostFormDisabled"
								:loading="loading"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Boost"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card grid gap-x-3 items-center grid-cols-[1fr_1fr_auto] 2xl:grid-cols-[1fr_1fr_1fr]">
			<div class="flex gap-x-3 items-center">
				<UButton @click="navigateTo(`/logs/${route.params.id}`)" square size="xs" variant="solid">
					<ChevronLeftIcon class="w-4 text-white" />
				</UButton>
				<h1 class="font-bold uppercase tracking-wide">Boost</h1>
			</div>
			<transition name="fade" mode="out-in">
				<div v-if="isBoostEventsLoaded" class="flex justify-self-center gap-x-8 rounded-lg px-6 py-1 items-center bg-background-grey_4 dark:bg-background-grey_4/[0.1]">
					<p class="flex items-center gap-x-1 text-sm font-bold">
						Break
						<span class="text-base font-semibold text-purple dark:text-dark-timer-0">
							{{ convertSecondsToHours(boostTimeRemainder?.breakDuration, ':', '') }}
						</span>
					</p>
					<p class="flex items-center gap-x-1 text-sm font-bold">
						Drive
						<span class="text-base font-semibold text-purple dark:text-dark-timer-0">
							{{ convertSecondsToHours(boostTimeRemainder?.drivingDuration, ':', '') }}
						</span>
					</p>
					<p class="flex items-center gap-x-1 text-sm font-bold">
						Shift
						<span class="text-base font-semibold text-purple dark:text-dark-timer-0">
							{{ convertSecondsToHours(boostTimeRemainder?.shiftDuration, ':', '') }}
						</span>
					</p>
					<p class="flex items-center gap-x-1 text-sm font-bold">
						Cycle
						<span class="text-base font-semibold text-purple dark:text-dark-timer-0">
							{{ convertSecondsToHours(boostTimeRemainder?.cycleDuration, ':', '') }}
						</span>
					</p>
				</div>
				<div v-else></div>
			</transition>
			<div class="flex ml-auto items-center gap-x-2">
				<USelectMenu
					size="sm"
					v-model="selectedDriver"
					placeholder="Select Driver"
					:options="drivers"
					option-attribute="name"
					value-attribute="id"
					:ui="{
						color: {
							white: {
								outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide'
							}
						},
						base: 'w-48'
					}"
				/>
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton
						variant="outline"
						size="sm"
						:ui="{
							variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
							icon: { base: 'bg-grey-2' }
						}"
					>
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
						{{ dayjs(headerDate.at(0)).format('DD/MM/YYYY') }}
						<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
						{{ dayjs(headerDate.at(-1)).format('DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<UButton :loading="loadingBoostEvents" @click="() => loadBoostEvents()" variant="solid" label="Create" />
			</div>
		</section>
		<transition name="fade" mode="out-in">
			<div v-if="isBoostEventsLoaded">
				<section class="my-1.5 flex justify-between gap-x-2 items-start">
					<div class="flex flex-wrap items-center gap-2">
						<UChip
							:show="tab.type !== 0 && tab.type !== 1"
							v-for="(tab, i) in tabs"
							:key="tab.id"
							size="md"
							:ui="{ background: 'bg-purple dark:bg-dark-button-1', base: 'dark:ring-dark-1', size: { md: 'dark:text-white/[.8]' } }"
						>
							<UButton
								@click="selectedTab.id !== tab.id && selectTab(tab)"
								size="sm"
								color="white"
								class="ring-0 dark:bg-dark-0 dark:hover:bg-dark-0"
								:class="[selectedTab.id === tab.id && 'dark:bg-dark-button-1 dark:hover:bg-dark-button-1/[.8] bg-purple hover:bg-purple/[.8] text-white']"
								variant="solid"
								:label="tab.name"
							>
								<template #trailing>
									<ChevronRightIcon
										v-if="tabs.length - 1 !== i || tabs.length === 1 || isBoostEventsSubmitted"
										class="text-black dark:text-white/[0.8] w-4"
										:class="[selectedTab.id === tab.id && 'text-white']"
									/>
									<TheConfirmation :arrow="true" @confirm="() => (tabs.length - 1 === i && tabs.length !== 1 ? removeTab(tab.id) : null)" v-else class="flex items-center">
										<div>
											<TrashIcon class="text-black dark:text-white/[0.8]" :class="[selectedTab.id === tab.id && 'text-white']" />
										</div>
									</TheConfirmation>
								</template>
							</UButton>
						</UChip>

						<UButton v-if="!isBoostEventsSubmitted" size="sm" @click="addTab" variant="solid" trailing-icon="i-heroicons-plus" />
					</div>
					<div class="space-x-2 shrink-0">
						<UButton
							@click="openNextLog"
							size="sm"
							variant="solid"
							label="Next log"
							trailing-icon="i-heroicons-chevron-double-right"
							:ui="{ icon: { size: { sm: 'h-3.5 w-3.5' } } }"
						/>
						<UButton
							:loading="isBoostEventsSubmitLoaded"
							@click="submitBoostEvents"
							:disabled="(!tabs.some((tab) => tab.type !== 0 && tab.type !== 1) && tabs.length <= 2) || isBoostEventsSubmitted"
							size="sm"
							variant="solid"
							label="Submit"
						/>
					</div>
				</section>
				<section class="card">
					<div
						:style="{
							gridTemplateColumns: `${boostViolations?.some((v) => v.violations?.length > 0) ? 71.58 : 97.8}px 1fr auto`
						}"
						class="grid w-full"
					>
						<transition name="fade" mode="out-in">
							<div v-if="boostFreeTimes?.length > 0 && !selectedMoveEvents[selectedTab.id]?.length" class="flex gap-2 col-start-2 justify-self-center">
								<button
									v-if="shouldShowActionButton"
									
									@click="scrollPrev"
									class="hover:bg-purple/[0.1] w-8 h-full rounded-lg flex justify-center items-center"
								>
									<ChevronLeftIcon class="w-4 text-purple/[.7]" />
								</button>
								<div ref="contentContainer" :class="['space-x-2 w-[600px] overflow-x-auto flex [&::-webkit-scrollbar]:hidden relative', justifyClass]">
									<template v-for="freeTime in boostFreeTimes" :key="freeTime.eventId">
										<UButton
											v-if="freeTime.freeDurationInSeconds >= 3600"
											@click="freeTimeScroller(freeTime)"
											size="sm"
											:ui="{ label: 'font-semibold', variant: { soft: 'text-purple ring-purple/[.2] bg-purple/[.2] hover:bg-purple/[.3]  dark:bg-dark-button_border-0' } }"
											variant="soft"
											:label="formatDuration(freeTime.freeDurationInSeconds)"
										/>
									</template>
								</div>
								<button v-if="shouldShowActionButton" :disabled="isAtEnd" @click="scrollNext" class="hover:bg-purple/[0.1] w-8 h-full rounded-lg flex justify-center items-center">
									<ChevronRightIcon class="w-4 text-purple/[.7]" />
								</button>
							</div>
							<div v-else-if="selectedMoveEvents[selectedTab.id]?.length > 0" class="col-start-2 justify-self-center w-[200px]">
								<div class="flex items-center gap-x-2 py-1.5">
									<TheEvent size="md" :event-type="copiedMoveEvents[selectedTab.id]?.at(0).eventType" :event-code="copiedMoveEvents[selectedTab.id].at(0).eventCode" />
									<ArrowNarrowRight :class="{ 'rotate-180': isMoveTimeEventsReversed }" />
									<transition name="fade">
										<TheEvent
											size="md"
											v-if="selectedMoveEvents[selectedTab.id]?.length > 1"
											:event-type="copiedMoveEvents[selectedTab.id].at(-1).eventType"
											:event-code="copiedMoveEvents[selectedTab.id].at(-1).eventCode"
										/>
									</transition>
								</div>
							</div>
							<div v-else class="h-8"></div>
						</transition>
						<UBadge
							v-if="boostViolations?.length > 0"
							@click="violationModal = true"
							class="justify-self-end cursor-pointer"
							size="md"
							variant="outline"
							:ui="{ rounded: 'rounded-lg', variant: { outline: 'bg-red-0/[.2] text-red-0 tracking-wide ring-red-0 dark:bg-red-0/[0.1] dark:ring-red-0 dark:text-red-0' } }"
							label="Violated"
						/>
						<UBadge
							v-else
							class="justify-self-end"
							size="md"
							variant="outline"
							:ui="{
								rounded: 'rounded-lg',
								variant: { outline: 'bg-green-0/[.2] text-green-0 tracking-wide ring-green-0 dark:bg-green-0/[.1] dark:ring-green-0 dark:text-green-0' }
							}"
							label="Not violated"
						/>
					</div>

					<ClientOnly>
						<Suspense>
							<template #default>
								<keep-alive>
									<LazyMainChart
										ref="chart"
										@container:update="updateChartWidth"
										@selected-events="getSelectedMoveEvents"
										@selected-event="getSelectedEvent"
										@update-reverse-events="handleMoveTimeEventsReversing"
										:loading="isBoostGraphLoading"
										:chart-data="boostGraph"
										:daily-summaries="boostSummaries"
										:violations="boostPixelViolations"
										:all-violations="allViolationBlocks"
										:free-times="boostFreeTimes"
										:able-to-boost="selectedTab.type !== 0"
										class="mt-2"
									/>
								</keep-alive>
							</template>

							<template #fallback>
								<div class="h-48 flex justify-center items-center">
									<RefreshIcon name="i-heroicons-arrow-path-20-solid" class="w-4 h-4 animate-spin text-black dark:text-white/[.8]" />
								</div>
							</template>
						</Suspense>
					</ClientOnly>
					<div class="flex pl-12 gap-x-4 mt-2.5 items-center">
						<div class="relative w-full h-3 rounded overflow-hidden">
							<UProgress
								animation="carousel"
								size="md"
								:value="((unchangedEventIds.size + changedEventIdsSet.size) / totalEvents) * 90"
								class="[&_::-moz-progress-bar]:bg-purple/[.9] [&_::-webkit-progress-value]:bg-purple/[.9]"
							/>
							<UProgress
								size="md"
								:value="(submitsCount / totalEvents) * 90"
								class="absolute top-0 left-0 w-full h-full [&_::-moz-progress-bar]:bg-[#1f912b] [&_::-webkit-progress-value]:bg-[#1f912b]"
							/>
						</div>
						<UTooltip number="3" :text="`submitted: ${submitsCount} / staged: ${changedEventIdsSet.size} / totalEvents: ${totalEvents}`">
							<p class="shrink-0 text-sm font-semibold text-grey-3">
								<span>{{ submitsCount }}</span> / <span>{{ changedEventIdsSet.size }}</span> /
								<span>{{ totalEvents }}</span>
							</p>
						</UTooltip>
					</div>
				</section>
				<UAlert
					v-if="dotInspectionAlert"
					class="shrink-0 my-1.5 py-1 px-1.5 dark:ring-red-0/[.5] dark:bg-red-0/[.2] ring-red-0/[.5] bg-red-0/[.2] rounded-lg"
					title="The driver has downloaded DOT inspection"
					:actions="[
						{
							label: '',
							variant: 'ghost',
							icon: 'i-heroicons-x-mark',
							class: 'text-red-0 dark:text-red-0 dark:hover:bg-red-0/[.1] hover:bg-red-0/[.1]',
							click: () => (dotInspectionAlert = false)
						}
					]"
				>
					<template #title="{ title }">
						<span class="text-black-1 dark:text-white/[.8]" v-html="title"></span>
					</template>
					<template #icon>
						<UBadge
							size="sm"
							color="primary"
							variant="soft"
							:ui="{ variant: { soft: 'bg-red-0/[.2] dark:bg-red-0/[.2] dark:text-red-0 text-red-0 flex items-center gap-x-1.5 text-sm' }, rounded: 'rounded' }"
						>
							<AlertIcon class="w-4 text-red-0 dark:text-red-0" />
							Warning
						</UBadge>
					</template>
				</UAlert>
				<section class="card mt-1.5 space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="title font-bold">Events</h2>
						<div class="flex gap-x-2 items-center">
							<UButton
								:disabled="!detailList?.flatMap((event) => event.events)?.some((event) => event.errorTitles?.length > 0 || event.errorWarnings?.length > 0)"
								@click="showAllErrorsAndWarningsModal = true"
								label="(Errors / Warnings)"
								size="xs"
								class="max-h-[28px]"
								variant="solid"
							/>
							<UTabs
								v-model="selectedStatus"
								:items="eventFilterItems"
								:ui="{ list: { base: 'border-0', background: 'bg-background-grey_5', padding: 'p-0.5', tab: { inactive: 'text-black', padding: 'px-6 py-1' } } }"
							/>
						</div>
					</div>
					<ClientOnly>
						<Suspense>
							<template #default>
								<!-- <keep-alive> -->
								<LazyTheTable
									ref="table"
									@select="selectEvent"
									@edit-events="openEditDriverDailyForm"
									@selectedRowEvent="selectRowEvent"
									@toggle-events="toggleEvents"
									v-model="selectedRows"
									v-model:expand="expand"
									:columns="columns"
									:filter-table="selectedStatus"
									:disabled-actions="tabs.at(-1).id !== selectedTab.id || selectedTab.type === 0 || isBoostEventsSubmitted"
									:rows="detailList"
									:loading="isBoostEventsLoading"
									:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
									:progress="{ color: 'primary', animation: 'carousel' }"
									:ui="{
										wrapper:
											'border border-grey-border rounded-lg overflow-y-auto dark:border-white/[0.08]' +
											(dotInspectionAlert ? ' h-[calc(100dvh-542px)]' : ' h-[calc(100dvh-500px)]'),
										base: (!detailList?.length && 'h-full') || 'h-auto',
										tbody: 'divide-grey-border',
										thead: 'sticky top-0 left-0 bg-white z-[20] shadow-sm dark:bg-dark-0',
										tr: { selected: 'bg-purple/[.04] dark:bg-white/[.02]', base: 'dark:hover:bg-white/[.02] relative' },
										th: { padding: 'px-3 py-3', base: 'border-r border-b last:border-r-0 !font-semibold border-grey-border dark:border-white/[0.08]' },
										td: {
											padding: 'px-3 py-3',
											base: 'border border-b-0 border-l-0 last:border-r-0 !font-medium border-grey-border dark:border-white/[0.08] dark:text-white/[0.8]'
										}
									}"
								>
									<template #est-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #count-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #duration-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #location-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #system-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #odometer-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #hours-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #notes-data>
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
									</template>
									<template #event-data="{ row }">
										<div v-if="isBoostEventsLoading" class="flex items-center space-x-2">
											<USkeleton class="h-6 w-6 rounded-full" />
											<USkeleton class="h-4 w-16" />
										</div>
										<div v-else class="w-full flex items-center gap-x-4">
											<TheEvent :event-type="row?.event?.eventType" :event-code="row?.event?.eventCode" :certified-date="row?.certifiedDate" />
										</div>
									</template>

									<template #status-data="{ row }">
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
										<UBadge
											v-else
											class="font-medium"
											size="md"
											:style="{ backgroundColor: generateHexWithOpacity(ActionStates[parseInt(row?.status)]?.color, 0.1), color: ActionStates[parseInt(row?.status)]?.color }"
										>
											{{ ActionStates[parseInt(row?.status)]?.label }}
										</UBadge>
									</template>

									<template #dot-data="{ row }">
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
										<ShieldIcon v-if="row.isDOTInspected && !isBoostEventsLoading" class="text-background-purple w-5" />
									</template>

									<template #action-data="{ row }">
										<USkeleton v-if="isBoostEventsLoading" class="h-4 w-20" />
										<div v-else class="flex gap-x-2 items-center">
											<UButton
												:disabled="tabs.at(-1).id !== selectedTab.id || row.status == 4 || selectedTab.type === 0 || isBoostEventsSubmitted || row.recordOrigin === 4 || row.recordStatus !== 1"
												@click.capture.stop="openEditBoostEvent(row.id)"
												size="xs"
												variant="soft"
												class="z-10"
												:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }"
											>
												<template #leading>
													<PencilIcon class="text-purple dark:text-dark-timer-0 h-4 w-3.5" />
												</template>
											</UButton>
											<UButton
												:disabled="tabs.at(-1).id !== selectedTab.id || row.status == 4 || selectedTab.type === 0 || isBoostEventsSubmitted"
												@click.capture.stop="copyBoostEvent(row.id)"
												size="xs"
												variant="soft"
												class="z-10"
												:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }"
											>
												<template #leading>
													<Copy2Icon class="text-purple dark:text-dark-timer-0 h-4 w-4" />
												</template>
											</UButton>
											<UButton
												:disabled="tabs.at(-1).id !== selectedTab.id || row.status == 4 || selectedTab.type === 0 || isBoostEventsSubmitted"
												@click.capture.stop="deleteBoostEvent(row.id)"
												size="xs"
												variant="soft"
												class="z-10"
												:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }"
											>
												<template #leading>
													<Trash2Icon class="text-purple dark:text-dark-timer-0 h-4 w-3.5" />
												</template>
											</UButton>
											<UButton
												v-if="row.status > 1"
												:disabled="tabs.at(-1).id !== selectedTab.id || selectedTab.type === 0 || isBoostEventsSubmitted"
												@click.capture.stop="revertBoostEvent(row.id)"
												size="xs"
												variant="soft"
												class="p-[7px] z-10"
												:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }"
											>
												<template #leading>
													<RevertIcon class="text-purple dark:text-dark-timer-0 h-3.5 w-3.5" />
												</template>
											</UButton>
										</div>
									</template>
								</LazyTheTable>
								<!-- </keep-alive> -->
							</template>

							<template #fallback>
								<UTable
									ref="table"
									@select="selectEvent"
									:columns="columns"
									:rows="[]"
									:loading="true"
									:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
									:progress="{ color: 'primary', animation: 'carousel' }"
									:ui="{
										wrapper:
											'border border-grey-border rounded-lg overflow-y-auto dark:border-white/[0.08]' +
											(dotInspectionAlert ? ' h-[calc(100dvh-638px)]' : ' h-[calc(100dvh-590px)]'),
										base: 'h-full',
										tbody: 'divide-grey-border',
										thead: 'sticky top-0 left-0 bg-white z-[20] shadow-sm dark:bg-dark-0',
										tr: { selected: 'bg-purple/[.04] dark:bg-white/[.02]', base: 'dark:hover:bg-white/[.02] relative' },
										th: { padding: 'px-3 py-3', base: 'border-r border-b last:border-r-0 border-grey-border dark:border-white/[0.08]' },
										td: { padding: 'px-3 py-1', base: 'border border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[0.08] dark:text-white/[0.8]' }
									}"
								/>
							</template>
						</Suspense>
					</ClientOnly>
				</section>
				<section class="card mt-1.5">
					<div class="flex items-center gap-x-2 w-fit ml-auto">
						<UButton @click="detectNearestErrorOrWarningEvent" size="sm" variant="solid" class="px-4 py-2">
							<template #trailing>
								<TrendUpIcon class="text-white duration-200 w-4 h-4" />
							</template>
						</UButton>
						<UButton
							:disabled="isOptimized[selectedTab?.id] || selectedTab.type === 0 || selectedTab.type === 4 || isBoostEventsSubmitted"
							@click="
								optimizeModal = true;
								selectedOptimizeCategories = {};
							"
							size="sm"
							label="Optimize"
							variant="solid"
						/>
						<UButton
							:disabled="
								isBoostTimeMoved[selectedTab?.id] ||
								!selectedMoveEvents[selectedTab.id]?.length ||
								selectedMoveEvents[selectedTab.id]?.length < 2 ||
								selectedTab.type === 0 ||
								selectedTab.type == 3 ||
								isBoostEventsSubmitted
							"
							@click="openBoostModal"
							size="sm"
							label="Boost"
							variant="solid"
						/>
					</div>
				</section>
			</div>
		</transition>
	</main>
</template>

<script setup>
// importing packages
import ChevronLeftIcon from 'assets/icons/chevron-left.svg';
import RefreshIcon from 'assets/icons/refresh-ccw-02.svg';
import dayjs from 'dayjs';
import AlertIcon from '~/assets/icons/alert-triangle.svg';
import ArrowBlockRightIcon from '~/assets/icons/arrow-block-right.svg';
import ArrowNarrowRight from '~/assets/icons/arrow-narrow-right.svg';
import ArrowRightIcon from '~/assets/icons/arrow-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import ChevronRightIcon from '~/assets/icons/chevron-right.svg';
import Copy2Icon from '~/assets/icons/copy-06.svg';
import CopyIcon from '~/assets/icons/copy-07.svg';
import RevertIcon from '~/assets/icons/corner-down-left.svg';
import PencilIcon from '~/assets/icons/edit-01.svg';
import PasteIcon from '~/assets/icons/file-plus-02.svg';
import MapIcon from '~/assets/icons/marker-pin-01.svg';
import ShieldIcon from '~/assets/icons/shield.svg';
import { default as Trash2Icon, default as TrashIcon } from '~/assets/icons/trash-02.svg';
import TrendUpIcon from '~/assets/icons/trend-up-01.svg';
import { useLogsBoostComposable } from '~/composables/pages/logs/id/boost';
import { convertSecondsToHours } from '~/helpers/time';
const LazyMainChart = defineAsyncComponent(() => import('~/components/chart/Main.vue'));
const LazyTheTable = defineAsyncComponent(() => import('~/components/TheTable.vue'));

// router
const route = useRoute();

// Returning Data
const {
	// loading,
	loading,
	isBoostGraphLoading,
	isBoostEventsLoading,
	isBoostEventsSubmitLoaded,
	// chart ref,
	chart,

	// Drivers and Header
	drivers,
	headerDate,
	selectedDriver,

	// Edit driver daily form,
	editProfile,
	setEditProfileDate,
	validateProfileForm,
	openEditDriverDailyForm,
	submitEditDailyForm,
	isEditDriverDailyFormDisabled,

	// Modals
	optimizeModal,
	editStatusModal,
	boostModal,
	editProfileModal,
	violationModal,
	showAllErrorsAndWarningsModal,

	// Optimization Settings
	isOptimized,
	optimizeCategories,
	selectedOptimizeCategories,
	selectAllOptimizeCategories,
	submitOptimizeCategories,

	// Tabs
	tabs,
	selectedTab,
	selectTab,
	addTab,
	removeTab,

	// Status Form
	editStatus,
	validateStatusForm,
	copyLongLat,
	pasteLongLat,
	redirectToMap,

	// Boost Form
	table,
	selectedMoveEvents,
	copiedMoveEvents,
	isMoveTimeEventsReversed,
	isBoostFormDisabled,
	getSelectedMoveEvents,
	handleMoveTimeEventsReversing,
	reverseMoveTimeEvents,
	formBoost,
	detectNearestErrorOrWarningEvent,
	openBoostModal,
	validateBoostForm,
	submitBoostForm,
	getSelectedEvent,

	// Table and Events
	selectedStatus,
	selectedRows,
	columns,
	errorAndWarningColumns,
	expand,
	toggleEvents,
	selectEvent,
	selectRowEvent,

	// Boost Events
	detailList,
	openEditBoostEvent,
	submitEditBoostEvent,
	isEditBoostEventDisabled,
	copyBoostEvent,
	deleteBoostEvent,
	revertBoostEvent,
	submitBoostEvents,
	isBoostEventsSubmitted,
	isBoostEventsLoaded,
	isBoostTimeMoved,
	handleEventSelect,
	isVisibleCertifiedDate,

	// Chart and Graphs
	loadingBoostEvents,
	updateChartWidth,
	loadBoostEvents,
	boostGraph,

	// Event Filters
	eventFilterItems,

	// Dot Inspection
	dotInspectionAlert,

	// Summaries
	boostSummaries,

	// Violations
	boostViolations,
	boostPixelViolations,
	allViolationBlocks,

	// Time Remainder
	boostTimeRemainder,

	// Next Log
	openNextLog,

	// Free times
	boostFreeTimes,
	justifyClass,
	contentContainer,
	freeTimeScroller,
	scrollPrev,
	scrollNext,
	isAtStart,
	isAtEnd,
	shouldShowActionButton,
	// Progres bar events
	totalEvents,
	changedEventIdsSet,
	unchangedEventIds,
	submitsCount
} = useLogsBoostComposable();

</script>
