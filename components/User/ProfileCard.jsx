
'use client'
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import EditProfileModal from "./EditProfileModal";
import { User, GraduationCap, MapPin, Mail, Building, Briefcase, Code } from "lucide-react";

const ProfileCard = ({userProfileData}) => {

  // EditProfileModal only updates when userProfileData changes
  const memoizedEditProfileModal = useMemo(() => {
    return <EditProfileModal editProfileData={userProfileData} />
  }, [userProfileData]);

  return (
    <div className="w-[350px] md:w-[500px] lg:w-[500px] mx-auto">
      <Card className="shadow-2xl rounded-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Personal Information Section */}
        <CardHeader className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white py-8 px-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold tracking-wide">Personal Information</CardTitle>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4">
            <ProfileField 
              icon={<User className="h-4 w-4 text-blue-500" />}
              label="Firstname" 
              value={userProfileData?.FirstName} 
            />
            <ProfileField 
              icon={<User className="h-4 w-4 text-purple-500" />}
              label="Lastname" 
              value={userProfileData?.LastName} 
            />
            <ProfileField 
              icon={<Mail className="h-4 w-4 text-green-500" />}
              label="Email ID" 
              value={userProfileData?.EmailID} 
            />
          </div>
        </CardContent>

        {/* Educational Information Section */}
        <CardHeader className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-8 px-6 mt-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold tracking-wide">Educational Information</CardTitle>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4">
            <ProfileField 
              icon={<Building className="h-4 w-4 text-emerald-500" />}
              label="University" 
              value={userProfileData?.University} 
            />
            <ProfileField 
              icon={<Briefcase className="h-4 w-4 text-teal-500" />}
              label="Current Position" 
              value={userProfileData?.CurrentPosition} 
            />
            <ProfileField 
              icon={<MapPin className="h-4 w-4 text-cyan-500" />}
              label="Location" 
              value={userProfileData?.CurrentLocation} 
            />
            <ProfileField 
              icon={<Code className="h-4 w-4 text-indigo-500" />}
              label="Area of expertise" 
              value="Computer programming" 
            />
          </div>

          <div className="flex justify-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {memoizedEditProfileModal}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileField = React.memo(
  ({ icon, label, value }) => (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">{label}</Label>
      </div>
      <span className="text-gray-900 dark:text-gray-100 font-semibold bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
        {value || "Not specified"}
      </span>
    </div>
  )
);

export default React.memo(ProfileCard);
