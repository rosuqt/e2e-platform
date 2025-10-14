import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "../../../../src/lib/supabase";

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || typeof session.user !== "object") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const employerId =
            "employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string"
                ? (session.user as Record<string, unknown>).employerId as string
                : ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string"
                    ? (session.user as Record<string, unknown>).id as string
                    : null);

        if (!employerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        console.log("DELETE /api/job-listings/actionsDraft called with id:", id, "employerId:", employerId);

        if (!id) {
            return NextResponse.json({ error: "Missing draft id" }, { status: 400 });
        }

        const { error } = await supabase
            .from("job_drafts")
            .delete()
            .eq("id", id)
            .eq("employer_id", employerId);

        if (error) {
            console.log("Supabase error:", error);
            return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Draft deleted successfully" });
    } catch (err) {
        console.error("Error deleting draft:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
