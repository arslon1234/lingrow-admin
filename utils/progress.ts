import { useBoostEventsStore } from '~/store/boostEvents';
export function useProgress() {
    const boostEventsStore = useBoostEventsStore();
    const { submitsCount } = storeToRefs(boostEventsStore)
    const responseTimes = ref<number[]>([]); 

    function getResponseTimes() {
        const lst: string | null = localStorage.getItem('response_times'); 
        responseTimes.value = lst ? JSON.parse(lst) : [5];
    }

    function getMedian() {
        getResponseTimes();
        return responseTimes.value.reduce((acc: number, item: number) => acc + item, 0) / responseTimes.value.length;
    }
    async function simulateSubmit(eventsCount: number): Promise<void> {
    return new Promise((resolve) => {
        let simulateTime = getMedian() * 1000;
        const before = Date.now();
        const id = setInterval(() => {
            let diffTime = Date.now() - before;
            if (diffTime >= simulateTime) {
                clearInterval(id);
                resolve();
                return;
            }
            submitsCount.value = Math.floor(eventsCount * 0.9 * diffTime / simulateTime);
            console.log(submitsCount.value, diffTime, simulateTime, 'submitsCount.value');
        }, 500);
    });
}

    function addResponseTime(val: number) {
        let mnIndex: number = 0;
        for (let i = 0; i < responseTimes.value.length; i++) {
            if (responseTimes.value[i] < responseTimes.value[mnIndex]) {
                mnIndex = i;
            }
        }

        if (responseTimes.value.length < 20) {
            responseTimes.value.push(val);
        } else if (responseTimes.value[mnIndex] < val) {
            responseTimes.value[mnIndex] = val;
        }

        localStorage.setItem('response_times', JSON.stringify(responseTimes.value));
    } 

    return {
        // response times
        responseTimes,

        // submit count
        submitsCount,

        // getter, setters
        getResponseTimes,
        addResponseTime,

        // Median
        getMedian,

        // Simulation
        simulateSubmit
    }
} 