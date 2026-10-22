import ToolClient from "./ToolClient";
import ToolPage from "@/components/seo/ToolPage";
import { getTool } from "@/data/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("resize-image-under-100kb")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage slug="resize-image-under-100kb">
      <ToolClient />
    </ToolPage>
  );
}
