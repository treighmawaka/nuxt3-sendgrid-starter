<script setup lang="ts">
import { getNamePart, isEmail } from "~~/utils/misc";
import type { BaseForm, BaseFormState, FormField } from "~~/types/mail";

interface FormState extends BaseFormState {
  form: BaseForm;  
}

const emit = defineEmits(["on:success"]);

const state = reactive<FormState>({
  form: {
    name: "",
    email: ""
  },

  errors: [],
  isProcessing: false,  
});

const hasErrors = computed(() => state.errors.length > 0);
const disableBtn = computed(() => state.isProcessing || hasErrors.value);
const btnText = computed(() => state.isProcessing ? "Processing..." : "Subscribe Now");

/**
 * Subscribes the user on SendGrid.  
 *
 * @returns
 */
async function submit() {
  if (!validate()) return;

  const payload = {
    contacts: [
      {
        first_name: getNamePart(state.form.name),
        last_name: getNamePart(state.form.name, "last"),
        email: state.form.email,
      },
    ],
  };

  const fetchOptions = {
    method: "PUT",
    body: payload,
  };

  state.isProcessing = true;

  try {
    await useFetch("/api/subscribe", fetchOptions);    
    emit("on:success");    
  } catch (e) {    
    console.log("Subscribe failed", e);
  } finally {
    state.isProcessing = false;
  }
}

function validate() {
  const { name, email } = state.form || {};
  const errors = state.errors;

  if (!name) setError("name");
  if (!email || !isEmail(email)) setError("email");

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
        <h2 class="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Join our newsletter</h2>
        <p class="mt-4 text-base font-normal leading-7 text-gray-600 lg:text-lg lg:mt-6 lg:leading-8">Stay up to date
          with our latest news and special offers!</p>
      </div>

      <div class="max-w-lg mx-auto mt-12 overflow-hidden bg-white shadow-xl sm:mt-16 rounded-2xl">
        <div class="px-6 py-8">
          <form @submit.prevent class="space-y-5">
            <fieldset class="mb-3">
              <label for="email" class="sr-only"> Name </label>
              <input type="text" name="name" id="name" v-model="state.form.name" placeholder="Enter your name"
                class="block w-full px-6 py-4 text-base text-center text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none" />
            </fieldset>        
              
            <fieldset>
              <label for="email" class="sr-only"> Email address </label>
              <input type="email" name="email" id="email" v-model="state.form.email" placeholder="Enter your email address"
                class="block w-full px-6 py-4 text-base text-center text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none" />
            </fieldset>
            
            <button type="button" @click="submit()"
              :disabled="disableBtn"
              :class="{'opacity-50 cursor-not-allowed': disableBtn}"
              class="inline-flex items-center justify-center w-full px-6 py-4 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
              {{ btnText }}
            </button>
          </form>

          <p class="mt-5 text-sm font-normal text-center text-gray-500">We respect your privacy.</p>
        </div>
      </div>
    </div>
  </section>
</template>