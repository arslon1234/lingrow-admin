<template>
    <div class="flex h-screen">
        <div class="w-3/4">
            <img src="/image.jpg" alt="Background Image"
                class="object-cover h-full w-full rounded-tr-[32px] rounded-br-[32px]" />
        </div>

        <div class="w-1/4 flex flex-col justify-center items-center">
            <div class="w-[300px]">
                <h1 class="text-2xl font-semibold mb-2 text-start text-black">Sign Up</h1>
                <p class="text-xs max-w-[85%] mb-8 leading-snug">
                    Welcome to logistics supply chain platform. Register as a member to experience
                </p>
                <UForm @submit="handleSubmit" class="w-full">
                    <UInput v-model="form.username" type="text" placeholder="Username" size="lg"
                        :ui="{ leading: 'snug', rounded: 'xl' }" class="mb-4 w-full" required
                        style="background-color: rgba(0, 0, 0, 0.1);" @blur="validateField('username')" />
                    <p v-if="errors.username" class="text-red-500 text-sm mb-4">{{ errors.username }}</p>

                    <div class="relative">
                        <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'"
                            placeholder="Enter your password" size="lg" :ui="{ leading: 'snug', rounded: 'lg' }"
                            class="w-full" required style="background-color: rgba(0, 0, 0, 0.1);"
                            @blur="validateField('password')" />
                        <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="gray"
                            variant="ghost" class="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-inherit"
                            @click="showPassword = !showPassword" size="md" :ui="{ icon: { size: { md: 'h-4 w-4' } } }">
                        </UButton>
                    </div>
                    <p v-if="errors.password" class="text-red-500 text-sm mb-4">{{ errors.password }}</p>

                    <UButton type="submit" size="lg" :ui="{ button: { base: 'leading-normal font-semibold' } }"
                        class="w-full mt-8 rounded-lg text-center flex justify-center items-center">
                        Sign Up
                    </UButton>
                </UForm>
            </div>
        </div>
    </div>
</template>

<script setup>
const showPassword = ref(false)

const form = reactive({
    username: '',
    password: ''
})

const errors = reactive({
    username: '',
    password: ''
})

function validateField(field) {
    errors[field] = ''

    if (field === 'username') {
        if (!form.username) {
            errors.username = 'Username kiritish majburiy'
        } else if (form.username.length < 3) {
            errors.username = "Username kamida 3 ta harfdan iborat bo'lishi kerak"
        }
    }

    if (field === 'password') {
        if (!form.password) {
            errors.password = 'Parol kiritish majburiy'
        } else if (form.password.length < 6) {
            errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
        }
    }
}

const validate = () => {
    validateField('username')
    validateField('password')

    return !errors.username && !errors.password
}

const handleSubmit = (event) => {
    const isValid = validate()

    if (isValid) {
        console.log('Form submitted:', form)
    }
}
definePageMeta({
    layout: 'auth'
})
</script>
