<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Alerts</h1>
			<UInput class="min-w-[264px]" @input="debounceDriverInput" v-model="headerSearch" :ui="{
				padding: { lg: 'px-3 py-2' },
				rounded: 'rounded-lg',
				color: { white: { outline: 'shadow-none ring-grey-border' } }
			}" color="white" size="lg" placeholder="Search driver">
				<template #leading>
					<SearchIcon class="text-grey-1" />
				</template>
			</UInput>
		</section>
		<section class="grid grid-cols-4 gap-x-3">
			<div class="table_config col-span-3 flex flex-col gap-y-5 flex flex-col gap-y-3 h-[calc(100dvh-96px)]">
				<UTable :columns="columns" :rows="filteredRows" @select="tableRowSelect" :ui="{
					wrapper: 'flex-1',
					base: (!filteredRows?.length && 'h-full') || 'h-auto',
					td: { base: '!font-medium' }
				}">
					<template #events-data="{ row }">
						<TheEvent :eventType="row.event.eventType" :event-code="row.event.eventCode" />
					</template>
					<template #eld-data="{ row }">
						<UBadge variant="solid" :ui="{ variant: { solid: row.eld ? 'bg-purple' : 'bg-grey-0' } }">{{
							row.eld ?
								'Online' : 'Offline' }}
						</UBadge>
					</template>
					<template #alert-data="{ row }">
						<AlertIcon class="text-black dark:text-white/[0.8]" />
					</template>
				</UTable>
				<UPagination :first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
					:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
					:total="driverAlertsTotal || 1" v-model="selectedNavigation" show-first show-last :ui="{
						wrapper: 'mx-auto mt-auto'
					}" />
			</div>
			<div class="flex flex-col gap-y-3 mt-3">
				<div class="card">
					<div class="flex justify-between items-center">
						<h3 class="title text-sm">Notifications</h3>
						<AlertIcon class="text-grey-2" />
					</div>
					<UDivider class="mt-3 mb-6" />
					<div class="space-y-3">
						<div @click="selectedStatus = radio.value" v-for="(radio, i) in alerts" :key="radio.value"
							:class="[selectedStatus === radio.value && 'bg-purple/[.1]', !selectedRow ? 'disabled-block' : 'cursor-pointer']"
							class="rounded-lg flex justify-between items-center border border-grey-border h-10 px-3 bg-black-0/[.04] hover:bg-black-0/[.06] duration-200 dark:border-white/[0.1] dark:bg-transparent"
							:uiRadio="{ label: 'text-lg text-black' }">
							<URadio v-model="selectedStatus" v-bind="radio" />
							<div class="flex items-center gap-x-0.5">
								<div v-for="v in 6 - i" :key="v" :style="{ height: `calc(8px + ${v - 1} * 4px)` }"
									class="bg-purple/[.7] w-[5px] rounded-full"></div>
							</div>
						</div>
					</div>
					<div class="mt-6 gap-x-6 flex items-center">
						<UButton :disabled="typeof selectedStatus !== 'number' || loading"
							@click="selectedStatus = null"
							class="flex-1 justify-center dark:bg-dark-button-0 dark:disabled:bg-dark-button-0/[.5] dark:hover:bg-dark-button-0/[0.5]"
							size="xl" label="Cancel" variant="solid"
							:ui="{ variant: { solid: 'bg-grey-2 hover:bg-grey-1 disabled:bg-grey-2' } }" />
						<UButton :loading="loading" :disabled="typeof selectedStatus !== 'number' || loading"
							@click="submitStatusAlert" class="flex-1 justify-center" size="xl" label="Send"
							variant="solid" />
					</div>
				</div>
				<div v-if="selectedRow" class="card flex-1">
					<div class="flex justify-between items-center">
						<h3 class="title text-sm">{{ selectedRow.fullname }}</h3>
						<div class="flex items-center gap-x-2 text-black dark:text-white/[.3]">
							<AlertIcon />
							<p class="font-bold text-sm">{{ getSelectedDriverChats()?.length }}</p>
						</div>
					</div>
					<UDivider class="mt-3 mb-4" />
					<div ref="chat"
						class="h-[calc(100dvh-590px)] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar-thumb]:hidden scroll-smooth">
						<transition-group name="chat" tag="div" class="flex flex-col gap-y-6">
							<div v-for="chat in getSelectedDriverChats()" :key="chat.id"
								class="flex gap-x-2 items-end justify-end">
								<p class="text-grey-0 text-xs font-semibold">{{ chat?.time }}</p>
								<div
									class="py-2 px-4 rounded-xl border border-grey-border dark:border-brown-0 rounded-br-none w-fit max-w-[70%] bg-background-grey_3 dark:bg-brown-0 self-end flex gap-x-4 items-end">
									<p class="w-fit break-all text-sm font-semibold">{{ chat?.text }}</p>
									<DoubleCheckIcon v-if="chat.status" class="w-5 text-purple dark:text-inherit" />
									<CheckIcon v-else class="w-4 text-purple dark:text-inherit" />
								</div>
							</div>
						</transition-group>
					</div>
				</div>
				<!-- min-h-[447px] using is not recommended i gotta find another solution -->
				<div v-else class="card flex-1 flex items-center justify-center">
					<h4 class="uppercase text-xl font-medium text-grey-2">Select driver</h4>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import AlertIcon from '~/assets/icons/bell-ringing-04.svg';
import SearchIcon from '~/assets/icons/search-md.svg';
import CheckIcon from '~/assets/icons/check.svg';
import DoubleCheckIcon from '~/assets/icons/double-check.svg';

// importing composable
import { useAlerts } from '~/composables/pages/alerts';

const {
	loading,
	headerSearch,
	alerts,
	chatText,
	chat,
	selectedStatus,
	driverAlertsTotal,
	submitStatusAlert,
	selectedNavigation,
	selectedRow,
	tableRowSelect,
	columns,
	filteredRows,
	rows,
	getSelectedDriverChats,
	debounceDriverInput
} = await useAlerts();
</script>
