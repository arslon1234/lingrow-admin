<template>
	<main>
		<section class="card flex justify-between items-center">
			<div class="flex gap-x-8 items-center">
				<div class="flex gap-x-3 items-center">
					<UButton @click="navigateTo(`/logs/${route.params.id}`)" square size="xs" variant="solid">
						<ChevronLeftIcon class="w-4 text-white" />
					</UButton>
					<h1 class="font-semibold uppercase tracking-wide">AI</h1>
				</div>
				<transition name="fade">
					<UTabs
						v-if="!isFinished"
						class="shrink-0 translate-y-[1px]"
						:model-value="tabs.indexOf(selectedTab)"
						@change="updateSelectedTab"
						:items="tabs?.map((tab) => ({ label: tab.name, value: tab.id }))"
					/>
				</transition>
			</div>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedDriver"
					placeholder="Select Driver"
					value-attribute="id"
					option-attribute="name"
					:options="drivers?.map((driver) => ({ id: driver.id, name: `${driver.user.firstName} ${driver.user.lastName}` }))"
					:ui="{ rounded: 'rounded-lg', color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide translate-y-[1px] w-48' } } }"
				/>
				<TheDatePicker class="!w-fit" v-model="headerDate">
					<UButton
						variant="outline"
						size="md"
						:ui="{
							variant: { outline: 'tracking-wide ring-grey-border text-black dark:hover:bg-white/[.1] dark:bg-white/[.05] dark:ring-white/[.2] dark:text-white/[.8]' },
							icon: { base: 'bg-grey-2' }
						}"
					>
						<template #leading>
							<CalendarIcon class="text-grey-2 dark:text-white/[.8] w-5" />
						</template>
						{{ dayjs(headerDate.at(0)).format('DD/MM/YYYY') }} <ArrowRightIcon class="text-black dark:text-white/[.8] w-4" /> {{ dayjs(headerDate.at(-1)).format('DD/MM/YYYY') }}
					</UButton>
				</TheDatePicker>
				<UButton
					:loading="submitLoading"
					@click="isSubmitted ? loadAiActions() : submitAI()"
					size="md"
					variant="solid"
					class="w-24 justify-center"
					:label="isSubmitted ? 'Create' : 'Finish'"
				/>
			</div>
		</section>
		<transition name="fade">
			<div v-if="!isFinished && selectedDriver">
				<section class="card mt-1.5">
					<ChartMain
						ref="chart"
						@container:update="updateChartWidth"
						@selected-event="selectEvent"
						:free-times="aiMovedTimes"
						:able-to-select="true"
						:chart-data="boostGraph"
						:daily-summaries="boostSummaries"
					/>
				</section>
				<section class="grid grid-cols-12 gap-1.5 mt-1.5 h-[calc(100dvh-294px)]">
					<div class="col-span-8 bg-white rounded-lg dark:bg-dark-0 overflow-hidden">
						<transition name="fade">
							<div
								v-if="tabs?.length && selectedTab && tabs.length !== tabs.indexOf(selectedTab) + 1 && selectedTab?.type !== 0"
								class="card h-[calc(100dvh-314px)] overflow-y-auto"
							>
								<h2 class="title mb-4">AI - Smart Repair/Report</h2>
								<div v-if="reportsHeader.actionType !== 0 && reportsHeader.actionType !== 2" class="grid grid-cols-2 gap-3">
									<div class="grid grid-cols-2 gap-3">
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Repaired</h4>
											<div class="flex gap-x-1 text-[#E3C012] float-end">
												<ArrowNarrowDownIcon class="w-6 rotate-180 text-[#E3C012]" />
												<p class="text-xl font-semibold">{{ reportsHeader?.eventsRepaired }}</p>
											</div>
										</div>
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Failed</h4>
											<div class="flex gap-x-1 text-[#6B7BAA] float-end">
												<ArrowNarrowDownIcon class="w-6 text-[#6B7BAA]" />
												<p class="text-xl font-semibold">{{ reportsHeader?.categoriesFailedToFix ?? 0 }}</p>
											</div>
											<template v-if="reportsHeader?.failedCategories?.length > 0">
												<div v-for="(failedCategory, i) in reportsHeader?.failedCategories ?? []" :key="i">{{ i + 1 }}. {{ failedCategory }}</div>
											</template>
										</div>
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Changed Events</h4>
											<div class="flex gap-x-1 float-end">
												<PencilIcon class="w-6 text-[#59C84D]" />
												<p class="text-xl font-semibold text-[#59C84D]">{{ reportsHeader?.eventsModified }}</p>
											</div>
										</div>
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Deleted</h4>
											<div class="flex gap-x-1 float-end">
												<TrashIcon class="w-6 text-[#F26D7D]" />
												<p class="text-xl font-semibold text-[#F26D7D]">{{ reportsHeader?.eventsDeleted }}</p>
											</div>
										</div>
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Created</h4>
											<div class="flex gap-x-1 float-end">
												<FilePlus class="w-6 text-[#4C8E97]" />
												<p class="text-xl font-semibold text-[#4C8E97]">{{ reportsHeader?.eventsCreated }}</p>
											</div>
										</div>
										<div class="rounded-lg border border-grey-border dark:border-white/[.1] space-y-3 p-4">
											<h4 class="text-sm text-grey-0">Updated</h4>
											<div class="flex gap-x-1 float-end">
												<ToolIcon class="w-6 text-[#9B5F6B]" />
												<p class="text-xl font-semibold text-[#9B5F6B]">{{ reportsHeader?.eventsUpdated }}</p>
											</div>
										</div>
									</div>
									<div class="rounded-lg border border-grey-border dark:border-white/[.1]">
										<ClientOnly>
											<apexchart width="100%" height="100%" type="donut" :options="pieChartOptions" :series="pieChartSeries"></apexchart>
										</ClientOnly>
									</div>
								</div>
								<UDivider class="my-4" />
								<div>
									<UAccordion :items="reportsList" variant="solid" size="xl" :ui="{ wrapper: 'w-full flex flex-col', item: { padding: 'pb-1.5 pt-0' } }">
										<template #item="{ item }">
											<UTable
												:columns="columns"
												:rows="item.rows"
												@select="
													(row) => {
														chart.handleSelectedLineId(row?.eventId);
													}
												"
												:ui="{
													wrapper: 'h-full border border-purple/[.1] rounded-xl',
													thead: 'sticky top-0 z-10 bg-white dark:bg-dark-0',
													th: { base: 'whitespace-nowrap' }
												}"
											>
												<template #event-data="{ row }">
													<TheEvent :event-code="row?.event?.eventCode" :event-type="row?.event?.eventType" />
												</template>
											</UTable>
										</template>
										<template #default="{ item, index, open }">
											<UButton
												color="gray"
												variant="outline"
												class="mb-1.5 flex w-full focus-visible:ring-0 focus-visible:outline-none rounded-xl dark:bg-dark-0 dark:hover:bg-dark-0 h-12"
												:ui="{
													rounded: 'rounded-lg',
													padding: { sm: 'p-3' },
													variant: { outline: 'ring-purple/[.5] dark:ring-dark-icon-0/[.5] dark:!bg-dark-icon-0/[.04] bg-purple/[.04] dark:text-dark-icon-0 text-purple' }
												}"
											>
												<template #leading>
													<ChevronRightIcon class="w-5 ml-0 transform transition-transform duration-200" :class="[open && 'rotate-90']" />
												</template>
												<span class="truncate uppercase font-semibold">{{ index + 1 }}. {{ item.label }}</span>
											</UButton>
										</template>
									</UAccordion>
								</div>
							</div>
						</transition>
					</div>
					<div class="col-span-4 flex gap-y-1.5 flex-col">
						<div class="card">
							<div class="w-fit mx-auto my-2 flex gap-x-12">
								<div class="space-y-1 text-center">
									<h6 class="text-sm font-semibold">Break</h6>
									<p class="font-bold text-purple">{{ convertSecondsToHours(boostTimeRemainder?.breakDuration, ':', '') }}</p>
								</div>
								<div class="space-y-1 text-center">
									<h6 class="text-sm font-semibold">Drive</h6>
									<p class="font-bold text-purple">{{ convertSecondsToHours(boostTimeRemainder?.drivingDuration, ':', '') }}</p>
								</div>
								<div class="space-y-1 text-center">
									<h6 class="text-sm font-semibold">Shift</h6>
									<p class="font-bold text-purple">{{ convertSecondsToHours(boostTimeRemainder?.shiftDuration, ':', '') }}</p>
								</div>
								<div class="space-y-1 text-center">
									<h6 class="text-sm font-semibold">Cycle</h6>
									<p class="font-bold text-purple">{{ convertSecondsToHours(boostTimeRemainder?.cycleDuration, ':', '') }}</p>
								</div>
							</div>
						</div>
						<div class="card flex flex-col gap-y-2 flex-1">
							<div class="flex-1 overflow-hidden" ref="chatParent">
								<div ref="chat" :style="{ height: `${chatHeight}px` }" class="overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar-thumb]:hidden scroll-smooth">
									<transition-group name="chat" tag="div" class="flex flex-col gap-y-1">
										<div
											v-for="chat in chatText"
											:key="chat.id"
											:class="
												chat.type === 'system'
													? 'bg-background-grey_3 self-start dark:border dark:border-white/[.1]  dark:bg-white/[0.1]'
													: 'bg-purple dark:bg-purple/[.6] self-end'
											"
											class="relative py-2 px-4 rounded-xl w-fit min-w-0 max-w-[24rem]"
										>
											<p
												v-if="!chat.loading"
												:class="chat.type === 'system' ? '' : 'text-white'"
												style="unicode-bidi: plaintext; word-break: break-word"
												class="w-fit whitespace-pre-wrap text-sm font-medium dark:text-white/[0.8]"
											>
												{{ chat.text }}
												<span
													:class="chat.type === 'system' ? '' : 'text-white'"
													class="dark:text-white/[0.6] text-black text-[11px] inline-block shrink-0 translate-x-2 translate-y-2 float-right"
													>{{ chat.time }}</span
												>
											</p>
											<div v-else class="w-[50px] relative text-sm">
												&nbsp;
												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>
												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>
												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>
											</div>
										</div>
									</transition-group>
								</div>
							</div>
							<div class="space-y-2">
								<div class="flex gap-2 flex-wrap">
									<UButton
										@click="chatEvents(text)"
										:disabled="chatDisabled || isSubmitted || chatPermanentlyDisabled"
										size="xs"
										variant="solid"
										v-for="text in ['New shift', 'New break', 'Optimize', 'Add PTI', 'Adjust hours']"
										:label="text"
										class="dark:bg-purple/[.6] dark:text-white/[0.8]"
									/>
								</div>
								<div class="flex gap-x-2">
									<UInput
										ref="aiInput"
										autofocus
										:disabled="chatDisabled || isSubmitted || chatPermanentlyDisabled"
										name="chatInput"
										class="grow"
										size="xl"
										placeholder="Message..."
										v-model.trim="chatInput"
										:ui="{
											rounded: 'rounded-lg',
											padding: {
												xl: 'px-4 py-2'
											},
											placeholder: 'placeholder-black-0/[.4] placeholder:text-sm',
											color: {
												white: {
													outline: 'shadow-none bg-black-0/[.04] ring-1 ring-inset ring-grey-border focus:ring-2 focus:ring-primary-800'
												}
											},
											icon: {
												trailing: {
													pointer: 'pointer-events-auto'
												}
											}
										}"
									/>
									<UButton
										:disabled="chatDisabled || isSubmitted || chatPermanentlyDisabled"
										@click="submitChatText"
										size="lg"
										variant="solid"
										icon="i-heroicons-paper-airplane"
										class="dark:bg-white/[0.1] dark:hover:bg-white/[0.2]"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</transition>
	</main>
</template>

<script setup>
// importing icons
import ChevronLeftIcon from 'assets/icons/chevron-left.svg';
import ArrowNarrowDownIcon from '~/assets/icons/arrow-narrow-down.svg';
import ArrowRightIcon from '~/assets/icons/arrow-right.svg';
import CalendarIcon from '~/assets/icons/calendar.svg';
import ChevronRightIcon from '~/assets/icons/chevron-right.svg';
import FilePlus from '~/assets/icons/file-plus-2.svg';
import PencilIcon from '~/assets/icons/pencil-line.svg';
import ToolIcon from '~/assets/icons/tool-02.svg';
import TrashIcon from '~/assets/icons/trash-03.svg';

// import dayjs
import dayjs from 'dayjs';

// router
const route = useRoute();

// importing helpers
import { convertSecondsToHours } from '~/helpers/time';

// importing composable
import { useLogsAiComposable } from '~/composables/pages/logs/id/ai';

const {
	isFinished,
	loadAiActions,
	isSubmitted,
	submitAI,
	submitLoading,
	chatParent,
	chart,
	aiInput,
	drivers,
	selectedDriver,
	headerDate,
	selectedTab,
	chatText,
	chatInput,
	chat,
	chatEvents,
	submitChatText,
	columns,
	reportsHeader,
	reportsList,
	boostSummaries,
	boostTimeRemainder,
	boostGraph,
	updateChartWidth,
	tabs,
	updateSelectedTab,
	chatDisabled,
	chatPermanentlyDisabled,
	selectEvent,
	aiMovedTimes,
	chatHeight,
	pieChartOptions,
	pieChartSeries
} = await useLogsAiComposable();
</script>

<style scoped>
.circle {
	width: 10px;
	left: 0%;
	height: 10px;
	position: absolute;
	border-radius: 50%;
	animation: circle 0.4s alternate infinite ease;
}

@keyframes circle {
	0% {
		top: 15px;
		height: 5px;
		border-radius: 50px 50px 25px 25px;
		transform: scaleX(1.7);
	}
	40% {
		height: 10px;
		border-radius: 50%;
		transform: scaleX(1);
	}
	100% {
		top: 0%;
	}
}
.circle:nth-child(2) {
	left: 40%;
	animation-delay: 0.2s;
}
.circle:nth-child(3) {
	left: 80%;
	animation-delay: 0.3s;
}
</style>
