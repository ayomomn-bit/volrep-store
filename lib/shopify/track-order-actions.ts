"use server";

import { headers } from "next/headers";
import { findOrderForTracking, type TrackOrderResult } from "@/lib/shopify/orders";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_NUMBER_PATTERN = /^#?[A-Za-z0-9-]{1,20}$/;

// Best-effort brute-force guard: caps how many lookups a given client IP
// can attempt in a rolling window. In-memory, so it resets on redeploy and
// isn't shared across serverless instances — not a substitute for the
// email-match check in orders.ts (that's the real access control), just
// friction against scripted order-number enumeration from one source.
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 8;
const attemptsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attemptsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < ATTEMPT_WINDOW_MS);
  recent.push(now);
  attemptsByIp.set(ip, recent);
  return recent.length > MAX_ATTEMPTS_PER_WINDOW;
}

// Server Actions are POST endpoints reachable by anyone who can send the
// request, not just this page's form — re-validate here even though the
// client already checks the same patterns before submitting.
export async function trackOrderAction(input: { orderNumber: string; email: string }): Promise<TrackOrderResult> {
  const orderNumber = input.orderNumber.trim();
  const email = input.email.trim();

  if (!ORDER_NUMBER_PATTERN.test(orderNumber) || !EMAIL_PATTERN.test(email)) {
    return { status: "not_found" };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return { status: "error" };
  }

  return findOrderForTracking(orderNumber, email);
}
