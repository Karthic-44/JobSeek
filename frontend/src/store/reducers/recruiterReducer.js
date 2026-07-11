const initialState = {
  recruiters: null,
  pagination: {},
};

export const recruiterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_RECRUITERS":
      return {
        ...state,
        recruiters: action.payload,
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