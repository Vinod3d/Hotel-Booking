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
import { useEffect, useState } from "react";
import { UploadButton, UploadDropzone } from "@/utils/uploadthings";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "../ui/button";
import { Eye, Loader2, PencilLine, PlusIcon, Terminal, Trash, XCircle } from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {AddRooms} from "../room/AddRooms";
import RoomCard from "../room/RoomCard";
import { Separator } from "../ui/separator";


interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be atleast 3 character long" }),
  description: z
    .string()
    .min(10, { message: "Description must be atleast 10 character long" }),
  image: z.string().url({ message: "Invalid image URL" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z
    .string()
    .min(10, { message: "Description must be atleast 10 character long" }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundry: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeeShop: z.boolean().optional(),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageDeleting] = useState(false);
  const [IsHotelDeleting, setIsHotelDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false,
    },
  });

  useEffect(()=>{
    if(typeof image === 'string'){
      form.setValue('image', image, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        const selectedCountry = value.country;
        if (selectedCountry) {
          const countryStates = getCountryStates(selectedCountry);
          setStates(countryStates);
        } else {
          setStates([]); // Reset if no country is selected
        }
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]); // Depend only on form.watch

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country" || name === "state") {
        const selectedCountry = value.country;
        const selectedState = value.state;

        if (selectedCountry && selectedState) {
          const stateCities = getStateCities(selectedCountry, selectedState);
          setCities(stateCities);
        } else {
          setCities([]); // Reset if no country or state is selected
        }
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if(hotel){
      axios.patch(`/api/hotel/${hotel.id}`, values).then((res)=>{
        toast.success("🎉 Hotel updated", {
          style: {
            background: "#4CAF50",
            color: "white",
          },
        });
        router.push(`/hotel/${res.data.data.id}`)
        setIsLoading(false)
      }).catch((err)=>{
        console.log(err)
        toast.error(
          "Something went wrong", {
            style: {
              background: "#FF0000",
              color: "white",
            }
          }
        )
        setIsLoading(false)
      })
    } else{
      axios.post('/api/hotel', values).then((res)=>{
        toast.success("🎉 Hotel created", {
          style: {
            background: "#4CAF50",
            color: "white",
          },
        });
        router.push(`/hotel/${res.data.data.id}`)
        setIsLoading(false)
      }).catch((err)=>{
        console.log(err)
        toast.error(
          "Something went wrong", {
            style: {
              background: "#FF0000",
              color: "white",
            }
          }
        )
        setIsLoading(false)
      })
    }                                  
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms)=>{
    setIsHotelDeleting(true);
    const getImageKey = (src: string)=>src.substring(src.lastIndexOf('/') + 1)

    try {
      const imageKey = getImageKey(hotel.image)
      await axios.post('/api/uploadthing/delete', {imageKey})
      await axios.delete(`/api/hotel/${hotel.id}`)
      toast.success("Hotel deleted", {
        style: {
          background: "#4CAF50",
          color: "white",
        }
      })
      setIsHotelDeleting(false)
      router.push(`/hotel/new`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Hotel deletion could not be completed! ${error.message}`, {
        style: {
          background: "#FF4C4C",
          color: "white",
        },
      });
      setIsHotelDeleting(false)
    }
  }

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

  const handleDialogueOpen = ()=>{
    setOpen(prev=> !prev)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {hotel ? "Update your hotel" : "Describe your hotel"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Hotel Title</FormLabel>
                    <FormDescription>Provide your hotel name</FormDescription>
                    <FormControl>
                      <Input placeholder="Beach Hotel" {...field} />
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
                    <FormLabel> Hotel Description</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Beach Hotel is parked with many awesome amenities"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>
                  Choose Amenities popular in your hotel
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Spa</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bar</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Laundry Facilities</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Restaurant</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Shopping</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeParking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>FreeParking</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bikeRental"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>BikeRental</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeWifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Free Wifi</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="movieNights"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Movie Nights</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmingPool"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Swimming Pool</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coffeeShop"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Coffee Shop</FormLabel>
                        <FormMessage />
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
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>
                      <FormDescription>
                        In Which country is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a Country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>
                        In Which State is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a State "
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City</FormLabel>
                    <FormDescription>
                      In Which City is your property located
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background w-full">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a City "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description</FormLabel>
                    <FormDescription>
                      Provide a detailed location description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Location at the very end of the beach road!"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {hotel && !hotel.rooms.length && <Alert className="bg-indigo-600 text-white">
                <Terminal className="h-4 w-4 stroke-white" />
                <AlertTitle>One last step!</AlertTitle>
                <AlertDescription className="text-white">
                  Your hotel was created successfully
                  <div>Please add some rooms to complete your hotel setup</div>
                </AlertDescription>
              </Alert>}
              <div className="flex justify-between gap-2 flex-wrap">
                {/* Delete */}
                 {hotel && <Button onClick={()=> handleDeleteHotel(hotel)} variant='ghost' type="button" className="max-w-[150px] cursor-pointer" disabled={IsHotelDeleting || isLoading}>
                    {IsHotelDeleting ? <><Loader2 className="mr-2 h-4 w-4"/> Deleting</> : <><Trash className="mr-2 h-4 w-4"/> Delete</>}
                  </Button>}

                {hotel && <Button onClick={()=>router.push(`/hotel-details/${hotel.id}`)} variant='ghost' type="button">
                    <Eye className="mr-2 h-4 w-4"/> View
                </Button>}

                {hotel && <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className="cursor-pointer ">
                    <div className="flex align-items-center justify-content-center">
                      <PlusIcon className="mr-2 h-4 w-4"/> Add Room
                    </div>
                  </DialogTrigger>
                  <DialogContent className="!max-w-[900px] !w-[90%]">
                    <DialogHeader className="px-2">
                      <DialogTitle>Add Rooms</DialogTitle>
                      <DialogDescription>
                        Add details about a room in your hotel.
                      </DialogDescription>
                    </DialogHeader>
                    <AddRooms hotel={hotel} handleDialogueOpen={handleDialogueOpen}/>
                  </DialogContent>
                </Dialog>}

                {/* Update and Create */}
                {hotel ? 
                <Button className="max-w-[150px] cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4"/>Updating</> : <><PencilLine className="mr-2 h-4 w-4"/> Update</>}
                </Button> : 
                <Button className="max-w-[150px] cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4"/>Creating</> : <><PencilLine className="mr-2 h-4 w-4"/> Create Hotel</>}
                </Button>}
              </div>
              {hotel && !!hotel.rooms.length && <div>
                <Separator className="my-4" />
                  <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                  <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                    {hotel.rooms.map((room) => {
                      return <RoomCard key={room.id} room={room} hotel={hotel} />;
                    })}
                  </div>
                </div>}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
