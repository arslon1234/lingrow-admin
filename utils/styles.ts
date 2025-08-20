export const formInputStyleDisabled = Object.freeze({
	wrapper: 'w-full',
  rounded: 'rounded-lg',
  padding: {
    xl: 'px-4 py-2',
  },
  placeholder: 'placeholder-black-0/[.4] placeholder:text-sm',
  color: {
    white: {
      outline:
        'shadow-none bg-black-0/[.04] ring-1 disabled:pe-4 ring-inset ring-grey-border focus:ring-2 focus:ring-primary-800',
    },
  },
});

export const formInputStyle = {
  ...formInputStyleDisabled,
  icon: {
    trailing: {
      pointer: 'pointer-events-auto',
    },
  },
};