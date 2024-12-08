import { DocumentModel } from "../models/document.model";
import { api, baseUrl } from "../utils/api";

export namespace DocumentsEndpoint {
  export const list = api("/documents")
    .get.withSearch({
      limit: 4000,
      offset: 0,
    })
    .expectSchema(DocumentModel.ListResponse);

  export const create = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("collection", file));

    // Log entries for debugging
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return fetch(baseUrl + "/documents", {
      method: "POST",
      body: formData,
    });
  };

  export const remove = (id: string) =>
    api(`/documents/${id}`).delete.expect((v) => v.status);
}
