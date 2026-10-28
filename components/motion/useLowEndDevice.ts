"use client";

import { useSyncExternalStore } from "react";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

function detectLowEnd(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const nav = navigator as NavigatorWithHints;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const connection = nav.connection;
  const saveData = Boolean(connection?.saveData);
  const slowNet =
    connection?.effectiveType === "2g" || connection?.effectiveType === "3g";
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const weakMobile = isMobile && cores <= 4;
  return memory <= 2 || weakMobile || saveData || Boolean(slowNet);
}

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

export function useLowEndDevice(): boolean {
  return useSyncExternalStore(subscribe, detectLowEnd, () => false);
}
