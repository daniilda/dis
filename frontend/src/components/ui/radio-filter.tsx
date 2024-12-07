import { observer } from "mobx-react-lite";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { cn } from "@/utils/cn";

interface Props<T extends string> extends PropsWithChildren {
  value: T;
  onChange?: (value: T) => void;
}

const RadioContext = createContext<{
  value: string;
  onChange: (value: string) => void;
} | null>(null);

export const RadioFilterOption: FC<
  PropsWithChildren<{ value: string; count?: number }>
> = observer((x) => {
  const ctx = useContext(RadioContext)!;

  const selected = x.value === ctx.value;

  return (
    <div className="group">
      <RadioGroupItem
        value={x.value}
        id={x.value}
        className="sr-only [&:focus-visible+label]:outline-none [&:focus-visible+label]:ring-2 [&:focus-visible+label]:ring-ring [&:focus-visible+label]:ring-offset-2"
      />
      <label
        htmlFor={x.value}
        className={cn(
          "inline-flex space-x-1 items-center justify-center whitespace-nowrap rounded-sm px-3 h-8 text-sm font-medium ring-offset-background transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          selected && "bg-primary text-primary-foreground shadow-sm",
        )}
      >
        <span>{x.children}</span>
        {x.count ? (
          <span
            className={cn(
              "size-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-bold text-center",
              selected && "",
            )}
          >
            {x.count}
          </span>
        ) : (
          <></>
        )}
      </label>
    </div>
  );
});

export const RadioFilter = observer(<T extends string>(x: Props<T>) => {
  return (
    <RadioContext.Provider
      value={{ value: x.value, onChange: (v) => x.onChange?.(v as T) }}
    >
      <RadioGroup
        defaultValue={x.value}
        onValueChange={x.onChange}
        className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-fit"
      >
        {x.children}
      </RadioGroup>
    </RadioContext.Provider>
  );
});
