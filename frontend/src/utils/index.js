import { bannerImageOne,bannerImageThree, bannerImageTwo } from "./constant";
import { FaHome, FaThList } from "react-icons/fa";
import { IoIosContact } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";


export const bannerLists = [
    {
    id:1,
    image: bannerImageThree,
    title: "",
    subtitle: "",
    description: "",
  },
  {
    id: 2,
    image: bannerImageTwo,
    title: "",
    subtitle: "",
    description: "",
  },
  {
    id: 3,
    image:bannerImageOne,
    title: "",
    subtitle: "",
    description: "",
}
];

export const adminNavigation = [
  {
    name: "Dashboard", 
    href: "/admin", 
    icon: FaHome, 
    current: true 
  },  {
    name: "Jobs", 
    href: "/admin/jobs", 
    icon: GrUserWorker
  }, {
    name: "Categories", 
    href: "/admin/categories", 
    icon: FaThList
  }, {
    name: "Recruiters", 
    href: "/admin/recruiters", 
    icon: IoIosContact 
  }
];


export const recruiterNavigation = [
  {
    name: "Jobs", 
    href: "/admin/jobs", 
    icon: GrUserWorker
  }
];