import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchName = searchParams.get("name");

    if (!branchName) {
      return NextResponse.json(
        { message: 'The "name" query parameter is required.' },
        { status: 400 }
      );
    }

    const { data: registeredBranch } = await supabase
      .from("registered_branches")
      .select("id")
      .eq("branch_name", branchName)
      .single();

    if (registeredBranch) {
      return NextResponse.json({ exists: true });
    }

    const { data: pendingBranch } = await supabase
      .from("pending_branches")
      .select("id")
      .eq("branch_name", branchName)
      .single();

    if (pendingBranch) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
