<template>
	<main>
		<UModal v-model="uploadModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Upload Logs</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="uploadModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateUpload" :state="formUpload" @submit.prevent="submitUploadLogs">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Driver" name="driver">
							<USelectMenu
								size="lg"
								v-model="formUpload.driverId"
								placeholder="Select Driver"
								searchable
								searchable-placeholder="Search Driver"
								option-attribute="fullname"
								value-attribute="id"
								:options="drivers?.map((driver) => ({ fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id }))"
								:ui="{ rounded: 'rounded-lg', color: { white: { outline: 'ring-grey-border bg-black-0/[.04] shadow-none font-medium text-black tracking-wide' } } }"
							/>
						</UFormGroup>
						<UFormGroup label="Date" name="date">
							<TheDatePicker v-model="formUpload.date">
								<UButton
									variant="outline"
									size="lg"
									block
									:ui="{
										variant: {
											outline:
												'tracking-wide bg-black-0/[.04] !justify-start ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]'
										},
										icon: { base: 'bg-grey-2' }
									}"
								>
									<template #leading>
										<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
									</template>
									{{ formatTime(formUpload.date, 'DD/MM/YYYY') }}
								</UButton>
							</TheDatePicker>
						</UFormGroup>
						<UFormGroup label="Data transfer type" name="data_transfer_type">
							<div class="flex gap-x-6">
								<UButton
									size="lg"
									@click="formUpload.data_transfer_type = 1"
									:variant="formUpload.data_transfer_type === 0 ? 'outline' : 'soft'"
									class="flex-1 justify-center"
									:ui="{
										variant: {
											soft: 'text-black bg-black-0/[.04] dark:bg-white/[.1] dark:text-white/[.8] dark:hover:bg-white/[.15] ring-grey-border',
											outline:
												'bg-purple/[.04] dark:bg-white/[.02] ring-purple/[.5] dark:ring-white/[.2] dark:text-white/[.8] dark:hover:bg-white/[.04] hover:bg-purple/[.08] text-black'
										}
									}"
									label="Email"
								/>
								<UButton
									size="lg"
									@click="formUpload.data_transfer_type = 0"
									:variant="formUpload.data_transfer_type === 1 ? 'outline' : 'soft'"
									class="flex-1 justify-center"
									:ui="{
										variant: {
											soft: 'text-black bg-black-0/[.04] ring-grey-border dark:bg-white/[.1] dark:text-white/[.8] dark:hover:bg-white/[.15]',
											outline:
												'bg-purple/[.04] dark:bg-white/[.02] dark:ring-white/[.2] dark:text-white/[.8] ring-purple/[.5] dark:hover:bg-white/[.04] hover:bg-purple/[.08] text-black'
										}
									}"
									label="Web Service"
								/>
							</div>
						</UFormGroup>
						<UFormGroup v-slot="{ error }" label="Comment" name="comment">
							<FormInput type="text" :error="error" placeholder="Leave a comment" v-model="formUpload.comment" size="lg" />
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="uploadModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton
								:disabled="isUploadFormDisabled"
								:loading="loading"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Upload"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<UModal v-model="downloadModal" :ui="{ base: 'sm:!max-w-[440px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Download Logs</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="downloadModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateDownload" :state="formDownload" @submit="submitDownloadLogs">
					<div class="w-full space-y-6">
						<UFormGroup v-slot="{ error }" label="Driver" name="driver">
							<USelectMenu
								size="lg"
								v-model="formDownload.driverId"
								placeholder="Select Driver"
								searchable
								searchable-placeholder="Search Driver"
								option-attribute="fullname"
								value-attribute="id"
								:options="drivers?.map((driver) => ({ fullname: `${driver.user.firstName} ${driver.user.lastName}`, id: driver.id }))"
								:ui="{ rounded: 'rounded-lg', color: { white: { outline: 'ring-grey-border bg-black-0/[.04] shadow-none font-medium text-black tracking-wide' } } }"
							/>
						</UFormGroup>
						<UFormGroup label="Date" name="date">
							<TheDatePicker v-model="formDownload.date">
								<UButton
									variant="outline"
									size="lg"
									block
									:ui="{
										variant: {
											outline:
												'tracking-wide bg-black-0/[.04] !justify-start ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]'
										},
										icon: { base: 'bg-grey-2' }
									}"
								>
									<template #leading>
										<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
									</template>
									{{ formatTime(formDownload.date.at(0), 'DD/MM/YYYY') }}
									<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
									{{ formatTime(formDownload.date.at(-1), 'DD/MM/YYYY') }}
								</UButton>
							</TheDatePicker>
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton
								@click="downloadModal = false"
								class="w-28 justify-center"
								size="xl"
								label="Cancel"
								variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]' } }"
							/>
							<UButton
								:loading="loading"
								:disabled="isDownloadFormDisabled"
								type="submit"
								class="w-28 justify-center"
								size="xl"
								label="Download"
								variant="solid"
								:ui="{ rounded: 'rounded-lg' }"
							/>
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title">Driver Logs</h1>
			<div class="flex items-center gap-x-3">
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton
						variant="outline"
						size="sm"
						:ui="{
							variant: {
								outline:
									'tracking-wide ring-grey-border text-black !font-medium dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8] px-3 gap-x-2 tracking-wider'
							},
							icon: { base: 'bg-grey-2' }
						}"
					>
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
						{{ formatTime(headerDate, 'DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<!--				<USelectMenu-->
				<!--					size="md"-->
				<!--					v-model="selectedFormErrors"-->
				<!--					placeholder=""-->
				<!--					searchable-->
				<!--					searchable-placeholder="Search a filter..."-->
				<!--					option-attribute="label"-->
				<!--					value-attribute="id"-->
				<!--					:options="[-->
				<!--						{ label: 'Filter by Form & Manner Errors', id: 0 },-->
				<!--						{ label: 'Wade Warren', id: 3 },-->
				<!--						{ label: 'Darrell Steward', id: 1 },-->
				<!--						{ label: 'Eleanor Pena', id: 2 },-->
				<!--						{ label: 'Savannah Nguyen', id: 4 },-->
				<!--						{ label: 'Robert Fox', id: 6 },-->
				<!--						{ label: 'Marvin McKinney', id: 5 }-->
				<!--					]"-->
				<!--					:ui="{ wrapper: 'w-56', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"-->
				<!--				/>-->
				<USelectMenu
					size="md"
					v-model="selectedViolation"
					option-attribute="label"
					value-attribute="value"
					placeholder="All Violations"
					:options="[
						{ label: 'All Violations', value: 1 },
						{ label: ViolationType[0], value: 2 },
						{ label: ViolationType[1], value: 3 },
						{ label: ViolationType[2], value: 4 },
						{ label: ViolationType[3], value: 5 }
					]"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<USelectMenu
					size="md"
					v-model="selectedDriver"
					placeholder=""
					searchable
					searchable-placeholder="Search a driver..."
					option-attribute="fullname"
					value-attribute="id"
					:options="[{ fullname: 'All Drivers', id: 'all' }, ...drivers?.map((driver) => ({ fullname: driver.user.firstName + ' ' + driver.user.lastName, id: driver.id }))]"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UButton @click="uploadModal = true" class="px-4" size="sm" variant="solid" label="Send Output File">
					<template #leading>
						<DownloadIcon class="text-white rotate-180" />
					</template>
				</UButton>
				<UButton @click="downloadModal = true" class="px-4" size="sm" variant="solid" label="Download Logs">
					<template #leading>
						<DownloadIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
			<UTable @select="(row) => navigateTo(`/driver-logs/${row.driverId}`)" :columns="columns" :rows="rows" :ui="{ wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto',td: {base: '!font-medium'} }">
				<template #errors-data="{ row }">
					{{ row.errors[0] || 'No Errors Found' }}
					<UDropdown
						v-if="row.errors.length > 0"
						@click.stop
						:items="[[{ label: row.driver, slot: 'header', count: row.errors.length }], [...row.errors?.map((error, ind) => ({ label: error, count: ind + 1 }))]]"
						:popper="{ placement: 'bottom-start', arrow: true }"
						:ui="{
							divide: 'divide-none',
							width: 'w-[300px]',
							rounded: 'rounded-lg',
							background: 'dark:bg-dark-2',
							ring: 'dark:ring-white/[.1]',
							padding: 'first:sticky first:top-0 [&:nth-child(2)>button]:p-2 last:max-h-[300px] p-0',
							arrow: { background: 'dark:before:bg-dark-2 dark:before:ring-white/[.2]' },
							item: { active: '', inactive: 'bg-white dark:bg-dark-2 duration-200', padding: 'p-0' }
						}"
					>
						<UButton
							class="ml-4"
							variant="soft"
							size="xs"
							:label="`${row.errors?.length}`"
							:ui="{ variant: { soft: 'bg-purple/[.2] dark:bg-dark-icon-0/[.2] text-dark-icon-0 dark:hover:bg-dark-icon-0/[.4] hover:bg-purple/[.4] text-purple' } }"
						/>
						<template #item="{ item }"> {{ item.count }}. {{ item.label }} </template>
						<template #header="{ item }">
							<div class="flex w-full items-center justify-between p-2 border-b border-grey-border dark:border-white/[.1] bg-white dark:bg-dark-2 dark:hover:bg-dark-2">
								<span class="font-medium text-black dark:text-white/[.8]">{{ item.label }}</span>
								<UBadge :label="`${item.count}`" class="dark:bg-white/[.1] dark:ring-white/[.2]" color="gray" />
							</div>
						</template>
					</UDropdown>
				</template>
			</UTable>
			<UPagination
				v-if="driversLogsTotal > 1"
				class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:total="driversLogsTotal"
				:page-count="pageSize"
				v-model="selectedNavigation"
				show-first
				show-last
				:ui="{
					wrapper: 'mx-auto'
				}"
			/>
		</section>
	</main>
</template>

<script setup>
// importing icon
import DownloadIcon from 'assets/icons/download-02.svg';
import ArrowRightIcon from 'assets/icons/arrow-right.svg';

// importing composables
import { useDriverLogs } from '~/composables/pages/driver-logs/index.ts';
import CalendarIcon from 'assets/icons/calendar.svg';

const {
	loading,
	columns,
	rows,
	drivers,
	headerDate,
	selectedDriver,
	selectedViolation,
	selectedFormErrors,
	selectedNavigation,
	driversLogsTotal,
	uploadModal,
	downloadModal,
	formUpload,
	formDownload,
	pageSize,
	isUploadFormDisabled,
	isDownloadFormDisabled,
	validateUpload,
	validateDownload,
	submitUploadLogs,
	submitDownloadLogs
} = await useDriverLogs();
</script>
