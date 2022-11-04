import client from "@sendgrid/mail";
import consola from "consola";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
	const { SENDGRID_API_KEY } = config.public;

	client.setApiKey(SENDGRID_API_KEY);

	if (event.req.method !== "POST") return { error: "Method not allowed" };
  
	const payload = (await useBody(event)) as client.MailDataRequired;	

	try {
		const response = await client.send(payload);
    consola.success("🚀 Message sent");
		return response[0].statusCode;
	} catch (error) {
		consola.error("Send failed", error);
    throw new Error(error as string);
	}
});
