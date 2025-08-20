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
						<UFormGroup label="Date" name="date">
							<TheDatePicker v-model="formUpload.date">
								<UButton
									variant="outline"
									size="lg"
									block
									:ui="{
										variant: { outline: 'tracking-wide bg-black-0/[.04] !justify-start ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
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
									@click="formUpload.data_transfer_type = 0"
									:variant="formUpload.data_transfer_type === 0 ? 'outline' : 'soft'"
									class="flex-1 justify-center"
									:ui="{ variant: { soft: 'text-black bg-black-0/[.04] ring-grey-border', outline: 'bg-purple/[.04] ring-purple/[.5] hover:bg-purple/[.08] text-black' } }"
									label="Email"
								/>
								<UButton
									size="lg"
									@click="formUpload.data_transfer_type = 1"
									:variant="formUpload.data_transfer_type === 1 ? 'outline' : 'soft'"
									class="flex-1 justify-center"
									:ui="{ variant: { soft: 'text-black bg-black-0/[.04] ring-grey-border', outline: 'bg-purple/[.04] ring-purple/[.5] hover:bg-purple/[.08] text-black' } }"
									label="Web Service"
								/>
							</div>
						</UFormGroup>
						<UFormGroup
							v-slot="{ error }"
							label="Comment"
							name="comment"
						>
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
							<UButton :disabled="isUploadFormDisabled" :loading="loading" type="submit" class="w-28 justify-center" size="xl" label="Upload" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
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
						<UFormGroup label="Date" name="date">
							<TheDatePicker v-model="formDownload.date">
								<UButton
									variant="outline"
									size="lg"
									block
									:ui="{
										variant: { outline: 'tracking-wide bg-black-0/[.04] !justify-start ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
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
							<UButton :loading="loading" :disabled="isDownloadFormDisabled" type="submit" class="w-28 justify-center" size="xl" label="Download" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<div class="flex gap-x-3 items-center">
				<UButton @click="router.go(-1)" square size="xs" variant="solid">
					<ChevronLeftIcon class="w-4 text-white" />
				</UButton>
				<h1 class="font-semibold uppercase tracking-wide">Driver Logs</h1>
			</div>
			<div class="flex items-center gap-x-3">
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
					</UButton>
				</TheDatePicker>
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
				<UButton @click="uploadModal = true" size="sm" variant="solid" label="Send Output File" icon="i-heroicons-arrow-down-tray">
					<template #leading>
						<UploadIcon class="text-white" />
					</template>
				</UButton>
				<UButton @click="downloadModal = true" size="sm" variant="solid" label="Download Logs" icon="i-heroicons-arrow-down-tray">
					<template #leading>
						<DownloadIcon class="text-white" />
					</template>
				</UButton>
			</div>
		</section>
		<section class="card mt-3 flex items-center justify-between flex-wrap gap-x-8 gap-y-4">
			<div class="flex items-center gap-x-8">
				<p class="flex items-center gap-x-1">
					<UserIcon class="text-purple w-4 h-4" />
					<span class="font-semibold text-sm">{{ driverInfos?.firstName }} {{ driverInfos?.lastName }}</span>
				</p>
				<p class="flex items-center gap-x-1">
					<MailIcon class="text-purple" />
					<span class="font-semibold text-sm">{{ driverInfos?.email }}</span>
				</p>
				<p class="flex items-center gap-x-1">
					<PhoneIcon class="text-purple" />
					<span class="font-semibold text-sm">{{ driverInfos?.phoneNumber }}</span>
				</p>
				<p class="flex items-center gap-x-1">
					<TruckIcon class="text-purple w-4 h-4" />
					<span class="font-semibold text-sm">{{ driverInfos?.vehicleUnit }}</span>
				</p>
			</div>
			<UBadge
				class="gap-x-1"
				variant="solid"
				:ui="{
					variant: {
						solid: driverInfos?.isConnected ? 'bg-background-green/[.9] dark:bg-white/[0.1] dark:text-white/[0.8] font-normal py-0.5 text-xs' : 'bg-grey-0 font-normal py-0.5 text-xs'
					}
				}"
			>
				<WifiIcon v-if="driverInfos?.isConnected" />
				<WifiOffIcon v-else /> {{ driverInfos?.isConnected ? 'Online' : 'Offline' }}
			</UBadge>
		</section>
		<section class="mt-3">
			<div class="table_config flex flex-col gap-y-3 h-[calc(100dvh-150px)]">
				<UTable
					:columns="columns"
					:rows="rows"
					:ui="{ wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto', td: {base: '!font-medium'} }"
				/>
				<UPagination
					class="mt-5"
					v-if="driverLogsTotal > 1"
					:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
					:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
					:model-value="1"
					:total="driverLogsTotal"
					v-model="selectedNavigation"
					:page-count="pageSize"
					show-first
					show-last
					:ui="{
						wrapper: 'mx-auto'
					}"
				/>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import MailIcon from 'assets/icons/mail-02.svg';
import PhoneIcon from 'assets/icons/phone-02.svg';
import TruckIcon from 'assets/icons/truck-02.svg';
import UserIcon from 'assets/icons/user-02.svg';
import CalendarIcon from 'assets/icons/calendar.svg';
import DownloadIcon from 'assets/icons/download-02.svg';
import UploadIcon from 'assets/icons/upload-02.svg';
import WifiIcon from 'assets/icons/wifi.svg';
import ChevronLeftIcon from 'assets/icons/chevron-left.svg';

// importing composable
import { useLogsDriverComposable } from '~/composables/pages/driver-logs/id.ts';
import WifiOffIcon from 'assets/icons/wifi-off.svg';
import ArrowRightIcon from 'assets/icons/arrow-right.svg';

// routers
const route = useRoute();
const router = useRouter();

const {
	loading,
	driverInfos,
	uploadModal,
	downloadModal,
	formUpload,
	formDownload,
	validateUpload,
	validateDownload,
	headerDate,
	selectedViolation,
	selectedNavigation,
	pageSize,
	uploadLogs,
	downloadLogs,
	columns,
	rows,
	driverLogsTotal,
	isUploadFormDisabled,
	isDownloadFormDisabled,
	submitUploadLogs,
	submitDownloadLogs,
} = await useLogsDriverComposable();
</script>
