export const CONSENT_KEY = "greybrainer_measurement_consent_v1";
export const GTM_ID = "GTM-TL933CTT";

export function consentPreferences(consent: string | null) {
  return {
    analytics: consent === "analytics" || consent === "both",
    marketing: consent === "marketing" || consent === "both",
    decided: ["necessary", "analytics", "marketing", "both"].includes(consent || ""),
  };
}

export function consentValue(analytics: boolean, marketing: boolean) {
  return analytics ? (marketing ? "both" : "analytics") : (marketing ? "marketing" : "necessary");
}

export function trackingAllowed(enabled: boolean, hostname: string, pathname: string, consent: string | null, category: "analytics" | "marketing" = "analytics") {
  return enabled && hostname === "movies.greybrain.in" &&
    !/^\/(studio|engine|hub|api)(\/|$)/.test(pathname) && consentPreferences(consent)[category];
}
