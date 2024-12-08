import { toast } from "sonner";

/**
 * Base class for any frontend errors, please do not throw anything except descendants of that class
 */
export abstract class HandleableError extends Error {
  protected constructor(
    message: string,
    private description?: string,
  ) {
    super(message);

    this.timer = setTimeout(() => {
      this.showErrorIfNotHandled();
    }, 300);
  }

  timer: NodeJS.Timeout;
  handled = false;

  /**
   * Marks error as handled
   */
  handle() {
    this.handled = true;
    clearTimeout(this.timer);
  }

  /**
   * Shows toast with error if it was not handled yet
   *
   * Use it in your global exception handler
   */
  showErrorIfNotHandled() {
    if (!this.handled) {
      this.handle();

      console.error(
        "This HandleableError had to show toast on it's own - this is a bad sign, " +
          "please find place where catched error is silently ignored and fix that",
        this,
      );

      this.showError();
    }
  }

  showError() {
    toast.error(this.description ? this.message : "Ошибка", {
      description: this.description ?? this.message,
    });
  }
}
