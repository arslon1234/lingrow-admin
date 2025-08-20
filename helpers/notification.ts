export const addSuccess = (message: string = "Successfull", timeout: number = 2000) => {
  const toast = useToast();
  toast.add({
    title: message,
    description: '',
    color: 'green',
    timeout: timeout,
    icon: 'i-heroicons-check-circle',
    ui: {
      title: 'text-white',
      background: "bg-green-500",
      icon: {
        color: 'text-white',
      },
      default: {
        closeButton: {
          class: 'text-white hover:text-white'
        }
      }
    }
  });
};

export const addError = (message: string = "Failed", timeout: number = 2000) => {
  const toast = useToast();
  toast.add({
    title: message,
    description: '',
    timeout: timeout,
    color: 'red',
    icon: 'i-heroicons-exclamation-triangle',
    ui: {
      title: 'text-white',
      background: "bg-red-500",
      // progress: {
      //   background: "bg-red-300 dark:bg-red-400"
      // },
      icon: {
        color: 'text-white',
      },
      default: {
        closeButton: {
          class: 'text-white hover:text-white'
        }
      }
    }
  });
};
