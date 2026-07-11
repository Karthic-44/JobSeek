import api from "../../api/api"

export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};

export const fetchJobs = (queryString) => async (dispatch) => {
    try {
        dispatch({type: "IS_FETCHING"});
        const {data} = await api.get(`/public/jobs?${queryString}`);
        dispatch({
            type: "FETCH_JOBS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "IS_SUCCESS"});
    } catch (error) {
        console.log(error);
        dispatch({type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch job",
        });
    }
};

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signin", sendData);
        dispatch({type: "LOGIN_USER", payload: data});
        localStorage.setItem("auth", JSON.stringify(data));
        reset()
        toast.success("Login Success");
        navigate("/")

    } catch (error) {
        console.log(error);
       toast.error(error?.response?.data?.message || "Internal Server Error");
        
    } finally{
        setLoader(false);
    }
};

export const registerNewUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};


export const fetchjobs = (queryString) => async (dispatch) => {
    try {
        dispatch({type: "IS_FETCHING"});
        const {data} = await api.get(`/public/jobs?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "IS_SUCCESS"});
    } catch (error) {
        console.log(error);
        dispatch({type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch jobs",
        });
    }
};

export const updateJobImageFromDashboard = 
    (formData, jobId, toast, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/jobs/" : "/recruiter/jobs/";
        await api.put(`${endpoint}${jobId}/image`, formData);
        toast.success("Image upload successful");
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardJobsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Job Image upload failed");
     
    }
};

export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };


  export const getAllRecruiterDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/recruiters?${queryString}`);
      dispatch({
        type: "GET_RECRUITERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch recruiters data",
      });
    }
  };

export const addNewDashboardRecruiter =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Recruiter registered successfully!");

      await dispatch(getAllRecruiterDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };
 
  export const deleteJob = 
    (setLoader, jobId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true)
        const endpoint = isAdmin ? "/admin/jobs/" : "/recruiter/jobs/";
        await api.delete(`${endpoint}${jobId}`);
        toast.success("Job deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(dashboardJobsAction());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error Occured"
        )
    }
};

export const analyticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING"});
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS"});
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
            });
        }
};

export const dashboardJobsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        // const endpoint = isAdmin ? "/admin/jobs" : "/recruiter/jobs";
        const endpoint = "/public/jobs";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "FETCH_JOBS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard jobs",
         });
    }
};

export const addNewJobFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async(dispatch, getState) => {
        try {
            setLoader(true);
            const endpoint = isAdmin ? "/admin/categories/" : "/recruiter/categories/";
            await api.post(`${endpoint}${sendData.categoryId}/job`,
                sendData
            );
            toast.success("Job created successfully");
            reset();
            setOpen(false);
            await dispatch(dashboardJobsAction());
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.description || "Job creation failed");
        } finally {
            setLoader(false);
        }
    }

    

export const updateJobFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/jobs/" : "/recruiter/jobs/";
        await api.put(`${endpoint}${sendData.id}`, sendData);
        toast.success("Job update successful");
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardJobsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Job update failed");
     
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};
export const getAllRecruitersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/recruiters?${queryString}`);
      dispatch({
        type: "GET_RECRUITERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch recruiters data",
      });
    }
  };


