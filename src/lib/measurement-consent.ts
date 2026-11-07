export const CONSENT_KEY = "greybrainer_measurement_consent_v1";
export const GTM_ID = "GTM-TL933CTT";

export function trackingAllowed(enabled: boolean, hostname: string, pathname: string, consent: string | null) {
  return enabled && hostname === "movies.greybrain.in" &&
    !/^\/(studio|engine|hub|api)(\/|$)/.test(pathname) && consent === "analytics";
}
