<template>
    <section class="card flex justify-between items-center sticky top-0 z-10">
        <h1 class="title">Lingrow Materials</h1>
        <div class="flex items-center gap-2">
            <div v-for="item in SkillTypes" :key="item.value">
                <UButton @click="updateSkillType(item.value)" size="md" :color="skillType === item.value ? 'primary' : 'gray'">{{ item.label }}
                </UButton>
            </div>
        </div>
        <UButton @click="openCreateModal" icon="i-heroicons-plus" size="md" color="primary"> Create Material
        </UButton>
    </section>
</template>

<script setup lang="ts">
import { SkillTypes } from '~/helpers/constants';
const router = useRouter();
const route = useRoute();
defineProps({
    skillType: {
        type: String
    }
})

const emits = defineEmits<{
    (e: 'open'): void
    (e: 'updateSkillType', value: string): void
}>()

const openCreateModal = () => {
    emits('open')
}
const updateSkillType = (value: string) => {
    emits('updateSkillType', value)
}
</script>

<style lang="scss" scoped></style>