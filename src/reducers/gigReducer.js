/**
 * reducer and useReducer 
 * هو طريقة لادارة الحالة المعقدة بدلا من usestate 
 * تكون التحديثات بناء على افعال معينة و ليس تغير متغيرات 
 * مناسب للتطبيقات الكبيرة حيث الحالة تحتاج إلى تحديثات متعددة
 * الـ Reducer يأخذ:
الحالة الحالية (current state)
الفعل المطلوب (action) (مثل { type: "ADD", payload: 10 })
ويُعيد حالة جديدة (new state) بناءً على هذا الفعل.
 */



// تهيئة الحالة الابتدائية والتي هي عبارة عن حقول الفورم الفارغة نستخدمها في تهيئة ال reducer
export const INITIAL_STATE = {
  userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
  title: "",
  cat: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};
/**
 * 
 * التابع بستقبل الحالة و الفعل كوسطاء من الفرونت و بفحص الفعل حسب نوعه بغير الحالة وبرحع بردا
 */
export const gigReducer = (state, action) => {    
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],   // هي مصفوفة تضاف الى القاعدة 
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
