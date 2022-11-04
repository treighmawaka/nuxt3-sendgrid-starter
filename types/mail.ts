export type FormField = "name" | "email" | "message";

export interface SubscribePayload {
	contacts: SubscribeContact[];
}

export interface SubscribeContact {
	first_name: string;
	email: string;
}

export interface BaseForm {
  name: string;
  email: string;
}

export interface BaseFormState {  
  errors: FormField[];
  isProcessing: boolean;  
}