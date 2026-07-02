import { describe, it, expect } from "vitest";
import { parseAdminEmails, esSuperadmin } from "@/lib/admin/access";

describe("parseAdminEmails", () => {
  it("parsea, recorta y normaliza a minúsculas", () => {
    const set = parseAdminEmails(" Uno@X.com , DOS@x.com ,, tres@x.com ");
    expect(set).toEqual(new Set(["uno@x.com", "dos@x.com", "tres@x.com"]));
  });

  it("devuelve un set vacío si no hay valor", () => {
    expect(parseAdminEmails(undefined).size).toBe(0);
    expect(parseAdminEmails(null).size).toBe(0);
    expect(parseAdminEmails("").size).toBe(0);
    expect(parseAdminEmails("   ").size).toBe(0);
  });
});

describe("esSuperadmin", () => {
  const lista = "javierpatoprieto@gmail.com, otro@curro.es";

  it("admite emails de la allowlist (case-insensitive, con espacios)", () => {
    expect(esSuperadmin("javierpatoprieto@gmail.com", lista)).toBe(true);
    expect(esSuperadmin("JavierPatoPrieto@Gmail.com", lista)).toBe(true);
    expect(esSuperadmin("  otro@curro.es  ", lista)).toBe(true);
  });

  it("rechaza emails que no están en la lista", () => {
    expect(esSuperadmin("intruso@x.com", lista)).toBe(false);
  });

  it("es fail-closed: sin ADMIN_EMAILS nadie es superadmin", () => {
    expect(esSuperadmin("javierpatoprieto@gmail.com", undefined)).toBe(false);
    expect(esSuperadmin("javierpatoprieto@gmail.com", "")).toBe(false);
    expect(esSuperadmin("javierpatoprieto@gmail.com", "   ")).toBe(false);
  });

  it("rechaza email nulo o vacío", () => {
    expect(esSuperadmin(null, lista)).toBe(false);
    expect(esSuperadmin(undefined, lista)).toBe(false);
    expect(esSuperadmin("", lista)).toBe(false);
  });
});
