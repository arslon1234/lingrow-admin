<template>
    <div class="my-6 space-y-6">
        <!-- Question Text -->
        <p v-if="component.config.questionText" class="text-base text-gray-800">
            {{ component.config.questionText }}
        </p>

        <!-- Instructions -->
        <p v-if="component.config.instruction" class="text-sm text-gray-700 italic">
            {{ component.config.instruction }}
        </p>

        <!-- Options Box -->
        <div class="border-2 border-gray-300 rounded-lg p-6 my-6">
            <h4 class="text-center font-bold text-lg mb-4">
                {{ component.config.optionsTitle || 'Opinions' }}
            </h4>
            <div class="space-y-3">
                <div v-for="(option, index) in component.config.matchingOptions" :key="index" 
                    class="flex gap-3">
                    <span class="font-bold min-w-[2rem]">{{ option.id }}</span>
                    <span class="text-gray-700">{{ option.text }}</span>
                </div>
            </div>
        </div>

        <!-- Items List -->
        <div class="space-y-3">
            <h4 class="font-bold text-base mb-3">
                {{ component.config.itemsTitle || 'Food trends' }}
            </h4>
            <div v-for="(item, index) in component.config.matchingItems" :key="index" 
                class="flex items-center gap-4">
                <span class="font-bold min-w-[2rem]">
                    {{ (component.config.startNumber || 25) + index }}
                </span>
                <span class="flex-1 text-gray-700">{{ item.text }}</span>
                
                <!-- Answer Input -->
                <input 
                    type="text" 
                    class="w-16 text-center border-b-2 border-dotted border-gray-400 px-2 py-1 focus:outline-none focus:border-blue-500 uppercase"
                    
                    maxlength="1"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['component']);
</script>

<style scoped>
/* Input uppercase qilish */
input {
    text-transform: uppercase;
}

/* Dotted line'ni input'dan ajratish */
input::placeholder {
    text-transform: none;
    font-size: 0.75rem;
    color: #9ca3af;
}
</style>