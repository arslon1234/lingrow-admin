<template>
    <section class="card flex justify-between items-center sticky top-0 z-10">
        <h1 class="title">Lingrow Materials</h1>
        <div class="flex items-center gap-2">
            <div v-for="skillType in SkillTypes" :key="skillType.value">
                <UButton @click="updateSkillType(skillType.value)" size="md" color="primary">{{ skillType.label }}
                </UButton>
            </div>
        </div>
        <UButton @click="openCreateModal" icon="i-heroicons-plus" size="md" color="primary"> Create Book
        </UButton>
    </section>
</template>

<script setup lang="ts">
import { SkillTypes } from '~/helpers/constants';
const router = useRouter();
const route = useRoute();
const { setQueries, getQueryParams } = useQueryParams(route, router);
const emits = defineEmits < {
  (e: 'open'): void
    (e: 'updateSkillType', value: string): void
}> ()
const skillType = ref(getQueryParams('skillType') || 'LISTENING')

const openCreateModal = () => {
    emits('open')
}
const updateSkillType = (value: string) => {
    emits('updateSkillType', value)
}
</script>

<style lang="scss" scoped></style>