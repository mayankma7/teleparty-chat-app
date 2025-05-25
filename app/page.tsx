"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { RoomCodeFormData, roomCodeSchema } from "@/schema/room-code";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Home() {
  const router = useRouter();

  const form = useForm<RoomCodeFormData>({
    resolver: zodResolver(roomCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onCreateRoom = () => {
    router.push("/room");
  };

  const onSubmit = (data: RoomCodeFormData) => {
    router.push(`/room?id=${data.code}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900">
      <div className="flex flex-col gap-8 px-12 py-24 rounded-lg dark:bg-neutral-800">
        <Button onClick={onCreateRoom}>Create Room</Button>
        <div className="flex px-4 gap-4 items-center">
          <hr className="flex-1" />
          OR
          <hr className="flex-1" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="roomId"
                      className="flex-1"
                      placeholder="Enter code"
                      aria-label="Enter existing room code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Join Existing Room</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
