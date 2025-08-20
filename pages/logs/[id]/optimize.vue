<template>
	<main>
		<UModal v-model="editStatusModal" :ui="{ base: 'sm:!max-w-[650px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Edit Status</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost"
						icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="editStatusModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateStatusForm" :state="editStatus" @submit.prevent="submitEditOptimizeEvent">
					<div class="w-full gap-x-4 gap-y-6 grid grid-cols-12">
						<UFormGroup v-slot="{ error }" class="col-span-3" label="Id" name="id">
							<FormInput type="text" :error="error" placeholder="Id" v-model="editStatus.id" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-9" label="Events" name="events">
							<USelectMenu size="lg" v-model="editStatus.event" placeholder="Select Event"
								value-attribute="event"
								:options="allEvents.map((eldEvent) => ({ event: { eventCode: eldEvent.eventCode, eventType: eldEvent.eventType }, label: eldEvent.label }))"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }">
								<template #label>
									<TheEvent size="md" :event-code="editStatus.event.eventCode"
										:event-type="editStatus.event.eventType" />
								</template>
							</USelectMenu>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Start time" class="col-span-6" name="startDate">
							<TheDatePicker :show-time-picker="true" :show-seconds="true" v-model="editStatus.startDate">
								<UButton class="w-full" size="lg" variant="outline"
									:label="formatTime(editStatus.startDate, 'YYYY-MM-DD hh:mm:ss A')"
									:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.2] bg-black-0/[.04] hover:bg-black-0/[.04] dark:bg-dark-3 dark:hover:bg-dark-3/[.8]' } }" />
							</TheDatePicker>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Origin" name="origin">
							<USelectMenu size="lg" v-model="editStatus.origin" placeholder="Select Origin"
								value-attribute="type" option-attribute="label" :options="[
									{ type: 1, label: RecordOrigin[1]?.shortName },
									{ type: 2, label: RecordOrigin[2]?.shortName },
									{ type: 3, label: RecordOrigin[3]?.shortName }
								]" :ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Vehicle" name="vehicle">
							<FormInput type="text" :error="error" placeholder="Vehicle" v-model="editStatus.vehicle"
								size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-3" label="Odometer" name="odometer">
							<FormInput type="text" :error="error" placeholder="Odometer" v-model="editStatus.odometer"
								size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-3" label="Engine Hours" name="engineHours">
							<FormInput type="text" :error="error" placeholder="Engine hours"
								v-model="editStatus.engine_hours" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location origin" name="locationOrigin">
							<USelectMenu size="lg" v-model="editStatus.location_origin" placeholder="Select Location Origin"
								value-attribute="type" :options="[
									{ label: 'Automatic', type: 1 },
									{ label: 'Manual', type: 2 }
								]" :ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Latitude" name="latitude">
							<FormInput :disabled="editStatus.location_origin === 2" type="text" :error="error"
								placeholder="Edit Latitude" v-model="editStatus.latitude" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-6" label="Longitude" name="longitude">
							<FormInput :disabled="editStatus.location_origin === 2" type="text" :error="error"
								placeholder="Edit Longitude" v-model="editStatus.longitude" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location" name="location">
							<FormInput :disabled="editStatus.location_origin === 2" type="text" :error="error"
								placeholder="Edit Location" v-model="editStatus.location" size="xl" />
						</UFormGroup>
						<UButton class="col-span-4" size="lg" variant="outline" label="Copy"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }">
							<template #leading>
								<CopyIcon class="text-black dark:text-white/[0.8]" />
							</template>
						</UButton>
						<UButton class="col-span-4" size="lg" variant="outline" label="Paste"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }">
							<template #leading>
								<PasteIcon class="text-black dark:text-white/[0.8]" />
							</template>
						</UButton>
						<UButton class="col-span-4" size="lg" variant="outline" label="Map"
							:ui="{ variant: { outline: 'ring-grey-border text-black dark:text-white/[.8] dark:ring-white/[0.1] dark:hover:bg-dark-3' } }">
							<template #leading>
								<MapIcon class="text-black dark:text-white/[0.8] w-4" />
							</template>
						</UButton>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Location note" name="locationNote">
							<FormInput :disabled="editStatus.location_origin === 1" type="text" :error="error"
								placeholder="Edit Location" v-model="editStatus.location_note" size="xl" />
						</UFormGroup>
						<UFormGroup v-slot="{ error }" class="col-span-12" label="Notes" name="notes">
							<FormInput type="text" :error="error" placeholder="Edit Notes" v-model="editStatus.notes"
								size="xl" />
						</UFormGroup>
						<div class="col-span-12 flex items-center gap-x-2 -mt-4">
							<UButton @click="editStatus.notes = b" class="flex-1 justify-center"
								v-for="b in ['PTI', 'Fuel', 'Pick up', 'Delivery', 'DOT', 'Break']" :key="b" size="sm"
								variant="solid" :label="b" :ui="{
									variant: {
										solid: 'bg-background-grey_6 hover:bg-background-grey_5 ring-1 ring-grey-border text-black dark:bg-white/[0.1] dark:ring-white/[0.2] dark:hover:bg-white/[0.2]'
									}
								}" />
						</div>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="editStatusModal = false" class="w-28 justify-center" size="xl" label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-white/[0.3]' } }" />
							<UButton :loading="loading" :disabled="isOptimizeEventsDisabled" type="submit"
								class="w-28 justify-center" size="xl" label="Save" variant="solid"
								:ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="showAllErrorsAndWarningsModal" :ui="{ base: 'sm:!max-w-[900px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Errors & Warnings</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
									 class="-my-1" @click="showAllErrorsAndWarningsModal = false" />
				</div>
				<UDivider />
				<div class="max-h-[60vh] overflow-y-auto">
					<UTable :columns="errorAndWarningColumns"
									:rows="detailList?.filter(eventParent => eventParent?.errorTitles?.length > 0 || eventParent?.warningTitles?.length > 0 )?.map((ev) => ({count: ev.count, event: ev.event, time: ev.est, error: (ev?.errorTitles?.length ? ev.errorTitles.join(' | ') : '') + (ev?.warningTitles?.length ? ((ev?.errorTitles?.length ? ' | ' : '') + ev.warningTitles.join(' | ')) : '')}))"
									:ui="{
							wrapper: 'border border-grey-border rounded-lg overflow-y-auto dark:border-white/[0.08] max-h-full',
							base: (!detailList?.length && 'h-full') || 'h-auto',
							tbody: 'divide-grey-border',
							thead: 'sticky top-0 left-0 bg-white z-[20] shadow-sm dark:bg-dark-0',
							tr: { selected: 'bg-purple/[.04] dark:bg-white/[.02]', base: 'dark:hover:bg-white/[.02] relative' },
							th: { padding: 'px-3 py-2', base: 'border-r border-b last:border-r-0 border-grey-border dark:border-white/[0.08]' },
							td: { padding: 'px-3 py-3', base: 'border border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[0.08] dark:text-white/[0.8]' }
						}">
						<template #event-data="{ row }">
							<TheEvent :event-code="row?.event?.eventCode" :event-type="row?.event?.eventType" />
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
		<section class="card flex justify-between items-center">
			<div class="flex gap-x-4 items-center">
				<div class="flex gap-x-3 items-center">
					<UButton @click="navigateTo(`/logs/${route.params.id}`)" square size="xs" variant="solid">
						<ChevronLeftIcon class="w-4 text-white" />
					</UButton>
					<h1 class="font-semibold uppercase tracking-wide">Optimize</h1>
				</div>
				<div class="flex items-center gap-x-3">
					<UserIcon class="text-purple h-4 w-4" />
					<p class="text-black/[.7] font-medium ml-1 dark:text-white/[0.8]">{{ driverInfos?.firstName }} {{
						driverInfos?.lastName }}</p>
					<UBadge class="gap-x-1" variant="solid" :ui="{
						variant: {
							solid: driverInfos?.isConnected
								? 'bg-background-green/[.9] dark:bg-white/[0.1] dark:text-white/[0.8] font-normal py-0.5 text-xs'
								: 'bg-grey-0 font-normal py-0.5 text-xs'
						}
					}">
						<WifiIcon v-if="driverInfos?.isConnected" />
						<WifiOffIcon v-else /> {{ driverInfos?.isConnected ? 'Online' : 'Offline' }}
					</UBadge>
				</div>
			</div>
			<div class="flex ml-auto items-center gap-x-3">
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton variant="outline" size="sm" :ui="{
						variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
						icon: { base: 'bg-grey-2' }
					}">
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
						{{ dayjs(headerDate.at(0)).format('DD/MM/YYYY') }}
						<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
						{{ dayjs(headerDate.at(-1)).format('DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<UButton :loading="loadingOptimizeEvents" @click="() => loadOptimizeEvents()" variant="solid"
					label="Create" />
			</div>
		</section>
		<transition name="fade" mode="out-in">
			<div v-if="isOptimizeEventsLoaded">
				<section class="card mt-3">
					<div class="flex items-center justify-between gap-x-8">
						<div class="flex gap-x-7 gap-y-3 flex-wrap">
							<UCheckbox 
								v-for="category in optimizeCategories" 
								:key="category.id" 
								:disabled="isOptimizeEventsSubmitted || loading"
								:label="category.name"
								v-model="selectedOptimizeCategories[category.id]" 
							/>
						</div>
						<div class="flex gap-x-4 items-center shrink-0">
							<!-- <UButton variant="outline" size="sm" @click="checkedEvents.all = !checkedEvents.all" label="All"
								:ui="{ variant: { outline: 'bg-purple/[.1] text-black-1 ring-purple/[.5] hover:bg-purple/[.05]' } }">
								<template #leading>
									<UCheckbox v-model="checkedEvents.all" :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton> -->
							<UCheckbox label="All" :disabled="isOptimizeEventsSubmitted || loading" v-model="selectAllOptimizeCategories" />
							<UButton :disabled="!detailList.some(event => event.errorTitles?.length > 0 || event.errorWarnings?.length > 0)" @click="showAllErrorsAndWarningsModal = true" label="(Errors / Warnings)" size="sm"
											 variant="solid" />
							<UButton
								:loading="loading"
								:disabled="isOptimizeEventsSubmitted || loading || !Object.values(selectedOptimizeCategories).some((value) => value === true)"
								@click="submitOptimizeCategories"
								variant="solid"	
								size="sm"
								label="Optimize" 
								:ui="{ rounded: 'rounded-lg' }"
							/>
							<UButton
								@click="submitOptimizeEvents" 
								:disabled="(!tabs.some((tab) => tab.type !== 0 && tab.type !== 1) && tabs.length <= 1) || isOptimizeEventsSubmitted"
								size="sm"		
								variant="solid"
								label="Submit"
							/>
						</div>
					</div>
					<UDivider class="my-2 mt-3" />
					<div class="flex gap-x-4 items-center">
						<UMeter :value="25" />
						<p class="shrink-0 text-sm font-semibold"><span class="text-grey-3">2192</span> / <span
								class="text-black-3">0 000</span></p>
					</div>
				</section>
				<section class="table_config flex-1">
					<div class="h-[calc(100dvh-240px)] rounded-lg overflow-y-auto">
						<UTable
							@select="tableRowSelect" 
							v-model="selectedRow" 
							:columns="columns" 
							:rows="detailList"
							:loading="loadingTable" 
							:disabled="loading"
							:ui="{
								wrapper: ['h-full', loading && 'opacity-50 backdrop-blur-sm pointer-events-none' ],
								base: (!detailList?.length && 'h-full') || 'h-auto',
								tbody: 'divide-grey-border',
								thead: 'sticky top-0 left-0 bg-white z-[20] shadow-sm dark:bg-dark-0',
								tr: { selected: 'bg-purple/[.04] dark:bg-white/[.02]', base: 'dark:hover:bg-white/[.02] relative' },
								th: { padding: 'px-3 py-3', base: 'border-r border-b last:border-r-0 border-grey-border dark:border-white/[0.08]' },
								td: { padding: 'px-3 py-1', base: 'border border-b-0 border-l-0 last:border-r-0 border-grey-border dark:border-white/[0.08] dark:text-white/[0.8]' }
							}">
							<template #est-data="{ row }">
								<div>
									{{ row.est }}
								</div>
								<UTooltip v-if="row?.warningTitles?.length || row?.errorTitles?.length" :open-delay="200"
									:ui="{
										background: row?.errorTitles?.length ? 'bg-red-0 dark:bg-red-0' : 'bg-yellow-1 dark:bg-yellow-1',
										color: 'text-white',
										width: 'w-fit max-w-fit',
										ring: row?.errorTitles?.length ? 'ring-red-0 dark:ring-red-0' : 'ring-yellow-1 dark:ring-yellow-1',
										arrow: {
											ring: row?.errorTitles?.length ? 'before:ring-red-0 dark:before:ring-red-0' : 'before:ring-yellow-1 dark:before:ring-yellow-1',
											background: row?.errorTitles?.length ? 'before:bg-red-0 dark:before:bg-red-0' : 'before:bg-yellow-1 dark:before:bg-yellow-1',
											placement: `!left-1/2 !-translate-x-1/2`
										},
										rounded: 'before:rounded-lg'
									}" :popper="{ placement: 'top-start', arrow: true }" class="absolute left-0 top-0 w-full h-full z-1"
									:text="(row?.errorTitles?.length ? row.errorTitles.join(' | ') : '') + (row?.warningTitles?.length ? ((row?.errorTitles?.length ? ' | ' : '') + row.warningTitles.join(' | ')) : '')">
									&nbsp;
								</UTooltip>
							</template>
							<template #event-data="{ row }">
								<div class="flex items-center gap-x-4">
									<TheEvent :event-type="row?.event?.eventType" :event-code="row?.event?.eventCode" />
								</div>
							</template>
							<template #status-data="{ row }">
								<UBadge class="font-semibold"
									:style="{ backgroundColor: generateHexWithOpacity(ActionStates[parseInt(row.status)]?.color, 0.1), color: ActionStates[parseInt(row.status)]?.color }">
									{{ ActionStates[parseInt(row.status)]?.label }}
								</UBadge>
							</template>

							<template #action-data="{ row }">
								<div class="flex items-center gap-x-2.5">
									<UButton
										:disabled="isOptimizeEventsSubmitted || row.recordOrigin === 4 || row.recordStatus !== 1"
										@click.capture.stop="openEditOptimizeEvent(row.id)" 
										size="sm" 
										variant="soft"
										class="z-10"
										:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }">
										<template #leading>
											<PencilIcon class="text-purple dark:text-dark-timer-0 h-4 w-4" />
										</template>
									</UButton>
									<UButton :disabled="isOptimizeEventsSubmitted"
										@click.capture.stop="copyOptimizeEvent(row.id)" size="sm" variant="soft"
										class="z-10"
										:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }">
										<template #leading>
											<CopyIcon class="text-purple dark:text-dark-timer-0 h-4 w-4" />
										</template>
									</UButton>
									<UButton v-if="row.status === 0"
										:disabled="isOptimizeEventsSubmitted"
										@click.capture.stop="deleteOptimizeEvent(row.id)" size="sm" variant="soft" class="z-10"
										:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }">
										<template #leading>
											<Trash2Icon class="text-purple dark:text-dark-timer-0 h-4 w-4" />
										</template>
									</UButton>
									<UButton v-else
										:disabled="tabs.at(-1).id !== selectedTab.id || selectedTab.type === 0 || isOptimizeEventsSubmitted"
										@click.capture.stop="revertOptimizeEvent(row.id)" size="md" variant="soft"
										class="p-[7px] z-10"
										:ui="{ variant: { soft: 'bg-purple/[.04] dark:bg-white/[.06] hover:bg-purple/[.08] dark:hover:bg-white/[.08] text-purple dark:text-dark-timer-0' } }">
										<template #leading>
											<RevertIcon class="text-purple dark:text-dark-timer-0 h-3.5 w-3.5" />
										</template>
									</UButton>
								</div>
							</template>
						</UTable>
					</div>

					<!-- <UPagination
						class="mt-5"
						:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
						:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
						:model-value="1"
						:total="100"
						v-model="selectedNavigation"
						show-first
						show-last
						:ui="{
							wrapper: 'mx-auto'
						}"
					/> -->
				</section>
			</div>
		</transition>
	</main>
</template>

<script setup>
// importing packages
import dayjs from "dayjs";

import ChevronLeftIcon from 'assets/icons/chevron-left.svg';
import ArrowRightIcon from '~/assets/icons/arrow-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import CopyIcon from '~/assets/icons/copy-06.svg';
import RevertIcon from '~/assets/icons/corner-down-left.svg';
import PencilIcon from '~/assets/icons/edit-01.svg';
import PasteIcon from '~/assets/icons/file-plus-02.svg';
import MapIcon from '~/assets/icons/marker-pin-01.svg';
import Trash2Icon from '~/assets/icons/trash-04.svg';
import UserIcon from '~/assets/icons/user-02.svg';
import WifiOffIcon from '~/assets/icons/wifi-off.svg';
import WifiIcon from '~/assets/icons/wifi.svg';

// router
const route = useRoute();

// importing composable
import { useLogsOptimizeComposable } from '~/composables/pages/logs/id/optimize';

/** RETURNING DATA **/
const {
	// loading
	loading,

	// Drivers and Header
	drivers,
	driverInfos,
	headerDate,
	selectedDriver,

	// Modals
	editStatusModal,
	showAllErrorsAndWarningsModal,
	violationModal,	

	// Optimization Settings
	isOptimized,
	optimizeCategories,
	selectedOptimizeCategories,
	selectAllOptimizeCategories,
	submitOptimizeCategories,

	// Tabs
	tabs,
	selectedTab,

	// Status Form
	editStatus,
	validateStatusForm,

	// Optimize events
	detailList,
	loadingTable,
	openEditOptimizeEvent,
	submitEditOptimizeEvent,
	isOptimizeEventsDisabled,
	isOptimizeEventsSubmitted,
	isOptimizeEventsLoaded,
	loadingOptimizeEvents,
	loadOptimizeEvents,
	deleteOptimizeEvent,
	revertOptimizeEvent,
	copyOptimizeEvent,
	submitOptimizeEvents,

	// Summaries
	boostSummaries,

	// Time Remainder
	boostTimeRemainder,

	// checkedEvents,
	// checkEvents,
	selectedRow,
	tableRowSelect,
	columns,
	errorAndWarningColumns,
} = await useLogsOptimizeComposable();
</script>
