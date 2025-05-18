import BookstoresPage from "@/pages/education/Bookstores";
import EducationDetailsSelectPage from "@/pages/education/EducationDetailsSelect";
import EduCentersPage from "@/pages/education/EduCenters";

export const educationRoutes = [
  { path: "education-details-select", element: <EducationDetailsSelectPage /> },
  { path: "centers", element: <EduCentersPage /> },
  { path: "bookstores", element: <BookstoresPage /> },
];
