const initialState = {
    adminJOBS: null,
    pagination: {},
};

export const jobsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ADMIN_JOBS":
            return {
                ...state,
                adminJOBS: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
        default:
            return state;
    }
};