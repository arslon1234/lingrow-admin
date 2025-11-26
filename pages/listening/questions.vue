<template>
    <main>
        <section class="card flex justify-between items-center sticky top-0 z-10">
            <h1 class="title">Listening Questions</h1>
            <div class="flex items-center gap-3">
                <UInput class="min-w-[264px]" :ui="{
                    base: 'placeholder:font-medium',
                    rounded: 'rounded-lg',
                    color: { white: { outline: 'shadow-none ring-grey-border' } }
                }" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="lg"
                    placeholder="Search listening questions" />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped></style>