"use client";

import { UserDetailsFormData } from "@/schema/user-details";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { ReactNode } from "react";
import { Button } from "../ui/button";

export type UserDetailsFormProps = {
  form: UseFormReturn<UserDetailsFormData>;
  onSubmit: SubmitHandler<UserDetailsFormData>;
  submitButtonContent?: ReactNode;
};

export const UserDetailsForm = ({
  form,
  onSubmit,
  submitButtonContent = "Submit",
}: UserDetailsFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your nickname" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{submitButtonContent}</Button>
      </form>
    </Form>
  );
};
