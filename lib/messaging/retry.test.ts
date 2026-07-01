import { describe, it, expect } from "vitest";
import { withRetry } from "@/lib/messaging/retry";

describe("withRetry", () => {
  it("devuelve el resultado al primer intento con éxito", async () => {
    let llamadas = 0;
    const r = await withRetry(async () => {
      llamadas++;
      return "ok";
    });
    expect(r).toBe("ok");
    expect(llamadas).toBe(1);
  });

  it("reintenta y acaba teniendo éxito", async () => {
    let llamadas = 0;
    const r = await withRetry(
      async () => {
        llamadas++;
        if (llamadas < 3) throw new Error("fallo temporal");
        return "recuperado";
      },
      { intentos: 3, esperaMs: 0 },
    );
    expect(r).toBe("recuperado");
    expect(llamadas).toBe(3);
  });

  it("lanza el último error si se agotan los intentos", async () => {
    let llamadas = 0;
    await expect(
      withRetry(
        async () => {
          llamadas++;
          throw new Error("siempre falla");
        },
        { intentos: 3, esperaMs: 0 },
      ),
    ).rejects.toThrow("siempre falla");
    expect(llamadas).toBe(3);
  });
});
