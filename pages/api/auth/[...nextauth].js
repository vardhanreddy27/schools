import { nextAuthHandler } from "@/lib/auth";

export default function auth(req, res) {
  return nextAuthHandler(req, res);
}
