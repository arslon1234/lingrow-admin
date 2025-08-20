<template>
	<UPopover :ui="{wrapper: 'h-auto', container: 'z-10', arrow: {background: 'before:bg-white dark:before:bg-white/[.1]'}}" :popper="{ placement: position, arrow }">
		<slot></slot>
		<template #panel="{ close }">
      <div class="space-y-2 p-1 w-28 dark:bg-white/[0.1]">
        <p class="text-center text-xs text-black dark:text-white">Are you sure?</p>
        <div class="flex justify-end gap-x-1 items-center">
          <UButton @click.capture.stop="close" class="text-[9px] leading-none rounded-md bg-grey-2 hover:bg-grey-1 px-1.5 py-1 font-extralight dark:bg-dark-button-0 dark:hover:bg-white/[0.1]">No</UButton>
          <UButton @click.capture.stop="emits('confirm', true); close()" class="text-[9px] leading-none rounded-md px-1.5 py-1 font-extralight">Yes</UButton>
        </div>
      </div>
    </template>
	</UPopover>
</template>

<script setup>
// props
const props = defineProps({
  position: {
    type: String,
    default: 'top'
  },
  arrow: {
    type: Boolean,
    default: false
  }
});

// emits
const emits = defineEmits(['confirm'])
</script>
