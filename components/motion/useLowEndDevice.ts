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

/**
 * Skip heavy motion (frame sequence, Lenis) only on clear resource/network constraints.
 *
 * Do NOT gate on hardwareConcurrency alone: Safari/iOS often reports 4 (privacy /
 * bucketing), which falsely disabled the hero dig animation on essentially every phone.
 */
function detectLowEnd(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const nav = navigator as NavigatorWithHints;
  const memory = nav.deviceMemory;
  const connection = nav.connection;
  const saveData = Boolean(connection?.saveData);
  const slowNet =
    connection?.effectiveType === "2g" || connection?.effectiveType === "3g";
  // deviceMemory is Chromium-only; missing ⇒ treat as OK (iOS Safari).
  const lowMemory = typeof memory === "number" && memory <= 2;
  return lowMemory || saveData || Boolean(slowNet);
}

function subscribe(onStoreChange: () => void) {
  const nav = navigator as NavigatorWithHints;
  const connection = nav.connection as
    | (NetworkInformationLike & {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      })
    | undefined;

  if (!connection?.addEventListener || !connection.removeEventListener) {
    return () => {};
  }

  const onChange = () => onStoreChange();
  connection.addEventListener("change", onChange);
  return () => connection.removeEventListener?.("change", onChange);
}

export function useLowEndDevice(): boolean {
  return useSyncExternalStore(subscribe, detectLowEnd, () => false);
}
