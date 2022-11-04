import client from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";
import consola from "consola";
import { SubscribePayload } from "~~/types/mail";

export default defineEventHandler(async (event) => {
  const { SENDGRID_API_KEY, SENDGRID_CONTACTS_API_URL } =
    useRuntimeConfig().public;

  client.setApiKey(SENDGRID_API_KEY);

  if (event.req.method !== "PUT") return { error: "Method not allowed" };

  const body: SubscribePayload = await useBody(event);

  const request = {
    url: SENDGRID_CONTACTS_API_URL,
    method: "PUT",
    body: body,
  } as ClientRequest;

  try {
    const response = await client.request(request);
    consola.success("🚀 email subscribed!");
    return response[0].statusCode;
  } catch (error) {
    consola.error("Subscription failed", error);
    throw new Error(error as string);
  }
});
