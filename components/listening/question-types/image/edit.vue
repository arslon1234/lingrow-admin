<template>
    <div class="space-y-4">
         <!-- File Upload Area -->
                <div v-if="!component.config.url">
                    <label :for="`file-${component.id}`" class="block w-full cursor-pointer">
                        <div
                            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-center">
                            <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </label>
                    <input :id="`file-${component.id}`" type="file" accept="image/*" class="hidden"
                        @change="handleImageUpload($event, component.id)" />
                </div>

                <!-- Image Preview with Actions -->
                <UCard v-else>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium">Image Preview</span>
                            <div class="flex gap-2">
                                <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" size="xs"
                                    @click="triggerFileInput(component.id)">
                                    Change
                                </UButton>
                                <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs"
                                    @click="removeImage(component.id)">
                                    Remove
                                </UButton>
                            </div>
                        </div>
                    </template>

                    <NuxtImg :src="component.config.url" :alt="component.config.alt || 'Question image'"
                        class="w-full rounded-lg" />

                    <template #footer>
                        <div class="space-y-3">
                            <UFormGroup label="Alt Text" size="sm">
                                <UInput v-model="component.config.alt" placeholder="Describe the image"
                                    icon="i-heroicons-information-circle" size="sm" />
                            </UFormGroup>
                            <UFormGroup label="Caption" size="sm">
                                <UInput v-model="component.config.caption" placeholder="Image caption (optional)"
                                    icon="i-heroicons-chat-bubble-left-right" size="sm" />
                            </UFormGroup>
                        </div>
                    </template>
                </UCard>

                <!-- Hidden file input for "Change" button -->
                <input :ref="`fileInput-${component.id}`" type="file" accept="image/*" class="hidden"
                    @change="handleImageUpload($event, component?.id)" />

                <!-- Divider -->
                <UDivider label="OR" />

                <!-- URL Input Alternative -->
                <UFormGroup label="Enter Image URL" hint="Alternative to file upload" size="sm">
                    <UInput v-model="component.config.url" placeholder="https://example.com/image.jpg"
                        icon="i-heroicons-link" />
                </UFormGroup>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'
const listeningStore = useListeningStore()
defineProps(['component'])

// Trigger file input click
const triggerFileInput = (componentId: number) => {
    const fileInput = document.getElementById(`fileInput-${componentId}`) as HTMLInputElement
    if (fileInput) {
        fileInput.click()
    }
}
const handleImageUpload = async (event: Event, componentId: number) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
        // Nuxt UI toast ishlatish mumkin
        const toast = useToast()
        toast.add({
            title: 'Error',
            description: 'Please upload an image file',
            color: 'red'
        })
        return
    }

    if (file.size > 10 * 1024 * 1024) {
        const toast = useToast()
        toast.add({
            title: 'Error',
            description: 'Image size should be less than 10MB',
            color: 'red'
        })
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const url = e.target?.result as string
        const component = listeningStore.components.find(c => c.id === componentId)
        if (component) {
            listeningStore.updateComponent(componentId, {
                ...component.config,
                url: url,
                alt: file.name
            })
        }
    }
    reader.readAsDataURL(file)
}
// Remove image
const removeImage = (componentId: number) => {
    const component = listeningStore.components.find(c => c.id === componentId)
    if (component) {
        listeningStore.updateComponent(componentId, {
            ...component.config,
            url: '',
            alt: '',
            caption: ''
        })

        // toast.add({
        //     title: 'Image Removed',
        //     description: 'Image has been removed',
        //     icon: 'i-heroicons-trash'
        // })
    }
}
</script>

<style lang="scss" scoped>

</style>