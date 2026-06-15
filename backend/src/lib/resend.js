import { Resend } from "resend";
import 'dotenv/config';


export const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sender = {
    email: process.env.EMAIL_FORM,
    name: process.env.EMAIL_FORM_NAME
}

