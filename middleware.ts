import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
    publicRoutes: ["/", "hotel-details/[id]", "/api/uploadthing"],
});

export const config = {
  matcher: [
    // Exclude Next.js internals & static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:js|css|json|jpg|jpeg|png|gif|svg|woff2?|ttf|eot|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
