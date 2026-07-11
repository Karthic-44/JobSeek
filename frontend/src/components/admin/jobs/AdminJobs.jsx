import React, { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/Loader';
import { FaBoxOpen } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { adminJobTableColumn } from '../../helper/tableColumn';
import { useDashboardJobFilter } from '../../../hooks/useJobFilter';
import Modal from '../../shared/Modal';
import AddJobForm from './AddJobForm';
import DeleteModal from '../../shared/DeleteModal';
import { deleteJob } from '../../../store/action';
import toast from 'react-hot-toast';
import ImageUploadForm from './ImageUploadForm';
import JobViewModal from '../../shared/JobViewModal';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AdminJobs = () => {

  const {jobs, pagination} = useSelector((state) => state.jobs);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const [currentPage, setCurrentPage] = useState(
      pagination?.pageNumber + 1 || 1
    );

  const dispatch = useDispatch();
  
  const [selectedJob, setSelectedJob] = useState('');
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openJobViewModal, setOpenJobViewModal] = useState(false);
  const [openImageUploadModal, setOpenImageUploadModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  useDashboardJobFilter();

  const tableRecords = jobs?.map((item) => {
  return {
    id: item.jobId,
    jobName: item.jobName,
    description: item.description,
    qualification: item.qualification,
    image: item.image,
    company: item.company,
  }
});

const handleEdit = (job) => {
  setSelectedJob(job);
  setOpenUpdateModal(true);
};

const handleDelete = (job) => {
  setSelectedJob(job);
  setOpenDeleteModal(true);
};

const handleImageUpload = (job) => {
  setSelectedJob(job);
  setOpenImageUploadModal(true);
};

const handleJobView = (job) => {
  setSelectedJob(job);
  setOpenJobViewModal(true);
};


const handlePaginationChange = (paginationModel) => {
  const page = paginationModel.page + 1;
  setCurrentPage(page);
  params.set("page", page.toString());
  navigate(`${pathname}?${params}`)
};


const onDeleteHandler = () => {
  dispatch(deleteJob(setLoader, selectedJob?.id, toast, setOpenDeleteModal, isAdmin));
};

  const emptyJob = !jobs || jobs?.length ===0;
  return (
    <div>
      <div className='pt-6 pb-10 flex justify-end'>
        <button
          onClick={() => setOpenAddModal(true)}
          className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300'>
          <IoMdAdd  className='text-xl' />
          Add Job
        </button>
      </div>


    {!emptyJob && (
      <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
        All Jobs</h1>
    )}
    {isLoading ? (
      <Loader />
    ) : (
      <>
      {emptyJob ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaBoxOpen size={50} className='mb-3'/>
          <h2 className='text-2xl font-semibold'>
            No jobs created yet  
          </h2>
        </div>
      ) : (
        <div className='max-w-full'>
          <DataGrid
            className='w-full'
            rows={tableRecords}
            columns={adminJobTableColumn(
              handleEdit,
              handleDelete,
              handleImageUpload,
              handleJobView)}
            paginationMode='server'
            rowCount={pagination?.totalElements || 0}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pageSizeOptions={[pagination?.pageSize || 10]}
            pagination
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
            />
        </div>
      )}
      </>
    )}

    <Modal
      open={openUpdateModal || openAddModal}
      setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
      title={openUpdateModal ? "Update Job" : "Add Job"}>
        <AddJobForm 
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
          job={selectedJob}
          update={openUpdateModal}
          />
    </Modal>


    <Modal
      open={openImageUploadModal}
      setOpen={setOpenImageUploadModal}
      title="Add Job Image">
        <ImageUploadForm 
          setOpen={setOpenImageUploadModal}
          job={selectedJob}
          />
    </Modal>


    <DeleteModal
      open={openDeleteModal}
      setOpen={setOpenDeleteModal}
      loader={loader}
      title="Delete Job"
      onDeleteHandler={onDeleteHandler} />

      <JobViewModal 
        open={openJobViewModal}
        setOpen={setOpenJobViewModal}
        job={selectedJob}
      />
    </div>
  )
}

export default AdminJobs