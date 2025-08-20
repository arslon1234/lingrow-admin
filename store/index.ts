import { defineStore } from "pinia";

export const useIndex = defineStore("index", () => {
  if(!getSidebar()) setSidebar();
  const sidebar = ref<string>(getSidebar() ?? 'open');

  watch(() => sidebar.value, (newValue: string) => {
    setSidebar(newValue)
  })

  return {
    sidebar,
  };
});
