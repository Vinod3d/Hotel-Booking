import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, {params} : {params : {hotelId:string}}){
    try {
        const hotelId = params.hotelId;
        const body = await req.json();
        const {userId} = await auth();

        if(!hotelId){
            return new NextResponse("Hotel ID is required", {status: 400});
        }

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const hotel = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {...body}
        })

        return NextResponse.json({ success: true, data: hotel });
    } catch (error) {
        console.log('Error at /api/hotel/hotelId', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
  
}


export async function DELETE (req: Request, {params} : {params : {hotelId:string}}){
    try {
        const hotelId = params.hotelId;
        const {userId} = await auth();

        if(!hotelId){
            return new NextResponse("Hotel ID is required", {status: 400});
        }

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const hotel = await prisma.hotel.delete({
            where: {
                id: hotelId
            }
        })

        return NextResponse.json({ success: true, data: hotel });
    } catch (error) {
        console.log('Error at /api/hotel/hotelId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
  
}