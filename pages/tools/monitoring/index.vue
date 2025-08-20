<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Monitoring</h1>
			<div class="flex items-center gap-x-3">
				<USelectMenu
					size="md"
					v-model="selectedCarrier"
					placeholder="Carrier search"
					searchable
					searchable-placeholder="Search a carrier..."
					value-attribute="id"
					option-attribute="name"
					:options="[{name: 'All Carriers', id: 'all'}, ...(carriers || [])]"
					:ui="{ wrapper: 'w-44', rounded: 'rounded-lg', padding: { md: 'py-1.5' }, color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black' } } }"
				/>
				<UButton size="sm" variant="outline" label="00:53:23" v-if="selectedCompany" />
				<UButton size="sm" variant="solid" label="Sync" v-else />
			</div>
		</section>
		<section class="card flex justify-between items-center mt-3 gap-x-7">
			<UProgress size="xl" :indicator="false" :value="progressBarValue" :max="progressBarMax" />
			<div class="flex justify-center items-center flex-nowrap">
				<span class="text-grey-1 mr-1">{{ progressBarMax }} </span>/
				<span class="ml-1"> {{ progressBarValue }}</span>
			</div>
		</section>
		<transition name="fade" mode="out-in">
			<section v-if="monitorings.length" class="grid grid-cols-4 items-start gap-x-3">
				<div class="col-span-4 mt-3">
					<UAccordion :items="monitorings" variant="solid" size="xl" :ui="{ wrapper: 'w-full flex flex-col', item: { padding: 'pb-1.5 pt-0'}}">
						<template #item="{ item }">
							<UTable
								v-model:expand="expand"
								:rows="item.drivers"
								:columns="columns"
								:ui="{
									strategy: 'override',
									wrapper: 'w-full bg-white dark:bg-dark-0 rounded-xl',
									divide: 'divide-y divide-grey-border dark:divide-white/[.1]',
									tbody: '[&>tr:first-child>td]:pt-5 [&>tr:last-child>td]:pb-5',
									tr: {base: 'relative group'},
									td: {base: '!font-medium'}
								}"
							>
								<template #expand="{ row }">
									<div class="px-2 my-1">
										<UTable
											:rows="row.records"
											:columns="columnsInner"
											:ui="{
												strategy: 'override',
												wrapper: 'rounded-xl bg-purple/[.05] dark:bg-white/[.04] border border-purple/[.1] overflow-hidden dark:border-white/[0.1]',
												tbody: 'divide-y divide-grey-border dark:divide-white/[0.1]',
												divide: 'divide-y divide-grey-border dark:divide-white/[0.1]',
												th: { padding: 'py-1.5 px-4' },
												td: { padding: 'py-2 px-4 bg-white dark:bg-dark-0 !font-medium' },
											}"
										>
											<template #driven-data="{ row }">
												<UButton block :ui="{variant: {outline: 'ring-grey-border dark:ring-white/[.1] text-black dark:text-white/[.8] hover:bg-transparent dark:hover:bg-transparent'}}" variant="outline" size="xs" :label="formatDuration(row.driven) || '&nbsp'" />
											</template>
											<template #duty-data="{ row }">
												<UButton block :ui="{variant: {outline: 'ring-grey-border dark:ring-white/[.1] dark:text-white/[.8] dark:hover:bg-transparent text-black hover:bg-transparent'}}" variant="outline" size="xs" :label="formatDuration(row.duty) || '&nbsp'" />
											</template>
											<template #profile-data="{ row }">
												<UBadge
													v-if="row.profile"
													variant="outline"
													size="sm"
													class="w-full flex justify-center"
													:ui="{ variant: { outline: 'ring-purple/[.2] bg-purple/[.1] dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
													>YES</UBadge
												>
												<UBadge
													v-else
													variant="outline"
													size="sm"
													class="w-full flex justify-center"
													:ui="{ variant: { outline: 'ring-red-1/[.2] bg-red-1/[.1] dark:ring-red-0/[.2] dark:bg-red-0/[.1] dark:text-red-0 text-red-1 uppercase' } }"
													>NO</UBadge
												>
											</template>
											<template #violation-data="{ row }">
												<UBadge
													v-if="row.violation"
													class="w-full flex justify-center"
													variant="outline"
													size="sm"
													:ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] bg-purple/[.1] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
													>YES</UBadge
												>
												<UBadge
													v-else
													variant="outline"
													size="sm"
													class="w-full flex justify-center"
													:ui="{ variant: { outline: 'ring-red-1/[.2] dark:ring-red-0/[.2] bg-red-1/[.1] dark:bg-red-0/[.1] text-red-1 dark:text-red-0 uppercase' } }"
													>NO</UBadge
												>
											</template>
											<template #certification-data="{ row }">
												<UBadge
													v-if="row.certification"
													variant="outline"
													size="sm"
													class="w-full flex justify-center"
													:ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] bg-purple/[.1] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
													>YES</UBadge
												>
												<UBadge
													v-else
													variant="outline"
													size="sm"
													class="w-full flex justify-center"
													:ui="{ variant: { outline: 'ring-red-1/[.2] dark:ring-red-0/[.2] bg-red-1/[.1] dark:bg-red-0/[.1] text-red-1 dark:text-red-0 uppercase' } }"
													>NO</UBadge
												>
											</template>
										</UTable>
									</div>
								</template>
								<template #event-data="{ row }">
									<TheEvent size="md" :event-code="row.event.eventCode" :event-type="row.event.eventType" />
								</template>
								<template #violated-data="{ row }">
									<UBadge
										v-if="row.violated"
										variant="outline"
										size="sm"
										class="w-full flex justify-center"
										:ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] bg-purple/[.1] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
									>YES</UBadge
									>
									<UBadge
										v-else
										variant="outline"
										size="sm"
										class="w-full flex justify-center"
										:ui="{ variant: { outline: 'ring-red-1/[.2] dark:ring-red-0/[.2] bg-red-1/[.1] dark:bg-red-0/[.1] text-red-1 dark:text-red-0 uppercase' } }"
									>NO</UBadge
									>
								</template>
								<template #certified-data="{ row }">
									<UBadge
										v-if="row.certified"
										variant="outline"
										size="sm"
										class="w-full flex justify-center"
										:ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] bg-purple/[.1] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 text-purple uppercase' } }"
										>YES</UBadge
									>
									<UBadge
										v-else
										variant="outline"
										size="sm"
										class="w-full flex justify-center"
										:ui="{ variant: { outline: 'ring-red-1/[.2] dark:ring-red-0/[.2] bg-red-1/[.1] dark:bg-red-0/[.1] text-red-1 dark:text-red-0 uppercase' } }"
										>NO</UBadge
									>
								</template>
								<template #action-data="{ row }">
									<div class="absolute left-2 top-1 group-first:top-2 w-[calc(100%-16px)] group-only:h-[calc(100%-16px)] group-first:h-[calc(100%-12px)] group-last:h-[calc(100%-12px)] h-[calc(100%-8px)] pointer-events-none rounded-xl bg-purple/[.04] dark:bg-white/[.04] border border-purple/[.1] dark:border-white/[.1]"></div>
									<div class="flex gap-x-2.5 items-center">
										<UButton size="sm" variant="soft" :ui="{ variant: { soft: 'bg-purple/[.2] dark:bg-dark-icon-0/[.2] dark:hover:dark:bg-dark-icon-0/[.4] hover:bg-purple/[.4]' } }">
											<template #leading>
												<StarsIcon class="text-purple dark:text-dark-icon-0 h-4 w-4" />
											</template>
										</UButton>
										<UButton size="sm" variant="soft" :ui="{ variant: { soft: 'bg-purple/[.2] dark:bg-dark-icon-0/[.2] dark:hover:dark:bg-dark-icon-0/[.4] hover:bg-purple/[.4]' } }">
											<template #leading>
												<LineIcon class="text-purple dark:text-dark-icon-0 h-4 w-4" />
											</template>
										</UButton>
									</div>
								</template>
							</UTable>
						</template>
						<template #default="{ item, index, open }">
							<UButton
								color="gray"
								variant="ghost"
								class="mb-1.5 flex w-full focus-visible:ring-0 focus-visible:outline-none rounded-xl bg-white dark:bg-dark-0 hover:bg-white dark:hover:bg-dark-0 h-12"
								:ui="{ rounded: 'rounded-lg', padding: { sm: 'p-3' } }"
							>
								<template #leading>
									<UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 ml-0 transform transition-transform duration-200" :class="[open && 'rotate-90']" />
								</template>
								<span class="truncate">{{ index + 1 }}. {{ item.label }}</span>
								<template #trailing>
									<UBadge variant="outline" size="sm" class="ms-auto" :ui="{ variant: { outline: 'ring-green-2/[.2] dark:ring-green-1/[.2] dark:bg-green-1/[.1] dark:text-green-1 bg-green-2/[.1] text-green-2 uppercase' } }">CLEAR</UBadge>
									<UBadge variant="outline" size="sm" :ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 bg-purple/[.1] text-purple uppercase' } }">CT</UBadge>
									<UBadge @click.capture.stop="navigateTo(`/tools/monitoring/${item.id}`)" variant="outline" size="sm" :ui="{ variant: { outline: 'ring-purple/[.2] dark:ring-dark-icon-0/[.2] dark:bg-dark-icon-0/[.1] dark:text-dark-icon-0 bg-purple/[.1] text-purple uppercase' } }">
										AI ANALYZE
										<ArrowRightDoubleIcon class="text-purple dark:text-dark-icon-0 w-4 ml-1" />
									</UBadge>
								</template>
							</UButton>
						</template>
					</UAccordion>
				</div>
			</section>
		</transition>
	</main>
</template>

<script setup>
// importing icons
import StarsIcon from '~/assets/icons/stars-02.svg';
import LineIcon from '~/assets/icons/line-chart-up-01.svg';
import ArrowRightDoubleIcon from '~/assets/icons/arrow-right-double.svg';

// importing composables
import { useToolsMonitoring } from '~/composables/pages/tools/monitoring/index.ts';
const { selectedCarrier, carriers, monitorings, columns, expand, columnsInner, progressBarValue, progressBarMax } = await useToolsMonitoring();
</script>
