import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewJobFromDashboard, fetchCategories, updateJobFromDashboard } from '../../../store/action';
import toast from 'react-hot-toast';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';
import Skeleton from '../../shared/Skeleton';
import ErrorPage from '../../shared/ErrorPage';

const AddJobForm = ({ setOpen, job, update=false}) => {
const [loader, setLoader] = useState(false);
const [selectedCategory, setSelectedCategory] = useState();
const { categories } = useSelector((state) => state.jobs);
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
const { user } = useSelector((state) => state.auth);
const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const saveJobHandler = (data) => {
        if(!update) {
            // create new job logic
            const sendData = {
                ...data,
                categoryId: selectedCategory.categoryId,
            };
            dispatch(addNewJobFromDashboard(
                sendData, toast, reset, setLoader, setOpen, isAdmin
            ));
        } else {
            const sendData = {
                ...data,
                id: job.id,
            };
            dispatch(updateJobFromDashboard(sendData, toast, reset, setLoader, setOpen, isAdmin));
        }
    };


    useEffect(() => {
        if (update && job) {
            setValue("jobName", job?.jobName);
            setValue("company", job?.company);
            setValue("qualification", job?.qualification);
            setValue("description", job?.description);
        }
    }, [update, job]);


    useEffect(() => {
        if (!update) {
            dispatch(fetchCategories());
        }
    }, [dispatch, update]);

    useEffect(() => {
        if (!categoryLoader && categories) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, categoryLoader]);
  
  

    if (categoryLoader) return <Skeleton />
    if (errorMessage) return <ErrorPage message={errorMessage} />

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4'
            onSubmit={handleSubmit(saveJobHandler)}>
            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Job Name"
                    required
                    id="jobName"
                    type="text"
                    message="This field is required*"
                    register={register}
                    placeholder="Job Name"
                    errors={errors}
                    />

                {!update && (
                    <SelectTextField
                        label="Select Categories"
                        select={selectedCategory}
                        setSelect={setSelectedCategory}
                        lists={categories}
                    />
                )}
            </div>

            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Company"
                    required
                    id="company"
                    type="text"
                    message="This field is required*"
                    placeholder="Company"
                    register={register}
                    errors={errors}
                    />

                    <InputField 
                    label="Qualification"
                    required
                    id="qualification"
                    type="text"
                    message="This field is required*"
                    register={register}
                    placeholder="Qualification"
                    errors={errors}
                    />
            </div>
     

        <div className="flex flex-col gap-2 w-full">
            <label htmlFor='desc'
              className='font-semibold text-sm text-slate-800'>
                Description
            </label>

            <textarea
                rows={5}
                placeholder="Add job description...."
                className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${
                    errors["description"]?.message ? "border-red-500" : "border-slate-700" 
                }`}
                maxLength={255}
                {...register("description", {
                    required: {value: true, message:"Description is required"},
                })}
                />

                {errors["description"]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors["description"]?.message}
                    </p>
                )}
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
            <Button disabled={loader}
                    onClick={() => setOpen(false)}
                    variant='outlined'
                    className='text-white py-[10px] px-4 text-sm font-medium'>
                Cancel
            </Button>

            <Button
                disabled={loader}
                type='submit'
                variant='contained'
                color='primary'
                className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                {loader ? (
                    <div className='flex gap-2 items-center'>
                        <Spinners /> Loading...
                    </div>
                ) : (
                    "Save"
                )}
            </Button>
        </div>
        </form>
    </div>
  )
}

export default AddJobForm