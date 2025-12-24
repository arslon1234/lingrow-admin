<template>
    <main>
        <AudioUpload v-model="statusModal" @upload="handleFileUpload" :loading="audioUpload" />
        <section class="card flex justify-between items-center sticky top-0 z-10">
            <h1 class="title">{{ skillType }} Material Questions</h1>
            <div class="flex items-center gap-3">
                <UButton variant="solid" size="sm" label="Upload Audio" @click="statusModal = true" />
                <!-- <UInput class="min-w-[264px]" v-model="search" :ui="{
					base: 'placeholder:font-medium',
					rounded: 'rounded-lg',
					color: { white: { outline: 'shadow-none ring-grey-border' } }
				}" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="lg" placeholder="Search listening" /> -->
            </div>
        </section>
        <section class="main-layout mt-4 flex flex-col gap-4">
            <QuestionComposer />
            <div class="w-full grid grid-cols-12 gap-4">
                <QuestionComponents class="col-span-3" />
                <QuestionLayout class="col-span-9" />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import AudioUpload from '~/components/modal/AudioUpload.vue';
import QuestionComposer from '~/components/listening/QuestionComposer.vue';
import QuestionComponents from '~/components/listening/QuestionComponents.vue';
import QuestionLayout from '~/components/listening/QuestionLayout.vue';
import MaterialQuestionForm from '~/components/material/MaterualQuestionForm.vue'
import { useListeningComposable } from '~/composables/materials/listening';

const { audioUpload, statusModal, handleFileUpload } = await useListeningComposable()

const route = useRoute()

const { skillType, materialType } = route.query

</script>