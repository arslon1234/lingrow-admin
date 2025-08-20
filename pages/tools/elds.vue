<template>
	<main>
		<UModal v-model="createDotModal" :ui="{ base: 'sm:!max-w-[420px]' }">
			<div class="w-full p-6 space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="title">Eld management</h2>
					<UButton color="gray" :ui="{ rounded: 'rounded-full' }" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						class="-my-1" @click="createDotModal = false" />
				</div>
				<UDivider />
				<UForm :state="dotForms">
					<div class="w-full space-y-6">
						<!-- <UFormGroup v-slot="{ error }" name="project_44">
							<UButton variant="outline" size="lg"
								:ui="{ variant: { outline: ' w-full flex justify-between bg-black-0/[.04] text-black-1 ring-purple/[.1] hover:bg-purple/[.05] dark:bg-white/[0.1] dark:hover:bg-white/[0.05]' } }"
								@click="dotForm.applyToAllELDs = !dotForm.applyToAllELDs">
								<template #default>
									Set Firmware for ALL ELDs
								</template>
								<template #trailing>
									<UCheckbox v-model="dotForm.applyToAllELDs" :ui="{ background: 'bg-transparent' }" />
								</template>
							</UButton>
						</UFormGroup> -->
						<UFormGroup v-slot="{ error }" label="Driver" name="id">
							<USelectMenu size="lg" searchable searchable-placeholder="Search firmware version..."
								v-model="dotForms.eldFileId" placeholder="Select Firmware Version"
								:ui="{ color: { white: { outline: 'ring-grey-border shadow-none font-medium text-black tracking-wide bg-black-0/[.04]' } } }"
								:options="eldFiles" option-attribute="versionLevel" value-attribute="id"/>
						</UFormGroup>
					</div>
					<div class="space-y-6 mt-6">
						<UDivider />
						<div class="flex items-center justify-end gap-x-3">
							<UButton :loading="updateBtnloading" @click="updateFirmWare()"
								class="w-36 justify-center" size="xl" label="Save Firmware" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-purple hover:bg-purple-1' } }" />
							<UButton type="submit" class="w-36 justify-center" size="xl" label="Edit ELD" variant="solid"
								:ui="{ rounded: 'rounded-lg', variant: { solid: 'bg-red-1 hover:bg-red-0' } }" />
						</div>
					</div>
				</UForm>
			</div>
		</UModal>
		<section class="card flex justify-between items-center">
			<h1 class="title text-lg">ELDs</h1>
			<div class="flex items-center gap-x-3">
				<UTabs v-model="selectedTab" :items="[{ label: 'In active' }, { label: 'active' }, { label: 'All' }]"
					:ui="{ list: { tab: { padding: 'py-1.5' } } }" />
			</div>
		</section>
		<section class="table_config">
			<UTable :columns="columns" :rows="rows" @select="tableRowSelect">
				<template #status-data="{ row }">
					<UBadge v-if="row.status" size="sm" variant="soft"
						:ui="{ variant: { soft: 'bg-purple/[.15] text-purple ring-1 ring-purple' } }"> Active </UBadge>
					<UBadge v-else size="sm" variant="soft"
						:ui="{ variant: { soft: 'bg-grey-2/[.2] text-grey-0 ring-1 ring-grey-2/[.5]' } }"> In active </UBadge>
				</template>
			</UTable>
			<UPagination v-if="eldsTotalCount > pageSize" class="mt-5"
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:page-count="pageSize" :total="eldsTotalCount" v-model="selectedNavigation" show-first show-last :ui="{
					wrapper: 'mx-auto'
				}
					" />
		</section>
	</main>
</template>

<script setup>
// importing composables
import { useToolsDot } from '~/composables/pages/tools/elds';

const { updateFirmWare, selectedTab, createDotModal, dotForm, dotForms, updateBtnloading, updateBtnDisabled, validateDot, selectedNavigation, pageSize, eldsTotalCount, columns, tableRowSelect, rows, eldFiles } = await useToolsDot();
</script>
