"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

const groupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  emails: z.array(z.string().email("Invalid email address")).min(1, "At least one email is required"),
});

const CreateGroup = () => {
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", emails: [] },
  });

  const addEmail = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (emailInput.trim() === "") return;

      const email = emailInput.trim();
      if (!/\S+@\S+\.\S+/.test(email)) {
        return alert("Invalid email format");
      }

      if (!emails.includes(email)) {
        setEmails([...emails, email]);
      }

      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const onSubmit = (data) => {
    console.log("Form Data:", { ...data, emails });
  }; 

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormItem>
              <FormLabel>Emails</FormLabel>
              <div className="border rounded-md p-2 flex flex-col gap-2 items-start max-h-40 overflow-y-auto">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-md w-full">
                    <span className="flex-1">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Textarea
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={addEmail}
                  rows={1}
                  className="border-none outline-none w-full bg-transparent resize-none"
                  placeholder="Type email and press Enter"
                />
              </div>
              <FormMessage />
            </FormItem>

            <Button type="submit" className="w-full">
              Add Group
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateGroup;
