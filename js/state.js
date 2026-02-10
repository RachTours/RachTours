// Global State
export const state = {
  selectedTours: [],
  transportSelections: {}, // { tourId: boolean }
};

export const resetState = () => {
  state.selectedTours = [];
  for (const key in state.transportSelections) {
    delete state.transportSelections[key];
  }
  saveToLocalStorage();
};

export const saveToLocalStorage = () => {
  try {
    localStorage.setItem("selectedTours", JSON.stringify(state.selectedTours));
    localStorage.setItem(
      "transportSelections",
      JSON.stringify(state.transportSelections)
    );
  } catch (e) {
    console.error("Could not save to localStorage", e);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const storedTours = localStorage.getItem("selectedTours");
    const storedTransport = localStorage.getItem("transportSelections");

    if (storedTours) {
      state.selectedTours = JSON.parse(storedTours);
    }
    if (storedTransport) {
      const parsedTransport = JSON.parse(storedTransport);
      // Merge into existing object to keep reference if needed, or just replace
      Object.assign(state.transportSelections, parsedTransport);
    }
  } catch (e) {
    console.error("Could not load from localStorage", e);
  }
};
