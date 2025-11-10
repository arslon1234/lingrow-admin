<template>
    <div className="w-full mx-auto sticky top-12 z-10">
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">IELTS Question Composer</h1>

            <div className="flex gap-4 mb-6">
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