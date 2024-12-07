import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useCallback, useState } from "react";
import { AuthService } from "@/stores/auth.service";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});
type FormSchema = z.infer<typeof formSchema>;

const Page = () => {
  const [isError, setIsError] = useState(false);
  const search = Route.useSearch();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(async (data: FormSchema) => {
    setIsError(false);
    const ok = await AuthService.login(data);
    if (ok) {
      router.history.push(search.redirect ?? "/");
    } else {
      setIsError(true);
    }
  }, []);

  const isOpen =
    form.formState.isSubmitting ||
    !form.formState.isSubmitSuccessful ||
    isError;

  return (
    <Dialog open={isOpen}>
      <DialogContent disableClose>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Добро пожаловать
            <br />В панель администратора Firsty!
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Field
              control={form.control}
              component={(x) => <Input {...x} />}
              name="username"
              label="Имя пользователя"
            />
            <Field
              control={form.control}
              component={(x) => (
                <Input type="password" autoComplete="current-password" {...x} />
              )}
              name="password"
              label="Пароль"
            />
            {isError && (
              <p
                className="text-red-500 text-center"
                aria-live="polite"
                aria-atomic
              >
                Неправильное имя или пароль
              </p>
            )}
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full"
                loading={form.formState.isSubmitting}
              >
                Войти
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Route = createFileRoute("/login")({
  component: Page,
  validateSearch: zodSearchValidator(
    z.object({
      redirect: fallback(z.string().optional(), undefined),
    }),
  ),
});
