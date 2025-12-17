<template>
	<div>
		<NuxtLoadingIndicator :height="4" />
		<UNotifications />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">

useHead({
	title: "Lingrow admin"
})
</script>
