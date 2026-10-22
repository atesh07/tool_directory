import ToolClient from "./ToolClient";
import ToolPage from "@/components/seo/ToolPage";
import { getTool } from "@/data/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("base64-encoder-decoder")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage slug="base64-encoder-decoder">
      <ToolClient />
    </ToolPage>
  );
}
