"use client";
import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { UploadButton, UploadDropzone } from "@/utils/uploadthings";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  bedCount: z.number().min(1, { message: "Bed count is required" }),
  guestCount: z.number().min(1, { message: "Guest count is required" }),
  bathroomCount: z.number().min(1, { message: "Bathroom count is required" }),
  kingBed: z.number().min(0),
  queenBed: z.number().min(0),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  breakfastPrice: z.number().optional(),
  roomPrice: z.number().min(1, {
    message: "Room price is required",
  }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

export const AddRooms = ({
  hotel,
  room,
  handleDialogueOpen,
}: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakfastPrice: 0,
      roomPrice: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
    },
  });

  const handleImageDelete = (image: string) => {
    setImageDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast.success("Image Deleted successfully", {
            style: {
              background: "#4CAF50",
              color: "white",
            },
          });
        }
      })
      .catch((error) => {
        toast.error(`Upload failed! ${error.message}`, {
          style: {
            background: "#FF4C4C",
            color: "white",
          },
        });
      })
      .finally(() => {
        setImageDeleting(false);
      });
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title</FormLabel>
                <FormDescription>Provide a room name</FormDescription>
                <FormControl>
                  <Input placeholder="Double Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description</FormLabel>
                <FormDescription>
                  Is there anything special about this room
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view ot the ocean while in the room!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              What makes this room a good choise
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FormField
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>24hr Room Services</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TV"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freeWifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Free Wifi</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>City View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ocean View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Forest View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mountain View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air Condition</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Sound Proofed</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="image"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>
                  Choose an image that will showcase your hotel nicely.
                </FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                      <Image
                        fill
                        src={image}
                        alt="hotel image"
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"ghost"}
                        className="absolute right-[-12px] top-0 cursor-pointer"
                        onClick={() => handleImageDelete(image)}
                      >
                        {imageIsDeleting ? <Loader2 /> : <XCircle />}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          setImage(res[0].url);
                          toast.success("Image uploaded successfully", {
                            style: {
                              background: "#4CAF50",
                              color: "white",
                            },
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed! ${error.message}`, {
                            style: {
                              background: "#FF4C4C",
                              color: "white",
                            },
                          });
                        }}
                      />

                      <p className="text-sm text-gray-500 my-2">or</p>

                      <UploadDropzone
                        endpoint="imageUploader"
                        className="w-full h-32 flex items-center justify-center border border-dashed rounded-lg cursor-pointer"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          setImage(res[0].url);
                          toast.success("Image uploaded successfully", {
                            style: {
                              background: "#4CAF50",
                              color: "white",
                            },
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed! ${error.message}`, {
                            style: {
                              background: "#FF4C4C",
                              color: "white",
                            },
                          });
                        }}
                      />
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                  control={form.control}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price in USD</FormLabel>
                      <FormDescription>State the price for staying in this room for 24hrs. </FormDescription>
                      <FormControl>
                        <Input type="number" min={0} {...field}/>
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            <div className="flex-1 flex flex-col gap-6">Part 2</div>
          </div>
        </form>
      </Form>
    </div>
  );
};
