"use client";

import { UserDetailsFormData } from "@/schema/user-details";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { ChangeEventHandler, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Pencil1Icon, SunIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { generateDataUrlFromFile } from "@/lib/avatar";

import styles from "@/styles/user-details-form.module.scss";

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
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const [imagePreviewDataUrl, setImagePreviewDataUrl] = useState<string | null>(
    null
  );

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    setIsCreatingPreview(true);
    const previewDataUrl = await generateDataUrlFromFile(file);
    setImagePreviewDataUrl(previewDataUrl);
    form.setValue("pictureUrl", previewDataUrl);
    setIsCreatingPreview(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-6">
          {/* <label htmlFor="avatar-image"> */}
          <div
            className={cn(
              "w-16 h-16 rounded-full bg-neutral-950 relative overflow-hidden",
              styles.userPictureContainer
            )}
          >
            <input
              hidden
              id="avatar-image"
              name="avatar-image"
              type="file"
              onChange={onFileInputChange}
              accept="image/*"
            />
            {imagePreviewDataUrl && (
              <Image
                src={imagePreviewDataUrl}
                alt={"selected avatar"}
                width={64}
                height={64}
              />
            )}
            <label
              htmlFor="avatar-image"
              // type="button"
              className={cn(
                "w-full h-full absolute top-0 left-0 flex flex-col gap-1 items-center justify-center bg-neutral-900/70",
                styles.userPictureLabel,
                (!!imagePreviewDataUrl || isCreatingPreview) && "hidden"
              )}
              // name="Edit"
            >
              <Pencil1Icon className="w-5 h-5" />
              <span className="text-xs">Edit</span>
            </label>
            {isCreatingPreview && (
              <div className="absolute w-full h-full top-0 left-0 bg-neutral-900/70 grid place-content-center">
                <SunIcon className="animate-spin" />
              </div>
            )}
          </div>
          {/* </label> */}
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
        </div>
        <Button type="submit">{submitButtonContent}</Button>
      </form>
    </Form>
  );
};
