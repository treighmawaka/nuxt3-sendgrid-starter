<script setup lang="ts">
import { getNamePart, isEmail } from "~~/utils/misc";
import type { BaseForm, BaseFormState, FormField } from "~~/types/mail";

interface ContactForm extends BaseForm {
  message: string;
}

interface FormState extends BaseFormState {
  form: ContactForm;
}

const emit = defineEmits(["on:success"]);

const state = reactive<FormState>({
  form: {
    name: "",
    email: "",
    message: ""
  },

  errors: [],
  isProcessing: false,
});

const hasErrors = computed(() => state.errors.length > 0);
const disableBtn = computed(() => state.isProcessing || hasErrors.value);
const btnText = computed(() => state.isProcessing ? "Processing..." : "Send message");

/**
 * Sends the message.  
 *
 * @returns
 */
async function submit() {
  if (!validate()) return;

  const { name, email, message } = state.form;
  const { SENDGRID_MAIL_TEMPLATE_ID, SENDGRID_MAIL_TO_EMAIL, SENDGRID_MAIL_FROM_EMAIL } = useRuntimeConfig().public;

  const payload = {
    to: SENDGRID_MAIL_TO_EMAIL,
    from: SENDGRID_MAIL_FROM_EMAIL,
    subject: "You have a message",
    template_id: SENDGRID_MAIL_TEMPLATE_ID,

    // define the dynamic data used in 
    // SendGrid's dynamic templates    
    dynamic_template_data: {
      name,
      email,
      message,
      title: `You have a message from ${getNamePart(state.form.name)}`,
    }
  };

  const fetchOptions = {
    method: "POST",
    body: payload,
  };

  state.isProcessing = true;

  try {
    await useFetch("/api/send", fetchOptions);
    emit("on:success");
  } catch (e) {
    console.log("Send failed", e);
  } finally {
    state.isProcessing = false;
  }
}

function validate() {
  const { name, email, message } = state.form || {};
  const errors = state.errors;

  if (!name) setError("name");
  if (!email || !isEmail(email)) setError("email");
  if (!message) setError("message")

  return errors.length === 0;
}

function setError(field: FormField) {
  const errors = state.errors;
  if (!errors.includes(field)) errors.push(field);
}
</script>
<template>
  <section class="py-12 bg-gray-50 sm:py-16 lg:py-20 xl:py-24">
    <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Contact us</h2>
        <p class="mt-4 text-base font-normal leading-7 text-gray-600 lg:text-lg lg:mt-6 lg:leading-8">Reach out to us if you have any questions or comments</p>
      </div>

      <div class="max-w-lg mx-auto mt-12 overflow-hidden bg-white shadow-xl sm:mt-16 rounded-2xl">
        <div class="px-6 py-8">
          <form @submit.prevent class="space-y-6">
            <fieldset>
              <label for="name" class="text-base font-medium text-gray-900"> Your name </label>
              <div class="mt-2">
                <input type="text" name="name" id="name" v-model="state.form.name" placeholder="Enter your full name"
                  class="block w-full px-4 py-4 text-base text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>
            </fieldset>

            <fieldset>
              <label for="email" class="text-base font-medium text-gray-900"> Email address </label>
              <div class="mt-2">
                <input type="email" name="email" id="email" v-model="state.form.email" placeholder="Enter your email"
                  class="block w-full px-4 py-4 text-base text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>
            </fieldset>

            <fieldset>
              <label for="message" class="text-base font-medium text-gray-900"> Write your message </label>
              <div class="mt-2">
                <textarea name="message" id="message" v-model="state.form.message"
                  placeholder="Write us your message here..." rows="4"
                  class="block w-full px-4 py-4 text-base text-gray-900 bg-white border border-gray-200 resize-y rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"></textarea>
              </div>
            </fieldset>

            <button type="button" @click="submit()" :disabled="disableBtn"
              :class="{ 'opacity-50 cursor-not-allowed': disableBtn }"
              class="inline-flex items-center justify-center px-12 py-4 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
              {{ btnText }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>