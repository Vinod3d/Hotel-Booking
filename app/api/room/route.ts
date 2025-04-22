import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (req: Request){
    try {
        const body = await req.json();
        const  {userId} = await auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401});
        }

        const room = await prisma.room.create({
            data: {
                ...body,
            },
        });

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.log('Error at /api/room POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}