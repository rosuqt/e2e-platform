/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "@/lib/supabase";
import { getAdminSupabase } from "@/lib/supabase";

type UserType = { employerId?: string }

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.studentId as string

    const { data: conversations, error } = await supabase
      .from("messages")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) throw error;

    const formatted = [];
    const adminSupabase = getAdminSupabase();

    for (const convo of conversations || []) {
      const otherUserId = convo.user1_id === userId ? convo.user2_id : convo.user1_id;
      let userData = null;
      let role = "";
      let avatar = "";

      const { data: student } = await supabase
        .from("registered_students")
        .select("id, first_name, last_name")
        .eq("id", otherUserId)
        .single();

      if (student) {
        userData = student;
        role = "Student";
        const { data: profile } = await supabase
          .from("student_profile")
          .select("profile_img")
          .eq("student_id", otherUserId)
          .single();
        if (profile?.profile_img) {
          const { data: signed } = await adminSupabase.storage
            .from("user.avatars")
            .createSignedUrl(profile.profile_img, 60 * 60);
          if (signed?.signedUrl) avatar = signed.signedUrl;
        }
      } else {
        const { data: employer } = await supabase
          .from("registered_employers")
          .select("id, first_name, last_name")
          .eq("id", otherUserId)
          .single();

        if (employer) {
          userData = employer;
          role = "Employer";
        } else {
          const { data: admin } = await supabase
            .from("registered_admins")
            .select("id, first_name, last_name")
            .eq("id", otherUserId)
            .single();

          if (admin) {
            userData = admin;
            role = "Admin";
          }
        }
      }

      if (convo.user1_id === userId || convo.user2_id === userId) {
        formatted.push({
          id: convo.id,
          name: userData ? `${userData.first_name} ${userData.last_name}` : "Unknown User",
          avatar,
          role,
          messages: convo.messages || [],
          lastMessage: convo.messages?.length
            ? {
                content: convo.messages[convo.messages.length - 1].content,
                time: convo.messages[convo.messages.length - 1].time,
              }
            : { content: "", time: "" },
          userId,
        });
      }
    }

    return NextResponse.json({ conversations: formatted });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { conversationId, content } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.studentId as string

    if (!conversationId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: conversation, error: fetchError } = await supabase
      .from("messages")
      .select("messages")
      .eq("id", conversationId)
      .single();

    if (fetchError) throw fetchError;

    const currentMessages = conversation?.messages || [];

    const newMessage = {
      sender_id: userId,
      content,
      time: new Date().toISOString(),
    };

    const updatedMessages = [...currentMessages, newMessage];

    const { error: updateError } = await supabase
      .from("messages")
      .update({ messages: updatedMessages })
      .eq("id", conversationId);

    if (updateError) {
      throw new Error(updateError.message || "Database update failed");
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update messages"
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}