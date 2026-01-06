export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/create-invitation/:path*",
        "/invitations/:path*",
        "/profile/:path*",
    ]
};
