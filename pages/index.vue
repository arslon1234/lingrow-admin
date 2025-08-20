<template>
	<div>
        <slot/>
    </div>
</template>

<script setup>


// importing composable
import { useOverview } from '~/composables/pages/overview';
const {
	// header search
	search,

} = await useOverview();
</script>
