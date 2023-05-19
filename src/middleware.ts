import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/source"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
