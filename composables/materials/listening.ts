import { useListeningStore } from "~/store/listening";

export const useListeningComposable = async () => {
    const listeningStore = useListeningStore()
    
    const statusModal = ref(false);
    const loading = reactive({
        audioUpload: false
    })
	const handleFileUpload = async (selectedFile: File | null) => {
		console.log(selectedFile, 'File upload handler called');
        const formData = new FormData()
        formData.append('file', selectedFile!)
        loading.audioUpload = true
        const res = await listeningStore.audioUpload(formData)
        if(res.status === 200){
            loading.audioUpload = false
            statusModal.value = false
        }
	};

	return {...toRefs(loading), statusModal, handleFileUpload};
};
