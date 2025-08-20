<template>
  <main>
    <section class="card flex justify-between items-center">
      <h1 class="title">Company</h1>
      <UButton @click="navigateTo('/carrier/edit')" size="lg" variant="solid" label="Edit" class="px-5 py-[5px]">
        <template #leading>
          <UIcon name="i-material-symbols:edit-outline" class="text-[1.25rem]" />
        </template>
      </UButton>
    </section>
    <section class="mt-1.5 grid grid-cols-1 gap-x-3">
      <div class="flex flex-col gap-1.5">
        <div class="card">
          <h2 class="title text-sm">GENERAL INFORMATION</h2>
          <div class="mt-3 border rounded-lg border-grey-border dark:border-white/[0.1]">
            <div class="px-6 py-3">
              <p class="information-type">Carrier ID</p>
              <p class="information-item">{{ carrier?.id || "Carrier ID" }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Carrier Name</p>
              <p class="information-item">{{ carrier?.name || "Carrier Name" }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">DOT number</p>
              <p class="information-item">{{ carrier?.usdotNumber }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Carrier Time Zone</p>
              <p class="information-item">{{ carrier?.timeZoneInfo?.id || "Carrier Time Zone" }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Carrier Address</p>
              <p class="information-item">{{ carrier?.street || "Carrier Address" }}</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="title text-sm">CARRIER SETTINGS</h2>
          <div class="mt-3 border rounded-lg border-grey-border dark:border-white/[0.1]">
<!--            <div class="px-6 py-3">-->
<!--              <p class="information-type">Compliance Mode</p>-->
<!--              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.restBreak.name || '&nbsp;' }}</p>-->
<!--            </div>-->
<!--            <UDivider />-->
<!--            <div class="px-6 py-3">-->
<!--              <p class="information-type">Vehicle Motion Threshold</p>-->
<!--              <p class="information-item">5 mi/h</p>-->
<!--            </div>-->
<!--            <UDivider />-->
            <div class="px-6 py-3">
              <p class="information-type">Cycle Rule</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.hosRule.name ?? 'N/A&nbsp;' }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Cargo Type</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.cargoType.name ?? 'N/A&nbsp;' }}</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Restart</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.restart.name ?? 'N/A&nbsp;' }}</p>
            </div>
            <div class="px-6 py-3">
              <p class="information-type">Short-Haul Exception</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.shortHaulException ? 'Permissible' : 'Forbidden' }}</p>
            </div>
            <div class="px-6 py-3">
              <p class="information-type">Personal Conveyance</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.allowPersonalUse ? 'Permissible' : 'Forbidden' }}</p>
            </div>
            <div class="px-6 py-3">
              <p class="information-type">Yard moves</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.allowYardMoves ? 'Permissible' : 'Forbidden' }}</p>
            </div>
            <div class="px-6 py-3">
              <p class="information-type">Exempt Driver</p>
              <p class="information-item">{{ carrier?.carrierDriverLogSetting?.exemptDriver ? 'Permissible' : 'Forbidden' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-y-1.5 mt-1.5 ">
        <div v-if="false" class="card">
          <h2 class="title">INTEGRATIONS</h2>
          <div class="mt-3 border rounded-lg border-grey-border dark:border-white/[0.1]">
            <div class="px-6 py-3">
              <p class="information-type">Project 44</p>
              <p class="information-item">Company:Qfn2-lIzGn</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">MacroPoint</p>
              <p class="information-item">ESTER CARGO INC</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">DOT number</p>
              <p class="information-item">2345952</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Company Time Zone</p>
              <p class="information-item">CT</p>
            </div>
            <UDivider />
            <div class="px-6 py-3">
              <p class="information-type">Company Address</p>
              <p class="information-item">3327 ROSECROFT LN, NAPERVILLE, IL, 60564</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1.5">
          <template v-if="carrier?.carrierTerminals?.length">
            <div v-for="(terminal, index) in carrier.carrierTerminals" :key="terminal.id" class="card">
              <h2 class="title text-sm">TERMINAL {{ index + 1 }}</h2>
              <div class="mt-3 border rounded-lg border-grey-border dark:border-white/[0.1] grid grid-cols-4 gap-x-3">
                <div class="px-6 py-3">
                  <p class="information-type">Terminal Address</p>
                  <p class="information-item">{{ terminal.city + ', ' + terminal.street || 'Not specified' }}</p>
                </div>
								<!-- <UDivider /> -->
								<div class="px-6 py-3">
									<p class="information-type">Zip Code</p>
									<p class="information-item">{{ terminal.zipCode || 'Not specified' }}</p>
								</div>
                <!-- <UDivider /> -->
                <div class="px-6 py-3">
                  <p class="information-type">Time Zone</p>
                  <p class="information-item">{{ terminal.timeZoneInfo.ianaId || 'Not specified' }}</p>
                </div>
                <!-- <UDivider /> -->
                <div class="px-6 py-3">
                  <p class="information-type">24 Hour Period Starting Time</p>
                  <p class="information-item">{{ carrier.carrierDriverLogSetting?.startingTime24HourPeriod || '000000' }}</p>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="card">
              <h2 class="title text-sm">TERMINAL 1</h2>
              <div class="mt-3 border rounded-lg border-grey-border dark:border-white/[0.1]">
                <div class="px-6 py-3">
                  <p class="information-type">Terminal Address</p>
                  <p class="information-item">Not specified</p>
                </div>
                <UDivider />
                <div class="px-6 py-3">
                  <p class="information-type">Time Zone</p>
                  <p class="information-item">Not specified</p>
                </div>
                <UDivider />
                <div class="px-6 py-3">
                  <p class="information-type">24 Hour Period Starting Time</p>
                  <p class="information-item">00:00:00</p>
                </div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
// import { useCompaniesStore } from "~/store/companies";
// const companyStore = useCompaniesStore();

import { useCarrier } from "~/composables/pages/carrier/index";
const { carrier } = await useCarrier();
</script>

<style scoped>
.information-type {
  color: #9295A1;
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
}

.information-item {
  color: #222222;
  font-size: 13px;
  line-height: 22px;
  font-weight: 600;
}
.dark .information-item {
  color: rgba(255, 255, 255, 0.8);
}
</style>