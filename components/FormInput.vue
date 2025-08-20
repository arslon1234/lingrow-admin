<template>
	<UInput :type="formType" :disabled="disabled" v-model="inputValue" :ui="!disabled ? formInputStyle : formInputStyleDisabled">
		<template v-if="!disableClear" #trailing>
			<div class="flex flex-col gap-1/2" v-if="formType.toLowerCase() == 'number'">
				<UButton
						tabindex="-1"
						color="gray"
						variant="link"
						:padded="false"
						@click="inputValue += props.offset"
				>
					<ChevronUpIcon class="text-background-grey_1 h-3 w-3" />
				</UButton>
				<UButton
					tabindex="-1"
					color="gray"
					variant="link"
					:padded="false"
					@click="inputValue -= props.offset"
				>
					<ChevronDownIcon class="text-background-grey_1 h-3 w-3" />
				</UButton>
			</div>
			<UButton
				tabindex="-1"
				v-show="!!inputValue && !error"
				color="gray"
				variant="link"
				:padded="false"
				@click="props.type !== 'password' ? (inputValue = '') : (formType = formType === 'password' ? 'text' : 'password')"
			>
				<template v-if="props.type !== 'password' && !disabled" #leading>
					<XCircleIcon class="text-background-grey_1" />
				</template>
				<template v-else-if="props.type === 'password' && !disabled" #leading>
					<EyeIcon v-show="formType === 'text'" class="text-background-grey_1" />
					<EyeOffIcon v-show="formType === 'password'" class="text-background-grey_1" />
				</template>
			</UButton>
			<UIcon v-show="error" class="text-red-0 h-5 w-5" name="i-heroicons-exclamation-triangle-20-solid" />
		</template>
	</UInput>
</template>

<script setup>
// importing icons
import ChevronDownIcon from '~/assets/icons/chevron-down.svg';
import ChevronUpIcon from '~/assets/icons/chevron-up.svg';
import XCircleIcon from '~/assets/icons/x-circle.svg';

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
	disabled: { type: Boolean, default: false },
	modelValue: { type: [String, Number, null], required: true },
	type: { type: String, default: 'text' },
	error: { type: [Boolean, String], default: false },
	disableClear: { type: Boolean, default: false },
	offset: { type: Number, default: 1, required: false },
	decimalRound: { type: Number, default: 0, required: false }
});

const formType = ref(props.type);
const inputValue = ref(props.type.toLowerCase() == 'number' ? +props.modelValue : props.modelValue);

watch(() => props.modelValue, (value) => {
	inputValue.value = value;
});

watch(inputValue, (value) => {
	if (formType.value.toLowerCase() == 'number') {
		emits('update:modelValue', roundNumberByDecimalDig(value, props.decimalRound));
	} else {
		emits('update:modelValue', value);
	}
});
</script>
