"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logoutCurrentUser() {
    const cookieStore = await cookies();
    cookieStore.delete("IPM_access_token");
    cookieStore.delete("IPM_refresh_token");
    redirect("/login");
}