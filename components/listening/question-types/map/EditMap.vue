<template>
    <div class="space-y-4">
        <!-- Map Title/Instruction -->
        <UFormGroup label="Map Title / Instructions" size="sm">
            <UTextarea 
                :model-value="component.config.title || ''"
                @update:model-value="updateTitle"
                placeholder="Label the map below. Write the correct letter A-H next to questions 1-5..."
                :rows="2"
                size="sm"
            />
        </UFormGroup>

        <UDivider />

        <!-- Map Image Upload Section -->
        <div v-if="!component.config.mapUrl" class="space-y-3 cursor-pointer">
            <label class="block text-sm font-medium">Upload Map Image</label>
            
            <!-- File Upload Area -->
            <label :for="`map-file-${component.id}`" class="block !cursor-pointer">
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-center">
                    <UIcon name="i-heroicons-map" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p class="text-xs text-gray-500">PNG, JPG, SVG up to 10MB</p>
                </div>
            </label>
            <input 
                :id="`map-file-${component.id}`" 
                type="file" 
                accept="image/*" 
                class="hidden"
                @change="handleMapUpload" 
            />

            <!-- URL Input Alternative -->
            <UDivider label="OR" />
            
            <UFormGroup label="Enter Map Image URL" size="sm">
                <UInput 
                    :model-value="component.config.mapUrl || ''"
                    @update:model-value="updateMapUrl"
                    placeholder="https://example.com/map.jpg"
                    icon="i-heroicons-link"
                    size="sm"
                />
            </UFormGroup>
        </div>

        <!-- Map Editor (when map is uploaded) -->
        <div v-else class="space-y-4">
            <!-- Map Preview with Actions -->
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Map Image</span>
                        <div class="flex gap-2">
                            <UButton 
                                icon="i-heroicons-trash" 
                                color="red" 
                                variant="ghost" 
                                size="xs"
                                @click="removeMap"
                            >
                                Remove
                            </UButton>
                        </div>
                    </div>
                </template>

                <!-- Interactive Map Container -->
                <div class="relative inline-block max-w-full">
                    <img 
                        :src="component.config.mapUrl" 
                        alt="Map" 
                        class="max-w-full h-auto rounded-lg"
                        @click="handleMapClick"
                        style="cursor: crosshair;"
                    />
                    
                    <!-- Hotspots/Markers -->
                    <div 
                        v-for="(hotspot, index) in hotspots" 
                        :key="`hotspot-${index}`"
                        class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        :style="{
                            left: hotspot.x + '%',
                            top: hotspot.y + '%'
                        }"
                        @click.stop="selectHotspot(index)"
                    >
                        <!-- Marker Pin -->
                        <div class="relative">
                            <div 
                                class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg"
                                :class="selectedHotspotIndex === index 
                                    ? 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-800 scale-125' 
                                    : 'bg-red-500 text-white group-hover:scale-110'
                                "
                            >
                                {{ hotspot.label }}
                            </div>
                            
                            <!-- Delete button -->
                            <button
                                @click.stop="removeHotspot(index)"
                                class="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <UIcon name="i-heroicons-x-mark" class="w-3 h-3 text-white" />
                            </button>
                        </div>

                        <!-- Label tooltip -->
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <div class="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                                {{ hotspot.questionNumber ? `Q${hotspot.questionNumber}` : hotspot.label }}
                            </div>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <UAlert
                        icon="i-heroicons-information-circle"
                        color="blue"
                        variant="soft"
                        size="xs"
                        title="Click on the map to add markers"
                        description="Click anywhere on the map to place a marker, then configure it below"
                    />
                </template>
            </UCard>

            <!-- Hidden file input for "Change" button -->
            <input 
                :ref="`mapInput-${component.id}`" 
                type="file" 
                accept="image/*" 
                class="hidden"
                @change="handleMapUpload" 
            />

            <UDivider />

            <!-- Hotspot Configuration -->
            <div v-if="selectedHotspotIndex !== null && hotspots[selectedHotspotIndex]" class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold flex items-center gap-2">
                        <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
                        Configure Selected Marker
                    </h3>
                    <UBadge color="primary" variant="solid">
                        {{ hotspots[selectedHotspotIndex].label }}
                    </UBadge>
                </div>

                <UCard>
                    <div class="grid grid-cols-2 gap-4">
                        <UFormGroup label="Marker Label" size="sm">
                            <UInput
                                :model-value="hotspots[selectedHotspotIndex].label"
                                @update:model-value="updateHotspotField(selectedHotspotIndex, 'label', $event)"
                                placeholder="A, B, C..."
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Question Number" size="sm">
                            <UInput
                                type="number"
                                :model-value="hotspots[selectedHotspotIndex].questionNumber"
                                @update:model-value="updateHotspotField(selectedHotspotIndex, 'questionNumber', parseInt($event))"
                                placeholder="1"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Location Name" size="sm" class="col-span-2">
                            <UInput
                                :model-value="hotspots[selectedHotspotIndex].locationName"
                                @update:model-value="updateHotspotField(selectedHotspotIndex, 'locationName', $event)"
                                placeholder="Library, Park, Station..."
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Correct Answer" size="sm" class="col-span-2">
                            <UInput
                                :model-value="hotspots[selectedHotspotIndex].correctAnswer"
                                @update:model-value="updateHotspotField(selectedHotspotIndex, 'correctAnswer', $event)"
                                placeholder="Type correct answer..."
                                icon="i-heroicons-check-circle"
                                color="green"
                                size="sm"
                            />
                        </UFormGroup>

                        <UFormGroup label="Description (optional)" size="sm" class="col-span-2">
                            <UTextarea
                                :model-value="hotspots[selectedHotspotIndex].description"
                                @update:model-value="updateHotspotField(selectedHotspotIndex, 'description', $event)"
                                placeholder="Additional information..."
                                :rows="2"
                                size="sm"
                            />
                        </UFormGroup>
                    </div>
                </UCard>
            </div>

            <!-- All Hotspots List -->
            <div v-if="hotspots.length > 0" class="space-y-3">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold">All Markers ({{ hotspots.length }})</h3>
                    <UButton
                        icon="i-heroicons-plus-circle"
                        color="primary"
                        variant="soft"
                        size="xs"
                        disabled
                    >
                        Click map to add
                    </UButton>
                </div>

                <div class="grid grid-cols-1 gap-2">
                    <div
                        v-for="(hotspot, index) in hotspots"
                        :key="`hotspot-list-${index}`"
                        @click="selectHotspot(index)"
                        class="p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md"
                        :class="selectedHotspotIndex === index 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        "
                    >
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                                    {{ hotspot.label }}
                                </div>
                                <div>
                                    <p class="font-medium text-sm">
                                        {{ hotspot.locationName || 'Unnamed location' }}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        Question {{ hotspot.questionNumber || '?' }}
                                        <span v-if="hotspot.correctAnswer" class="text-green-600">
                                            • Answer: {{ hotspot.correctAnswer }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-1">
                                <UButton
                                    icon="i-heroicons-pencil"
                                    size="xs"
                                    color="gray"
                                    variant="ghost"
                                    @click.stop="selectHotspot(index)"
                                />
                                <UButton
                                    icon="i-heroicons-trash"
                                    size="xs"
                                    color="red"
                                    variant="ghost"
                                    @click.stop="removeHotspot(index)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State for Markers -->
            <UAlert
                v-else
                icon="i-heroicons-map-pin"
                color="amber"
                variant="soft"
                title="No markers added yet"
                description="Click on the map image above to add your first marker"
            />
        </div>


    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'

interface Hotspot {
    x: number
    y: number
    label: string
    questionNumber?: number
    locationName?: string
    correctAnswer?: string
    description?: string
}

const props = defineProps(['component'])
const listeningStore = useListeningStore()
const toast = useToast()

const hotspots = ref<Hotspot[]>([])
const selectedHotspotIndex = ref<number | null>(null)

const initializeMap = () => {
    if (props.component.config.hotspots) {
        hotspots.value = [...props.component.config.hotspots]
    }
}

onMounted(() => {
    initializeMap()
})

const handleMapUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.add({
            title: 'Error',
            description: 'Please upload an image file',
            color: 'red'
        })
        return
    }

    if (file.size > 10 * 1024 * 1024) {
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
        updateMapUrl(url)
        toast.add({
            title: 'Success',
            description: 'Map image uploaded successfully',
            color: 'green'
        })
    }
    reader.readAsDataURL(file)
}


const removeMap = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        mapUrl: '',
        hotspots: []
    })
    hotspots.value = []
    selectedHotspotIndex.value = null
}

const handleMapClick = (event: MouseEvent) => {
    const img = event.target as HTMLImageElement
    const rect = img.getBoundingClientRect()
    
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const nextLabel = String.fromCharCode(65 + hotspots.value.length) // A, B, C...
    
    const newHotspot: Hotspot = {
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        label: nextLabel,
        questionNumber: hotspots.value.length + 1,
        locationName: '',
        correctAnswer: '',
        description: ''
    }

    hotspots.value.push(newHotspot)
    selectedHotspotIndex.value = hotspots.value.length - 1
    saveHotspots()
}

const selectHotspot = (index: number) => {
    selectedHotspotIndex.value = index
}

const removeHotspot = (index: number) => {
    hotspots.value.splice(index, 1)
    if (selectedHotspotIndex.value === index) {
        selectedHotspotIndex.value = null
    } else if (selectedHotspotIndex.value && selectedHotspotIndex.value > index) {
        selectedHotspotIndex.value--
    }
    saveHotspots()
}

const updateHotspotField = (index: number, field: keyof Hotspot, value: any) => {
    (hotspots.value[index] as any)[field] = value
    saveHotspots()
}

const updateTitle = (value: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        title: value
    })
}

const updateMapUrl = (value: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        mapUrl: value
    })
}

const saveHotspots = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        hotspots: hotspots.value
    })
}
</script>

<style scoped>
/* Smooth transitions for markers */
.group:hover .group-hover\:scale-110 {
    transition: transform 0.2s ease;
}
</style>