<template>
	<div>
		<TheSidebar @sidebarToggle="slotToggle" />
		<div :style="{maxWidth: `calc(100% - ${toggleWidth}px)`}" class="ml-auto px-1.5 duration-300">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { useIndex } from '~/store';
const {sidebar} = storeToRefs(useIndex());

const toggleWidth = ref(sidebar.value === 'open' ? 246 : 76);

const slotToggle = (val) => {
	if (val) {
		toggleWidth.value = 246
	} else {
		toggleWidth.value = 76
	}
}
</script>
