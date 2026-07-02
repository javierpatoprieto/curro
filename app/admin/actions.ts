"use server";

import { redirect } from "next/navigation";
import {
  passwordCorrecta,
  iniciarSesionAdmin,
  cerrarSesionAdmin,
} from "@/lib/admin/auth";

export async function entrarAdmin(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  if (!passwordCorrecta(pw)) {
    redirect("/admin/login?error=1");
  }
  await iniciarSesionAdmin();
  redirect("/admin");
}

export async function salirAdmin() {
  await cerrarSesionAdmin();
  redirect("/admin/login");
}
