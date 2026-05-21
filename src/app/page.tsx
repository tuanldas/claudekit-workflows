import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/locale-routing";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
