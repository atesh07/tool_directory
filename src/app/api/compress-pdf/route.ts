import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const level = formData.get("level") as string; // 'low', 'recommended', 'extreme'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF Document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Structural Compression Options
    // Note: To achieve true "Extreme" image downscaling in a production app, 
    // you would typically pipe this buffer to a Ghostscript instance or a service like CloudConvert.
    // Here we use pdf-lib's native capabilities to clean up and compress the file structure.
    
    let compressedBytes;

    if (level === "extreme") {
      compressedBytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
    } else if (level === "recommended") {
      compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    } else {
      // Low compression - mostly just rewriting the structure
      compressedBytes = await pdfDoc.save();
    }

    // Return the compressed PDF to the client
    return new NextResponse(compressedBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed_${file.name}"`,
      },
    });

  } catch (error) {
    console.error("Compression API Error:", error);
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 });
  }
}