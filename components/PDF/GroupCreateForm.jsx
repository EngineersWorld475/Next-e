"use client";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
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
          variant: "warning",
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
  const onSubmit = useCallback( async (data) => {
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
          variant: "success"
        });
      form.reset();
      } else {
        showToast({
          title: "You have already added this group. Please try a different group name",
          variant: "warning"
        })
      }
    } catch (error) {
      showToast({
        title: error?.message || "Something went wrong. Please try again.",
        variant: "error"
      })
    } finally {
      setIsSubmitting(false);
    }
  }, [user, userId, emails, listOfGroups, dispatch, showToast, setListOfGroups, setIsMounting, form])


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Group name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <input
                      className="w-full border p-2 rounded-md"
                      placeholder="Enter group name"
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
                  <FormLabel>Emails</FormLabel>
                  <div className="border rounded-md p-2 flex flex-col gap-2 items-start max-h-40 overflow-y-auto">
                    {emails.map((email, index) => (
                      <div key={index} className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-md w-full">
                        <span className="flex-1">{email}</span>
                        <button type="button" onClick={() => removeEmail(email)}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <Textarea
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={addEmail}
                      rows={1}
                      className="border-none outline-none w-full bg-transparent resize-none focus:outline-none focus:border-none"
                      placeholder="Type email and press Enter"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-center" />
                    Loading...
                  </>
                ) : (
                  'Add Group'
                )
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateGroup;
