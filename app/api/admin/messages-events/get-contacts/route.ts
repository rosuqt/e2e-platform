import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "@/lib/supabase";


export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.adminID

    // Fetch only conversations involving the current user
    const { data: conversations, error } = await supabase
      .from("messages")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) throw error;

    const formatted = [];

    for (const convo of conversations || []) {
      // identify the other user in the conversation
      const otherUserId = convo.user1_id === userId ? convo.user2_id : convo.user1_id;

      // Try to get the other user from all 3 tables
      let userData = null;
      let role = "";

      const { data: student } = await supabase
        .from("registered_students")
        .select("id, first_name, last_name")
        .eq("id", otherUserId)
        .single();

      if (student) {
        userData = student;
        role = "Student";
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

      // Currnet user conversations
      if (convo.user1_id === userId || convo.user2_id === userId) {
        formatted.push({
          id: convo.id,
          name: userData ? `${userData.first_name} ${userData.last_name}` : "Unknown User",
          //AVATAR GET NOT HERE
          avatar:"",
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
    console.error("❌ Error fetching conversations:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { conversationId, content } = await req.json();
    const session = await getServerSession(authOptions)
    const userId = session?.user?.adminID

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
      console.error("Supabase update error:", updateError);
      throw new Error(updateError.message || "Database update failed");
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update messages"
    console.error("API Error:", err);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}