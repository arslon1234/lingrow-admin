<template>
    <div className="w-full mx-auto sticky top-12 z-10">
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">{{ capitalizeStrict(materialType) }} Question Composer</h1>
            <UForm :state="formState" @submit="onSubmit">
                <!-- Grid layout based on materialType -->
                <div :class="materialType === 'MOCK' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4'">
                    <!-- Section Number / Title based on materialType -->
                    <UFormGroup v-if="materialType === 'MOCK'" label="Section" name="section" required>
                        <USelect v-model="selectedSection" :options="sectionOptions" size="lg"
                            placeholder="Select section" />
                    </UFormGroup>

                    <UFormGroup v-else label="Title" name="title" required>
                        <UInput v-model="formState.title" placeholder="Enter title" size="lg" />
                    </UFormGroup>

                    <!-- Section Number Input for PRACTICE -->
                    <UFormGroup v-if="materialType === 'PRACTICE'" label="Section Number" name="sectionNumber" required>
                        <UInput v-model.number="formState.sectionNumber" size="lg" type="number"
                            placeholder="Enter section number" />
                    </UFormGroup>

                    <!-- Level -->
                    <UFormGroup label="Level" name="level" required size="lg">
                        <USelect v-model="formState.level" :options="levelOptions" placeholder="Select level" />
                    </UFormGroup>
                </div>

                <!-- Submit Button -->
                <!-- <div class="flex justify-end">
                <UButton type="submit" color="primary">
                    Submit
                </UButton>
            </div> -->
            </UForm>
            <div className="flex gap-4 mt-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Question Type</label>
                    <USelect v-model="questionType" :options="IELTS_LISTENING_QUESTION_TYPES" option-attribute="name"
                        value-attribute="key" placeholder="Select question type" size="lg" class="w-wull"
                        @change="handleChange" />
                </div>

                <div className="flex gap-2 items-end">
                    <UButton variant="solid" size="lg" @click="previewMode = !previewMode">
                        <preview-icon v-if="previewMode" />
                        <edit-icon v-else />
                        {{ previewMode ? 'Edit' : 'Preview' }}
                    </UButton>

                    <UButton variant="solid" class="bg-green-3 hover:bg-green-700" size="lg" @click="saveQuestion">
                        <save-icon />
                        Save
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useListeningStore } from '~/store/listening'
import EditIcon from '~/components/icons/EditIcon.vue'
import PreviewIcon from '~/components/icons/PreviewIcon.vue'
import SaveIcon from '~/components/icons/SaveIcon.vue'
const listeningStore = useListeningStore()

const route = useRoute()

const materialType = computed(() => route.query.materialType as string || 'MOCK')

interface FormState {
    sectionNumber: number
    level: string
    title: string
}

const formState = ref<FormState>({
    sectionNumber: 1,
    level: '',
    title: ''
})

const selectedSection = ref('')

// Section options for MOCK type
const sectionOptions = [
    { label: 'Section 1', value: '1' },
    { label: 'Section 2', value: '2' },
    { label: 'Section 3', value: '3' },
    { label: 'Section 4', value: '4' }
]

// Level options
const levelOptions = [
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Difficult', value: 'DIFFICULT' }
]

// Watch selected section and update form state (only for MOCK)
watch(selectedSection, (newValue) => {
    if (newValue && materialType.value === 'MOCK') {
        formState.value.title = `Section ${newValue}`
        formState.value.sectionNumber = parseInt(newValue)
    }
})

// Watch materialType to reset form
watch(materialType, () => {
    formState.value = {
        sectionNumber: 1,
        level: '',
        title: ''
    }
    selectedSection.value = ''
})

const onSubmit = () => {
    console.log('Form submitted:', formState.value)
    // Emit event or handle submission
}

const { previewMode, components, questionType } = storeToRefs(listeningStore)

const saveQuestion = () => {
    const questionData: QuestionData = {
        questionType: questionType.value,
        components: components.value,
        metadata: {
            totalComponents: components.value.length,
            createdAt: new Date().toISOString()
        }
    }

    console.log('Question Data:', questionData)
}
const handleChange = (event: any) => {
    console.log(event)
}

</script>

<style lang="scss" scoped></style>