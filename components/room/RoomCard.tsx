'use client'

import {Hotel, Room, Booking} from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image"
import AmenityItem from "../AmenityItem"
import { Bed, BedDouble, Castle, Home, Mountain, ShieldCheck, Snowflake, Trees, UtensilsCrossed, Waves, Wifi } from "lucide-react"

interface RoomCardProps {
    room: Room
    hotel?: Hotel & {
        rooms: Room[]
    }
    booking?: Booking | null
}

const RoomCard = ({hotel, room, booking = []}: RoomCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{room.title}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="aspect-square overflow-hidden relative h-[200px] rounded-ld">
                    <Image
                        fill
                        src={room.image}
                        alt="room"
                        className="object-cover"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 content-start text-sm">
                    <AmenityItem><Bed className="h-4 w-4"/>{room.bedCount} Bed{'(s)'}</AmenityItem>
                    <AmenityItem><Bed className="h-4 w-4"/>{room.guestCount} Guest{'(s)'}</AmenityItem>
                    <AmenityItem><Bed className="h-4 w-4"/>{room.bathroomCount} Bathroom{'(s)'}</AmenityItem>
                    {!!room.kingBed && <AmenityItem><BedDouble className="h-4 w-4"/>{room.kingBed} King Bed{'(s)'}</AmenityItem>}
                    {!!room.queenBed && <AmenityItem><Bed className="h-4 w-4"/>{room.queenBed} Queen Bed{'(s)'}</AmenityItem>}
                    {!!room.roomService && <AmenityItem><UtensilsCrossed className="h-4 w-4"/>{room.roomService} Room Service{'(s)'}</AmenityItem>}
                    {!!room.TV && <AmenityItem><UtensilsCrossed className="h-4 w-4"/>{room.TV} TV{'(s)'}</AmenityItem>}
                    {!!room.balcony && <AmenityItem><Home className="h-4 w-4"/>{room.balcony} Balcony{'(s)'}</AmenityItem>}
                    {!!room.freeWifi && <AmenityItem><Wifi className="h-4 w-4"/>{room.freeWifi}Free Wifi{'(s)'}</AmenityItem>}
                    {!!room.cityView && <AmenityItem><Castle className="h-4 w-4"/>{room.cityView} Air Conditioning{'(s)'}</AmenityItem>}
                    {!!room.oceanView && <AmenityItem><Waves className="h-4 w-4" />Ocean View</AmenityItem>}
                    {!!room.forestView && <AmenityItem><Trees className="h-4 w-4" />Forest View</AmenityItem>}        
                    {!!room.mountainView && <AmenityItem><Mountain className="h-4 w-4" />Mountain View</AmenityItem>}

                    {!!room.airCondition && <AmenityItem><Snowflake className="h-4 w-4" />Air Conditioning</AmenityItem>}
                    {!!room.soundProofed && <AmenityItem><ShieldCheck className="h-4 w-4" />Soundproofed</AmenityItem>}
                </div>
            </CardContent>
        </Card>
    )
}

export default RoomCard