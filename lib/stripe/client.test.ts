import { describe, it, expect } from "vitest";
import { buildCheckoutParams } from "@/lib/stripe/client";

const base = {
  plan: "pro" as const,
  businessId: "biz_123",
  email: "dueno@reformas.es",
  priceId: "price_pro",
  baseUrl: "https://curro.test",
};

describe("buildCheckoutParams", () => {
  it("permite códigos de descuento (Stripe los valida en su página de pago)", () => {
    expect(buildCheckoutParams(base).allow_promotion_codes).toBe(true);
  });

  it("NO envía `discounts` (es incompatible con allow_promotion_codes)", () => {
    const params = buildCheckoutParams(base);
    expect(params).not.toHaveProperty("discounts");
    expect(Object.keys(params)).not.toContain("discounts");
  });

  it("mantiene la suscripción con prueba, metadatos y datos fiscales", () => {
    const params = buildCheckoutParams(base);
    expect(params.mode).toBe("subscription");
    expect(params.line_items).toEqual([{ price: "price_pro", quantity: 1 }]);
    expect(params.success_url).toBe(
      "https://curro.test/onboarding/exito?plan=pro",
    );
    expect(params.cancel_url).toBe("https://curro.test/onboarding?cancelado=1");
    expect(params.customer_email).toBe("dueno@reformas.es");
    expect(params.billing_address_collection).toBe("required");
    expect(params.tax_id_collection).toEqual({ enabled: true });
    expect(params.subscription_data).toEqual({
      trial_period_days: 7,
      metadata: { business_id: "biz_123", plan: "pro" },
    });
    expect(params.metadata).toEqual({ business_id: "biz_123", plan: "pro" });
  });

  it("omite customer_email si no hay email", () => {
    expect(buildCheckoutParams({ ...base, email: null }).customer_email).toBeUndefined();
  });
});
