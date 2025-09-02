export const INITIAL_STATE = {
  title: "",
  desc: "",
  cat: "",
  price: 0,
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  features: [],
  status: "open",
};

export const projectReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    default:
      return state;
  }
};