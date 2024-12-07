import { AuthDto } from "../models/auth.model";
import { api } from "../utils/api";

export namespace AuthEndpoint {
  export const token = (username: string, password: string) =>
    api("/get_token")
      .get.withHeader(
        "Authorization",
        `Basic ${btoa(`${username}:${password}`)}`,
      )
      .expectSchema(AuthDto.Token);

  export const me = () => api("/get_user").get.expectSchema(AuthDto.User);
}
