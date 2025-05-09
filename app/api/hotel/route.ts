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

        const hotel = await prisma.hotel.create({
            data: {
                ...body,
                userId,
            },
        });

        return NextResponse.json({ success: true, data: hotel });
    } catch (error) {
        console.log('Error at /api/hotel POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}