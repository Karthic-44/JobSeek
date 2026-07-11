import {configureStore} from "@reduxjs/toolkit"
import { errorReducer } from "./errorReducer";
import { authReducer } from "./authReducer";
import { adminReducer } from "./adminReducer";
import { jobsReducer } from "./jobsReducer";
import { recruiterReducer } from "./recruiterReducer";


const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;




const initialState = {
    auth: {user: user},
};

export const store = configureStore({
    reducer: {
        
        errors: errorReducer,
        auth: authReducer,
        admin: adminReducer,
        jobs: jobsReducer,
        recruiter: recruiterReducer,
    },
    preloadedState: initialState,
});

export default store;