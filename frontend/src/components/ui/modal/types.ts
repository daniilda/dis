import React, { ReactElement } from "react";

export type Defined =
  | number
  | string
  | Record<string, unknown>
  | unknown[]
  | boolean
  | symbol;
type None = null | undefined;
type TypeError<What extends string> = What | never;

export type ModalAutoProps<TResult> = [TResult] extends [Defined]
  ? {
      done(result: TResult | undefined): void;
      refElement?: React.RefObject<HTMLDivElement>;
    }
  : { done(): void };

export type ModalProps<
  TProps = undefined,
  TResult = undefined,
> = TProps extends Defined
  ? TProps extends None
    ? TypeError<"TProps can be either undefined or not-nullable type">
    : TProps & ModalAutoProps<TResult>
  : ModalAutoProps<TResult>;

export type ModalFC<TProps = undefined, TReturn = undefined> = (
  props: ModalProps<TProps, TReturn>,
) => ReactElement;

export type UnwrapModalProps<TModal extends ModalFC<any, any>> =
  TModal extends ModalFC<infer TProps, any> ? TProps : never;
export type UnwrapModalReturn<TModal extends ModalFC<any, any>> =
  TModal extends ModalFC<any, infer TReturn> ? TReturn : never;

export type ModalRequest<
  TProps = Record<string, unknown>,
  TResult extends Defined = Defined,
> = {
  readonly component: ModalFC<TProps, TResult>;
  readonly props: TProps;
  readonly callback: (_: TResult | undefined) => void;
  readonly key: number;
  closed: boolean;
};
