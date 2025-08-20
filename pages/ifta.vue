<template>
	<main>
		<UModal v-model="addReportModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Ifta Report</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
									 class="-my-1" @click="addReportModal = false" />
				</div>
				<UDivider />
				<UForm :validate="validateReport" :state="formReport" @submit="addIfta">
					<div class="w-full grid grid-cols-2 gap-x-4 gap-y-8">
						<UFormGroup v-slot="{ error }" class="col-span-2" label="Vehicle" name="vehicleIds">
							<USelectMenu size="lg" searchable searchable-placeholder="Search a vehicle..."
													 v-model="formReport.vehicleIds" placeholder="Select vehicle" option-attribute="unit"
													 value-attribute="id"
													 :options="vehicles" multiple
													 :ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }">
								<template #label>
									<span v-if="formReport.vehicleIds?.length" class="truncate">{{
											formReport.vehicleIds.map(vehicleId =>
												vehicles.filter(p => p.unit !== '').find(p => p.id === vehicleId)?.unit).join(', ')
										}}</span>
									<span v-else>Select vehicle</span>
								</template>
							</USelectMenu>
						</UFormGroup>
						<!--						<UFormGroup v-slot="{ error }" label="Years" name="years">-->
						<!--							<USelectMenu size="lg" searchable searchable-placeholder="Search year..." v-model="formReport.years"-->
						<!--								placeholder="Select year" :options="['2020', '2021', '2022', '2023', '2024']"-->
						<!--								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />-->
						<!--						</UFormGroup>-->
						<!--						<UFormGroup v-slot="{ error }" label="Quarter" name="quarter">-->
						<!--							<USelectMenu size="lg" searchable searchable-placeholder="Search quearter..." v-model="formReport.quarter"-->
						<!--								placeholder="Select quarter" :options="['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']"-->
						<!--								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }" />-->
						<!--						</UFormGroup>-->
						<UFormGroup v-slot="{ error }" label="Choose Date" class="col-span-2" name="date">
							<TheDatePicker v-model="formReport.date">
								<UButton
									block
									variant="outline"
									size="lg"
									:ui="{
							variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
							icon: { base: 'bg-grey-2' }
						}"
								>
									<template #trailing>
										<CalendarIcon class="text-grey-2 dark:text-white/[.3] w-5 ml-auto" />
									</template>
									{{ dayjs(formReport.date.at(0)).format('DD/MM/YYYY') }}
									<ArrowRightIcon class="text-black dark:text-white/[.8] w-4" />
									{{ dayjs(formReport.date.at(-1)).format('DD/MM/YYYY') }}
								</UButton>
							</TheDatePicker>
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton @click="addReportModal = false"
											 class="w-28 justify-center dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.5]" size="xl"
											 label="Cancel" variant="solid"
											 :ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-grey-2 hover:bg-grey-1' } }" />
							<UButton :loading="loading" :disabled="isAddIftaDisabled" type="submit" class="w-28 justify-center"
											 size="xl" label="Run" variant="solid" :ui="{ rounded: 'rounded-lg' }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">IFTA</h1>
			<UButton @click="addReportModal = true" size="sm" variant="solid" label="Add Ifta">
				<template #leading>
					<PlusCircleIcon class="text-white" />
				</template>
			</UButton>
		</section>
		<section class="table_config flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
			<UTable v-model="selectedRows" @select="tableRowSelect" :ui="{wrapper: 'flex-1', base: (!rows?.length && 'h-full') || 'h-auto'}" :columns="columns" :rows="rows">
				<template #status-data="{ row }">
					<p :style="{ color: statuses.find((e) => e.value === row.status).color }"
						 class="flex items-center gap-x-2 font-semibold text-sm">
						<LoadingIcon v-if="row.status === 'processing'" />
						<ReadyIcon v-if="row.status === 'ready'" />
						{{ statuses.find((e) => e.value === row.status).label }}
					</p>
				</template>
				<template #report-data="{ row }">
					<div class="flex items-center gap-x-6">
						<UButton @click.capure.stop :to="row.pdfPath ? `${$config.public.BASE_URL}/${row.pdfPath}` : null" target="_blank" download size="sm" variant="link" label="PDF" :ui="{ variant: { link: 'text-purple' } }">
							<template #leading>
								<FilePdfIcon />
							</template>
						</UButton>
						<UButton @click.capure.stop :to="row.csvPath ? `${$config.public.BASE_URL}/${row.csvPath}` : null" target="_blank" download size="sm" variant="link" label="CSV" :ui="{ variant: { link: 'text-purple' } }">
							<template #leading>
								<FileCsvIcon />
							</template>
						</UButton>
					</div>
				</template>
			</UTable>
			<UPagination class="mt-3" :first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
									 :last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
									 :total="iftaTotalCount || 1"
									 v-model="selectedNavigation" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}" />
		</section>
	</main>
</template>

<script setup>
// importing icons
import CalendarIcon from '~/assets/icons/calendar.svg';
import ReadyIcon from '~/assets/icons/check-circle.svg';
import FilePdfIcon from '~/assets/icons/file-download-02.svg';
import FileCsvIcon from '~/assets/icons/file-download-03.svg';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg';
import LoadingIcon from '~/assets/icons/loading-02.svg';
import ArrowRightIcon from 'assets/icons/arrow-right.svg';

// importing packages
import dayjs from 'dayjs';

// importing composable
import { useIfta } from '~/composables/pages/ifta';

const { $config } = useNuxtApp();

const {
	loading,
	isAddIftaDisabled,
	vehicles,
	addIfta,
	addReportModal,
	iftaTotalCount,
	formReport,
	validateReport,
	selectedNavigation,
	statuses,
	selectedRows,
	tableRowSelect,
	columns,
	rows
} = await useIfta();
</script>
