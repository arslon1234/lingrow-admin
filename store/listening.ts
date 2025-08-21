import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from '~/helpers/notification';

export const useListeningStore = defineStore("drivers", () => {
  async function audioUpload(formData: FormData) {
    const result = await useAxios().postRequest(ApiUrls.AUDIO_UPLOAD, formData);
    if(result.status === 200){
        addSuccess('Audio uploaded')
    }
    return result
  }

  return {
   audioUpload
  }
});