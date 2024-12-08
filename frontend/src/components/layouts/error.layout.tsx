import { ErrorComponentProps } from "@tanstack/react-router";
import { FC, useLayoutEffect } from "react";
import { PlaceholderLayout } from "./placeholder.layout";
import { MainLayout } from "./main.layout";
import { HandleableError } from "@/utils/errors/handleable-error";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

export const ErrorLayout: FC<ErrorComponentProps> = (x) => {
  useLayoutEffect(() => {
    if (x.error instanceof HandleableError) {
      x.error.handle();
    }
  }, [x.error]);

  return (
    <MainLayout>
      <PlaceholderLayout
        title={x.error.name}
        description={
          <>
            {x.error.message}
            <CopyButton className="ml-2" text={JSON.stringify(x, null, 2)} />
          </>
        }
      >
        <Button onClick={() => x.reset()} className="w-fit mt-2">
          Retry
        </Button>
      </PlaceholderLayout>
    </MainLayout>
  );
};
