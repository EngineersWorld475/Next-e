'use client'
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import EditProfileModal from "./EditProfileModal";

const ProfileCard = ({userProfileData}) => {

  // EditProfileModal only updates when userProfileData changes
  const memoizedEditProfileModal = useMemo(() => {
    return <EditProfileModal editProfileData={userProfileData} />
  }, [userProfileData]);

  return (
    <Card className="w-[350px] md:w-[500px] lg:w-[500px] shadow-lg rounded-xl border border-gray-200">
      <CardHeader className="text-center bg-gray-100 dark:bg-gray-900 rounded-t-xl py-4">
        <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4">
          <ProfileField label="Firstname" value={userProfileData?.FirstName} />
          <ProfileField label="Lastname" value={userProfileData?.LastName} />
          <ProfileField label="Email ID" value={userProfileData?.EmailID} />
        </div>
      </CardContent>

      <CardHeader className="text-center bg-gray-100 dark:bg-gray-900 py-4">
        <CardTitle className="text-lg font-semibold">Educational Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4">
          <ProfileField label="University" value={userProfileData?.University} />
          <ProfileField label="Current Position" value={userProfileData?.CurrentPosition} />
          <ProfileField label="Location" value={userProfileData?.CurrentLocation} />
          <ProfileField label="Area of expertise" value="Computer programming" />
        </div>

        <div className="flex justify-center mt-6">
          {memoizedEditProfileModal}
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileField = React.memo(
  ({ label, value }) => (
    <div className="flex flex-col items-center md:flex-row lg:flex-row justify-between border-b pb-2">
      <Label className="text-gray-600 font-medium">{label}</Label>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  )
);

export default React.memo(ProfileCard);
