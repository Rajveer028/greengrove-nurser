import { StackHandler } from "@stackframe/stack";
import type { ComponentProps } from "react";

type HandlerProps = ComponentProps<typeof StackHandler>;

export default function Handler(props: HandlerProps) {
  return <StackHandler {...props} />;
}
