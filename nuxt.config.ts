// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ["nuxt-windicss"],
  
  runtimeConfig: {
    // private config that is only available on the server
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,        
    SENDGRID_CONTACTS_API_URL: process.env.SENDGRID_CONTACTS_API_URL,    
    
    SENDGRID_MAIL_TO_EMAIL: process.env.SENDGRID_MAIL_TO_EMAIL,
    SENDGRID_MAIL_FROM_EMAIL: process.env.SENDGRID_MAIL_FROM_EMAIL,
    SENDGRID_MAIL_TEMPLATE_ID: process.env.SENDGRID_MAIL_TEMPLATE_ID,
    
    // config within public will be also exposed to the client
    public: {	
      SENDGRID_MAIL_TEMPLATE_ID: process.env.SENDGRID_MAIL_TEMPLATE_ID,	
    }
  }
})
