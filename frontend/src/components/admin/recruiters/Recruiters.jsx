import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPersonAdd } from "react-icons/md";

import RecruiterTable from "./RecruiterTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import AddRecruiterForm from "./AddRecruiterForm";
import useRecruiterFilter from "./useRecruiterFilter";

const Recruiters = () => {
  const [openModal, setOpenModal] = useState(false);
  const { recruiters, pagination } = useSelector((state) => state.recruiter);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // Calling the `useRecruiterFilter` custom hook to fetch recruiters and pagination based on the current URL parameters.
  useRecruiterFilter();

  const emptyRecruiters = !recruiters || recruiters?.length === 0;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdPersonAdd className="text-xl" />
          Add Recruiter
        </button>
      </div>

      {!emptyRecruiters && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Recruiters
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptyRecruiters ? (
            <>
              <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                <h2 className="text-2xl font-semibold">
                  No Recruiter Created Yet
                </h2>
              </div>
            </>
          ) : (
            <RecruiterTable recruiters={recruiters} pagination={pagination} />
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Recruiter">
        <AddRecruiterForm setOpen={setOpenModal} />
      </Modal>
    </React.Fragment>
  );
};

export default Recruiters;