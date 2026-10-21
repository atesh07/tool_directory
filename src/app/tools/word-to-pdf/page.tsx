import ToolClient from "./ToolClient";
import ToolPage from "@/components/seo/ToolPage";
import { getTool } from "@/data/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("word-to-pdf")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage slug="word-to-pdf">
      <ToolClient />
    </ToolPage>
  );
}
