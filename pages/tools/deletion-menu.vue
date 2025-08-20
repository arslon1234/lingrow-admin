<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Deletion Menu</h1>
			<div class="flex items-center gap-x-3">
				<UButton size="sm" variant="solid" label="Sync" />
			</div>
		</section>
		<section class="table_config flex flex-col gap-y-5 justify-between h-[calc(100dvh-96px)]">
			<UTable class="flex-1" :ui="{td: {padding: 'py-2'}, base: rows.length ? 'h-auto' : 'h-full'}" :columns="columns" :rows="rows">
				<template #driver-data="{ row }">
					<USelectMenu
						size="md"
						@change="assignDriver($event, row.id)"
						searchable
						searchable-placeholder="Search a Driver..."
						placeholder="Select Driver"
            option-attribute="fullname"
            value-attribute="id"
            :model-value="row.testDriverId"
						:options="row.drivers.map((driver) => ({fullname: `${driver.firstName} ${driver.lastName}`, id: driver.driverId}))"
						:ui="{ wrapper: 'min-w-48 w-fit'}"
					/>
				</template>
			</UTable>
			<UPagination
				:first-button="{ icon: 'i-heroicons-chevron-double-left-20-solid', color: 'gray' }"
				:last-button="{ icon: 'i-heroicons-chevron-double-right-20-solid', trailing: true, color: 'gray' }"
				:page-count="pageSize"
				:total="deletionMenuCarriersTotal"
				v-model="currentPage"
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
// importing composables
import { useDeletionMenu } from '~/composables/pages/tools/deletion-menu';

const { loading, columns, rows, deletionMenuCarriersTotal, currentPage, pageSize, assignDriver } = await useDeletionMenu();
</script>
