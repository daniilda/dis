import { toast } from "sonner";
import { HandleableError } from "./handleable-error";

export class ScriptError extends HandleableError {
  /**
   * Class for frontend-side errors that do not relate to backend or something external
   *
   * Use this class when checking things inside view-models and other frontend-related places,
   * do not use this class for any external errors like HTTP-request failures.
   * */
  constructor(message: string) {
    super(message);
  }

  private errorTitle = "Script error";

  override showError() {
    toast.error(this.errorTitle, {
      description: this.message,
    });
  }
}
