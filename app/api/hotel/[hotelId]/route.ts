import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, {params} : {params : {roomId:string}}){
    try {
        const body = await req.json();
        const {userId} = await auth();

        if(!params.roomId){
            return new NextResponse("Hotel ID is required", {status: 400});
        }

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const room = await prisma.room.update({
            where: {
                id: params.roomId
            },
            data: {...body}
        })

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.log('Error at /api/room/roomId', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
  
}


export async function DELETE (req: Request, {params} : {params : {roomId:string}}){
    try {
        const roomId = params.roomId;
        const {userId} = await auth();

        if(!roomId){
            return new NextResponse("Room ID is required", {status: 400});
        }

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const room = await prisma.room.delete({
            where: {
                id: roomId
            }
        })

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.log('Error at /api/room/roomId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
  
}