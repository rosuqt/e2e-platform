import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

type Cert = {
  title: string;
  issuer: string;
  issueDate: string;
  description?: string;
  attachmentUrl?: string;
  category?: string;
};

type Education = {
  acronym: string;
  school: string;
  degree: string;
  years: string;
  color: string;
  textColor: string;
  level?: string;
  iconColor?: string;
};

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, issuer, issueDate, expertiseSkill, expertiseMastery, educationIdx } = body;

    let student_id = body.student_id;
    if (!student_id) {
      try {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("../../../../../lib/authOptions");
        const session = await getServerSession(authOptions);
        student_id = (session?.user as { studentId?: string })?.studentId;
      } catch {}
    }
    if (!student_id) {
      return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
    }

    if (body.type === "education_delete" && typeof educationIdx === "number") {
      const { data: profile, error: fetchError } = await supabase
        .from("student_profile")
        .select("educations")
        .eq("student_id", student_id)
        .single();

      if (fetchError || !profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      const educationsArr: Education[] = profile.educations || [];
      const newEducations = educationsArr.filter((_, i) => i !== educationIdx);

      const { error: updateError } = await supabase
        .from("student_profile")
        .update({ educations: newEducations, updated_at: new Date().toISOString() })
        .eq("student_id", student_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (expertiseSkill !== undefined && expertiseMastery !== undefined) {
      const { data: profile, error: fetchError } = await supabase
        .from("student_profile")
        .select("expertise")
        .eq("student_id", student_id)
        .single();

      if (fetchError || !profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      const expertiseArr: { skill: string; mastery: number }[] = profile.expertise || [];
      const expertise = expertiseArr.filter(
        (exp) => !(exp.skill === expertiseSkill && exp.mastery === expertiseMastery)
      );

      const { error: updateError } = await supabase
        .from("student_profile")
        .update({ expertise, updated_at: new Date().toISOString() })
        .eq("student_id", student_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Resume/Cover Letter file deletion
    if (body.fileType === "resume" || body.fileType === "cover_letter") {
      // Use a type assertion to allow dynamic field access
      const field = body.fileType === "resume" ? "uploaded_resume_url" : "uploaded_cover_letter_url";
      const { data: profile, error: fetchError } = await supabase
        .from("student_profile")
        .select("uploaded_resume_url, uploaded_cover_letter_url")
        .eq("student_id", student_id)
        .single();

      if (fetchError || !profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      // Use Record<string, unknown> for type-safe dynamic access
      const profileObj = profile as Record<string, unknown>;
      let arr: string[] = [];
      if (Array.isArray(profileObj[field] as string[])) {
        arr = profileObj[field] as string[];
      } else if (typeof profileObj[field] === "string" && profileObj[field]) {
        arr = [profileObj[field] as string];
      }

      // Remove by matching file name (last segment of path)
      arr = arr.filter((path: string) => {
        const last = path.split("/").pop();
        return last !== body.fileName;
      });

      // Remove file from storage
      if (body.fileUrl) {
        let storagePath = body.fileUrl.replace(/^\/storage\//, "");
        if (storagePath.includes("?")) storagePath = storagePath.split("?")[0];
        await supabase.storage.from("student.documents").remove([storagePath]);
      }

      const updateObj: Record<string, unknown> = {};
      updateObj[field] = arr;
      updateObj.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("student_profile")
        .update(updateObj)
        .eq("student_id", student_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    const { data: profile, error: fetchError } = await supabase
      .from("student_profile")
      .select("certs")
      .eq("student_id", student_id)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const certsArr: Cert[] = profile.certs || [];
    const certToDelete = certsArr.find(
      (cert) =>
        cert.title === title &&
        cert.issuer === issuer &&
        cert.issueDate === issueDate
    );

    const certs = certsArr.filter(
      (cert) =>
        cert.title !== title ||
        cert.issuer !== issuer ||
        cert.issueDate !== issueDate
    );

    if (certToDelete?.attachmentUrl) {
      await supabase.storage
        .from("student.documents")
        .remove([certToDelete.attachmentUrl]);
    }

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ certs, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { educationIdx, educationData, student_id: bodyStudentId } = body;

    let student_id = bodyStudentId;
    if (!student_id) {
      try {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("../../../../../lib/authOptions");
        const session = await getServerSession(authOptions);
        student_id = (session?.user as { studentId?: string })?.studentId;
      } catch {}
    }
    if (!student_id) {
      return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
    }

    if (typeof educationIdx === "number" && educationData) {
      const { data: profile, error: fetchError } = await supabase
        .from("student_profile")
        .select("educations")
        .eq("student_id", student_id)
        .single();

      if (fetchError || !profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      const educationsArr: Education[] = profile.educations || [];
      if (educationIdx < 0 || educationIdx >= educationsArr.length) {
        return NextResponse.json({ error: "Invalid education index" }, { status: 400 });
      }
      educationsArr[educationIdx] = educationData;

      const { error: updateError } = await supabase
        .from("student_profile")
        .update({ educations: educationsArr, updated_at: new Date().toISOString() })
        .eq("student_id", student_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}