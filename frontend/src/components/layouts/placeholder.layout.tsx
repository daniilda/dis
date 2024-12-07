import { FC, PropsWithChildren, ReactNode } from "react";
import Logo from "@/assets/logo.svg?react";

interface Props extends PropsWithChildren {
  title: string;
  description: ReactNode;
}

export const PlaceholderLayout: FC<Props> = (x) => {
  return (
    <>
      <div className="relative z-10 bg-background w-fit rounded-2xl mt-14">
        <h1 className="mb-3 font-extrabold text-5xl">{x.title}</h1>
        <p className="text-2xl">{x.description}</p>
        {x.children}
      </div>
      <Logo className="absolute inset-0 w-1/2 opacity-80 m-auto pointer-events-none" />
    </>
  );
};
