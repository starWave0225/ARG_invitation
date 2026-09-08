export function readYuanfanAccess(storage: Pick<Storage, "getItem" | "setItem">): boolean {
  if (storage.getItem("jia-yuanfan-site-access") === "true") return true;
  if (storage.getItem("jia-hd-trusted") !== "true") return false;
  // Repair saves that completed identity verification before access was persisted.
  storage.setItem("jia-yuanfan-site-access", "true");
  return true;
}
