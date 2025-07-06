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
    <div className="w-full max-w-2xl mx-auto px-0 sm:px-6 lg:px-8">
      <Card className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {/* Profile Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 md:py-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-2xl font-bold">
                  {userProfileData?.FirstName} {userProfileData?.LastName}
                </h2>
                <p className="text-blue-100 mt-1">
                  {userProfileData?.CurrentPosition || "Professional"}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Personal Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField 
                icon={<User className="h-4 w-4 text-blue-500" />}
                label="First Name" 
                value={userProfileData?.FirstName} 
              />
              <ProfileField 
                icon={<User className="h-4 w-4 text-purple-500" />}
                label="Last Name" 
                value={userProfileData?.LastName} 
              />
              <ProfileField 
                icon={<Mail className="h-4 w-4 text-green-500" />}
                label="Email" 
                value={userProfileData?.EmailID} 
                isEmail={true}
              />
              <ProfileField 
                icon={<MapPin className="h-4 w-4 text-red-500" />}
                label="Location" 
                value={userProfileData?.CurrentLocation} 
              />
            </div>
          </div>

          {/* Educational Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Educational Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField 
                icon={<Building className="h-4 w-4 text-emerald-500" />}
                label="University" 
                value={userProfileData?.University} 
              />
              <ProfileField 
                icon={<Briefcase className="h-4 w-4 text-teal-500" />}
                label="Position" 
                value={userProfileData?.CurrentPosition} 
              />
              <ProfileField 
                icon={<Code className="h-4 w-4 text-indigo-500" />}
                label="Area of Expertise" 
                value="Computer Programming" 
              />
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-center">
              {memoizedEditProfileModal}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileField = React.memo(
  ({ icon, label, value, isEmail = false }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </Label>
          <p className={`mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 ${
            isEmail ? 'break-all' : 'truncate'
          }`}>
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  )
);

export default React.memo(ProfileCard);