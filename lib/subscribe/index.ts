"use server";
import axios from "axios";
import { EMAIL_SERVICE_API_URL } from "../constants";

interface subscribeProps {
  email: string;
  name: string;
}

export const handleSubscribe = async ({ email, name }: subscribeProps) => {
  if (!email && !name) {
    return;
  }
  const subscribeResult = await axios.post(
    `${EMAIL_SERVICE_API_URL}/subscribe`,
    {
      email,
      name,
    }
  );
  return subscribeResult;
};

export const handleUnsubscribe = async ({ email }: { email: string }) => {
  if (!email) return;
  const unsubscribeResult = await axios.post(
    `${EMAIL_SERVICE_API_URL}/unsubscribe`,
    {
      email,
    }
  );
  return unsubscribeResult;
};
