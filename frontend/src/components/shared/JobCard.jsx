import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import JobViewModal from './JobViewModal';
import truncateText from '../../utils/truncateText';
import { useDispatch} from "react-redux";
import toast from "react-hot-toast";

const JobCard = ({
      jobId,
      jobName,
      image,
      description,
      company,
      qualification,
      
      about = false,
}) => {
    const [openJobViewModal, setOpenJobViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewJob, setSelectedViewJob] = useState("");
    const dispatch = useDispatch();

    const handleJobView = (job) => {
         if (!about) {
            setSelectedViewJob(job);
            setOpenJobViewModal(true);
        }
    };

   

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
            <div onClick={() => {
                handleJobView({
                    jobId,
                    jobName,
                    image,
                    description,
                    
                })}} 
            className="w-full overflow-hidden aspect-[3/2]">
                <img className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                     src={image}
                     alt={jobName}>
                </img>
            </div>
            <div className="p-4">
                <h2 onClick={() => {() => {
                handleJobView({
                    jobId,
                    jobName,
                    image,
                    description,
                    company,
                    qualification
                 
                })}}}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {truncateText(jobName,50)}
                </h2>
                <div className="min-h-5
                 max-h-10">
                    <p className="text-gray-600 text-sm">{truncateText(description, 80)}</p>
                </div>
                <div className="">
                    <p className="text-gray-600 text-sm">Company: {truncateText(company, 80)}</p>
                </div>
                <div className="">
                    <p className="text-gray-600 text-sm">Qualification: {truncateText(qualification, 80)}</p>
                </div>
                
            </div>
            <JobViewModal 
            open={openJobViewModal}
            setOpen={setOpenJobViewModal}
            job={selectedViewJob}
            />
        </div>
    )
}

export default JobCard;