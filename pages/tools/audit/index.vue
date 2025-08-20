<template>
	<main>
		<section class="card flex items-center justify-between">
			<h1 class="title">Audit</h1>
			<UButton size="sm" :disabled="!auditFormAll.driverId || !auditId" :to="`/tools/audit/${auditFormAll.driverId}/${auditId}`" label="Start process" />
		</section>
		<section class="mt-3 card flex items-center justify-between">
			<div class="flex items-center gap-x-3">
				<UButton
					class="h-10 w-10"
					@click="selectedTrip = auditTrip"
					v-for="(auditTrip, ind) in auditFormAll.trips"
					:key="ind"
					:label="`${ind + 1}`"
					variant="solid"
					:class="[selectedTrip === auditTrip && 'border-dashed border-purple border-2']"
					:ui="{
						variant: { solid: 'bg-purple/[.4] dark:bg-purple/[.4] dark:text-purple hover:bg-purple/[.5] dark:hover:bg-purple/[.5] text-purple text-sm items-center justify-center' }
					}"
				/>
				<UButton class="h-10 w-10" @click="addTrip" variant="solid" :ui="{ variant: { solid: 'disabled:bg-purple/[.4] justify-center items-center dark:opacity-20' } }">
					<template #leading>
						<PlusIcon class="text-white" />
					</template>
				</UButton>
			</div>
			<div class="flex items-center gap-x-2.5">
				<UButton
					size="sm"
					label="Cancel"
					variant="solid"
					:ui="{ variant: { solid: 'bg-grey-2 hover:bg-grey-1 disabled:bg-grey-2 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.5] dark:disabled:bg-dark-button-0' } }"
				/>
				<UButton @click="addAudit" :loading="loading" size="sm" label="Save" />
			</div>
		</section>
		<section v-for="(trip, ind) in auditFormAll.trips" class="mt-3">
			<keep-alive>
				<AuditForm
					v-if="selectedTrip === trip"
					:order="ind + 1"
					:key="ind"
					@trip:update="updateTrip($event, ind)"
					@constantas:update="updateConstantas"
					:constantas="{
						carrierId: auditFormAll.carrierId,
						driverId: auditFormAll.driverId,
						time: auditFormAll.startTime,
						date: auditFormAll.startDate,
						odometer: auditFormAll.trips[0].odometer || 0,
						engineHours: auditFormAll.trips[0].engineHours || 0,
						distance: auditFormAll.trips[0].dailyDistanceInMile || 0
					}"
				/>
			</keep-alive>
		</section>
	</main>
</template>

<script setup>
// importing icons
import PlusIcon from '~/assets/icons/plus.svg';

// importing composables
import { useToolsAudit } from '~/composables/pages/tools/audit/index';
const { loading, selectedTrip, auditFormAll, addTrip, updateTrip, updateConstantas, addAudit, auditId } = await useToolsAudit();
</script>
