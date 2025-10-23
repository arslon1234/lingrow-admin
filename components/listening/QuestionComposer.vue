<template>
    <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">IELTS Question Composer</h1>

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Question Type</label>
                    <USelect v-model="questionType" :options="IELTS_LISTENING_QUESTION_TYPES" option-attribute="name"
                        value-attribute="key" placeholder="Select question type" size="xl" class="w-wull"
                        @change="handleChange" />
                </div>

                <div className="flex gap-2 items-end">
                    <button @click="previewMode = !previewMode"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                        <Eye size={18} />
                        {{ previewMode ? 'Edit' : 'Preview' }}
                    </button>
                    <button @click="saveQuestion"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
                        <Save size={18} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useListeningStore } from '~/store/listening'
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