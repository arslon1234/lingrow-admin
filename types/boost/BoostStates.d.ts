declare interface BoostLoadingState {
    loading: boolean;
    loadingBoostEvents: boolean,
    isBoostEventsSubmitted: boolean;
    isBoostEventsLoaded: boolean;
    isBoostEventsSubmitLoaded: boolean
}

declare interface BoostModalState {
    optimizeModal: boolean,
    editStatusModal: boolean,
    boostModal: boolean,
    editProfileModal: boolean,
    violationModal: boolean,
    showAllErrorsAndWarningsModal: boolean
}

declare interface BoostSelectedState {
    selectedDriver: string | null,
    firstChecked: { parentIndex: number; childIndex: number } | null,
    lastChecked: { parentIndex: number; childIndex: number } | null,
    selectedOptimizeCategories: { [key: string]: boolean },
    selectAllOptimizeCategories: boolean
}

declare interface BoostUiStates {
    selectedStatus: number,
    justifyClass: string,
    scrollPosition: number,
    isVisibleCertifiedDate: boolean,
    isShiftPressed: boolean,
    contentContainer: HTMLElement | null,
    dotInspectionAlert: boolean
}

declare interface BoostChartStates {
    copiedMoveEvents: { [key: string]: GraphDuties[] };
    selectedErrorEvent: any;
}

declare interface BoostFormStates {
    editStatus: BoostEventStatusForm,
    editProfile: BoostEventEditProfile,
    formBoost: {
        transferring_time: {
            hours: number;
            minutes: number;
            seconds: number;
        }
    }
}