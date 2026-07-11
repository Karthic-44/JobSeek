import JobCard from "./shared/JobCard";

const jobs = [
    {
        image: "/placeholder.png",
        jobName: "Frontend-Developer",
        company:"XYZ",
        description:"Recruiting a frontend developer with 5 years of experience",
        qualification: "M.C.A",
        
      },
      {
        image: "/placeholder.png",
        jobName: "Backend-Developer",
        company:"XYZ",
        description:"Recruiting a backend developer with 2 years of experience",
        qualification: "B.Tech",
        
      },
      {
        image: "/placeholder.png",
        jobName: "Linux Administrator",
        company:"ABC",
        description:
          "Recruiting a linux administrator with 3 years of experience",
        qualification: "BCA",
      }
];

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-slate-800 text-4xl font-bold text-center mb-12">
                About Us
            </h1>
           <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <p className="text-lg mb-4">
                        Welcome to our job-seek portal! We are dedicated to providing the
                        best jobs and services to our customers. Our mission is to offer
                        a seamless communication channl between seekers and recruiters.
                    </p>
                </div>

                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                    <img
                        src="/placeholder.png"
                        alt="About Us"
                        className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"></img>
                </div>
           </div>


           <div className="py-7 space-y-8">
            <h1 className="text-slate-800 text-4xl font-bold text-center">
                Actively Hiring 
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {jobs.map((job, index) => (
                <JobCard 
                    key={index}
                    image={job.image}
                    jobName={job.jobName}
                    company={job.company}
                    description={job.description}
                    qualification={job.qualification}
                    about
                />
               ))
               }
                

            </div>
           </div>
        </div>
    );
}

export default About;