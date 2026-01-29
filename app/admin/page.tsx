import { redirect } from "next/navigation";
import { isAdminAuthedServer } from "@/lib/auth";

export default function AdminIndex() {
  if (!isAdminAuthedServer()) redirect("/admin/login");
  redirect("/admin/pois");
}
