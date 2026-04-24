"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { resolveUrlOverride } from "@/lib/flyover/flag";

type Props = {
  defaultEnabled: boolean;
  flyover: ReactNode;
  fallback: ReactNode;
};

const noopSubscribe = () => () => {};

export default function FlyoverGate({ defaultEnabled, flyover, fallback }: Props) {
  const enabled = useSyncExternalStore(
    noopSubscribe,
    () => {
      const override = resolveUrlOverride(window.location.search);
      return override !== null ? override : defaultEnabled;
    },
    () => defaultEnabled,
  );

  return <>{enabled ? flyover : fallback}</>;
}
