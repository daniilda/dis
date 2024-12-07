import { forwardRef, Ref, RefAttributes } from "react";

export const fixedForwardRef = <T, P = {}>(
  render: (props: P, ref: Ref<T>) => React.ReactNode,
): ((props: P & RefAttributes<T>) => React.ReactNode) =>
  forwardRef(render as any) as any;
