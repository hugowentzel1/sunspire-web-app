import { getLastLeadForTenant as getLastLead } from "@/src/lib/storage";

export async function getLastLeadForTenant(handle: string) {
  return getLastLead(handle);
}
