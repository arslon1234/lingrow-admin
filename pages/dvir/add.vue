<template>
  <main>
    <section class="card flex justify-between items-center">
      <h1 class="title text-lg">DVIR Inspection</h1>
      <div class="flex items-center gap-x-3">
        <UButton @click="navigateTo('/dvir')" size="sm" variant="solid" label="Cancel"
          :ui="{ variant: { solid: 'bg-grey-2 hover:bg-grey-1 dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[.5]' } }" />
        <UButton :disabled="isAddDvirDisabled || loading" :loading="loading" @click="submitFormDvir" size="sm" variant="solid" label="Save" />
      </div>
    </section>
    <section class="mt-3 card">
      <DvirForm @mergeFormDvir="mergeFormDvir" v-model:isDvirDisabled="isAddDvirDisabled" />
    </section>
  </main>
</template>

<script setup>
// importing composable
import { useDvirAdd } from '~/composables/pages/dvir/add';

const { formDvir, isAddDvirDisabled, loading,  mergeFormDvir, submitFormDvir } = await useDvirAdd();
</script>