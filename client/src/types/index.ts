import { StaticImageData } from "next/image";

export type TimelineItemType = {
  id: number;
  title: string;
  description: string;
  time: string;
};

export type SatrtUpCardDataType = {
  id: number;
  title: string;
  description: string;
  imgSrc: StaticImageData;
  link: string;
};

export type RegisterIdeaType = {
  fatherName: string;
  associate?: string;
  country?: string;
  state?: string;
  city: string;
  career: string;
  maritalStatus?: string;
  gender: string;
  mobileNumber: string;
  age: number;
  branchOfStudy: string;
  branchDetail?: string;
  ideaTitle: string;
  ideaDescription: string;
};

export type UserIdeaType = {
  id: string;
  ownerId: string;
  reportId?: string;
  fatherName: string;
  associate?: string;
  country?: string;
  state?: string;
  city: string;
  career: string;
  maritalStatus?: string;
  gender: string;
  mobileNumber: string;
  age: number;
  branchOfStudy: string;
  branchDetail?: string;
  ideaTitle: string;
  ideaDescription: string;
  createdAt?: Date;
};

export interface Report {
  id?: string;
  ideaTitle: string;
  ideaId: string;
  ownerId: string;
  stages: {
    _id?: string;
    stageTitle: string;
    stageStatus: "Completed" | "In Progress" | "Not Started";
    tasks: {
      _id?: string;
      taskTitle: string;
      taskStatus: string;
      description?: string;
    }[];
  }[];
  createdAt?: Date;
}

export interface UserType {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  createdAt?: string;
  reports?: string[];
  ideas?: string[];
  profile: {
    fullName: string;
    bio?: string;
    avatar?: string;
  };
  settings?: {
    language?: "en" | "fa";
    notifications?: boolean;
  };
}

export interface SelectedTaskType {
  _id?: string;
  taskTitle: string;
  taskStatus: string;
  description?: string;
}

export interface CostType {
  id?: string;
  userId: string;
  reportId: string;
  selectedServices: {
    id?: string;
    serviceName: string;
    paid?: boolean;
    price: number;
    expert?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceType {
  id?: string;
  serviceName: string;
  paid?: boolean;
  price: number;
  expert?: string;
}
