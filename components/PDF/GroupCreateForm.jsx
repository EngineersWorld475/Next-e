"use client";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, X, Plus, Users, Mail } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { addGroup, getGroupsByUserId } from "@/store/group-slice";
import useUserId from "@/hooks/useUserId";
import { toast } from "sonner";
import { useCustomToast } from "@/hooks/useCustomToast";

const groupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  emails: z.array(z.string().email("Invalid email address")).min(1, "At least one email is required"),
});

const CreateGroup = ({ setIsMounting, listOfGroups, setListOfGroups }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();
  const userId = useUserId()

  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", emails: [] },
    mode: "onChange"
  });

  const emails = form.watch("emails");

  // Add Email
  const addEmail = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const email = emailInput.trim();

      if (!email) return;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        showToast({
          title: "Invalid email format",
          description: "Please enter a valid email address (e.g., john@example.com).",
          variant: "warning"
        });
        return;
      }

      if (!emails.includes(email)) {
        form.setValue("emails", [...emails, email]);
      }

      setEmailInput("");
    }
  }

  // User Removing Email from the textArea
  const removeEmail = useCallback((emailToRemove) => {
    form.setValue("emails", emails.filter((email) => email !== emailToRemove));
  }, [emails, form])

  // Create Group
  const createGroup = useCallback(async (data) => {
    setIsMounting(false)
    setIsSubmitting(true)

    if (!user?.token) {
      toast.error("Unauthorized! Please log in again.");
      return;
    }

    const formattedData = {
      name: data.name,
      emails: emails.map(email => ({
        Email: email,
        GroupEmailId: (listOfGroups.length > 0) ? listOfGroups[listOfGroups.length - 1].Groupmails[0].GroupEmailId + 1 : 1,
        GroupId: null,
      })),
    };
    try {
      const response = await dispatch(
        addGroup({
          userId: userId,
          groupName: formattedData?.name,
          tagsText: emails.join(","),
          authToken: user?.token,
        })
      ).unwrap();
      if (response === true) {
        const newGroup = {
          GroupId: (listOfGroups.length > 0) ? listOfGroups[listOfGroups.length - 1].GroupId + 1 : 1,
          GroupName: formattedData.name,
          Groupmails: formattedData.emails,
          Members: emails.length,
          CreatedDate: null,
        };

        setListOfGroups((prevGroups) => [...prevGroups, newGroup]);
        dispatch(getGroupsByUserId({ userId, authToken: user?.token }))

        showToast({
          title: "Group created successfully!",
          description: "Your new group has been added to the list.",
          variant: "success"
        });
        form.reset();
      } else {
        showToast({
          title: "Group already exists",
          description: "Try using a different name. This group is already added.",
          variant: "warning"
        });
      }
    } catch (error) {
      showToast({
        title: "Something went wrong",
        description: error?.message || "We couldn't create the group. Please try again.",
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, userId, emails, listOfGroups, dispatch, showToast, setListOfGroups, setIsMounting, form])

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden">
      <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-800/50">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span>Create New Group</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createGroup)} className="space-y-4 sm:space-y-6">
            {/* Group name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Group Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 sm:h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter group name..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emails */}
            <FormField
              control={form.control}
              name="emails"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Email Addresses</span>
                    </div>
                    {emails.length > 0 && (
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium w-fit">
                        {emails.length} {emails.length === 1 ? 'email' : 'emails'}
                      </span>
                    )}
                  </FormLabel>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all duration-200 bg-gray-50/50 dark:bg-gray-800/50">
                    {emails.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                        {emails.map((email, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm group hover:shadow-md transition-all duration-200 max-w-full"
                          >
                            <span className="flex-1 truncate mr-1">{email}</span>
                            <button
                              type="button"
                              onClick={() => removeEmail(email)}
                              className="ml-1 p-0.5 sm:p-1 hover:bg-white/20 rounded-full transition-colors duration-200 flex-shrink-0"
                            >
                              <X size={12} className="sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Textarea
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={addEmail}
                        rows={2}
                        className="bg-transparent resize-none p-0 text-sm sm:text-base text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:outline-none min-h-12 sm:min-h-16"
                        placeholder={emails.length === 0 ? "Type email address and press Enter to add..." : "Add another email..."}
                      />

                      <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Plus size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Press Enter to add</span>
                        <span className="sm:hidden">Enter to add</span>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Create Group</span>
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateGroup;