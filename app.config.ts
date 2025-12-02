export default defineAppConfig({
	ui: {
		primary: 'purple',
		button: {
			base: 'duration-200 ease-in-out !shadow-none',
			rounded: 'rounded-lg',
			font: 'font-semibold',
			variant: { solid: 'bg-primary-500 hover:bg-primary-600 dark:bg-dark-button-1 dark:text-white' }
		},
		badge: {
			font: 'font-semibold'
		},
		popover: {
			background: 'dark:bg-dark-2',
			ring: 'dark:ring-white/[0.2]',
			arrow: {
				background: 'before:bg-white dark:before:bg-dark-2',
				shadow: 'before:shadow-none',
				ring: 'dark:before:ring-white/[.2]'
			}
		},
		select: {
			rounded: 'rounded-lg',
			placeholder: 'dark:text-grey-1/[.8] font-semibold text-grey-2',
			color: {
				white: {
					outline: 'ring-grey-border shadow-none dark:bg-white/[0.05] dark:text-white/[0.8] dark:ring-white/[0.2] '
				}
			}
		},
		selectMenu: {
			background: 'dark:bg-dark-modal_select',
			ring: 'dark:ring-white/[0.2]',
			input: 'dark:bg-dark-modal_select dark:placeholder:text-grey-1/[.8] dark:border-white/[.2]',
			option: {
				active: 'dark:bg-black/[0.1]'
			}
		},
		toggle: {
			base: 'duration-300',
			active: 'dark:bg-[#353535]',
			inactive: 'dark:bg-[#777878]',
			container: {
				base: 'dark:bg-[#777878] duration-300',
				inactive: 'dark:!bg-[#353535]'
			}
		},
		modal: {
			overlay: {
				background: 'bg-black/[.5] backdrop-blur-sm dark:bg-black/[.8]'
			},
			shadow: '',
			rounded: 'rounded-2xl',
			background: 'dark:bg-dark-2'
		},
		divider: {
			border: {
				base: 'border-grey-border dark:border-white/[0.1]'
			}
		},
		tabs: {
			container: 'hidden',
			list: {
				base: 'border border-grey-border dark:border-white/[.2]',
				background: 'bg-white dark:bg-white/[.1]',
				rounded: 'rounded-lg',
				padding: 'p-0',
				height: 'h-auto',
				marker: { background: 'bg-purple dark:bg-dark-button-1', rounded: 'rounded-lg' },
				tab: {
					active: 'text-white',
					inactive: 'text-grey-0 dark:text-dark-4/[.8]',
					size: 'text-sm',
					padding: 'px-4 py-[7px]',
					height: 'h-auto',
					rounded: 'rounded-lg',
					font: 'font-semibold'
				}
			}
		},
		checkbox: {
			label: 'text-black cursor-pointer dark:text-white/[0.8]',
			base: 'cursor-pointer',
			background: 'bg-transparent dark:bg-transparent',
			border: 'border-black-0/[.2] dark:border-white/[0.2]'
		},
		radio: {
			background: 'dark:bg-white/[0.05]',
			border: 'dark:border-white/[0.05]'
		},
		input: {
			placeholder: 'dark:placeholder-grey-1/[.8] font-semibold',
			color: {
				white: {
					outline: 'dark:bg-white/[0.05] dark:text-white/[0.8] dark:ring-white/[0.2]'
				}
			}
		},
		pagination: {
			wrapper: 'w-fit space-x-1 px-3 py-2 rounded-xl bg-brown/[.1]',
			rounded: 'rounded-lg first:rounded-lg last:rounded-lg',
			base: 'h-7 w-7 flex items-center justify-center ring-0 bg-transparent disabled:bg-transparent disabled:text-grey-0 hover:bg-brown/[.2]',
			default: {
				activeButton: { class: '!bg-brown' },
				inactiveButton: { class: 'hover:bg-brown/[.2] dark:bg-transparent' },
				firstButton: { class: 'disabled:bg-transparent disabled:text-grey-0 hover:bg-brown/[.2] dark:disabled:bg-transparent dark:bg-transparent' },
				lastButton: { class: 'disabled:bg-transparent disabled:text-grey-0 hover:bg-brown/[.2] dark:disabled:bg-transparent dark:bg-transparent' },
				prevButton: { class: ' dark:disabled:bg-transparent dark:bg-transparent' },
				nextButton: { class: ' dark:disabled:bg-transparent dark:bg-transparent' }
			}
		},
		formGroup: {
			wrapper: 'relative',
			error: 'text-red-500 absolute top-[80%] left-0 text-sm',
			help: 'absolute top-full left-0 font-medium text-grey-2',
			label: {
				base: 'block font-medium text-black-1 text-xs dark:text-white/[0.6]'
			},
			description: 'dark:text-dark-placeholder',
			hint: 'dark:bg-dark-form_text-0'
		},

		table: {
			tbody: 'divide-grey-border/[.5] dark:divide-white/[0.05] [&>tr]:duration-200 tbody-striped',
			divide: 'divide-grey-border/[.5] dark:divide-white/[0.05]',
			th: { color: 'text-grey-0 text-sm', size: 'text-base', font: 'font-semibold', padding: 'px-6 py-2' },
			td: { color: 'text-black-0 text-sm dark:text-white/[0.6]', font: 'font-semibold', padding: 'px-6 py-3' }
		},
		notifications: {
			position: 'top-0 end-0',
			wrapper: 'justify-start z-[55] pointer-events-none'
		},
		notification: {
			position: 'top-0 right-0'
		},
		progress: {
			progress: {
				track: '[&::-webkit-progress-bar]:bg-purple/[.2] [@supports(selector(&::-moz-progress-bar))]:bg-purple/[.2]',
				background: '[&::-webkit-progress-value]:bg-purple/[.8] [&::-moz-progress-bar]:bg-purple/[.8]'
			}
		},
		textarea: {
			color: {
				white: {
					outline: 'dark:bg-white/[.05] dark:ring-white/[.2] dark:placeholder:text-grey-1/[.8]'
				}
			}
		}
	}
});
