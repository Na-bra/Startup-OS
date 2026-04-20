import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { action, user_id, startup_id, milestone_id, title, description, status, due_date } = body;

    if (!user_id || typeof user_id !== "string") {
      return new Response(JSON.stringify({ error: "Invalid user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the user owns the startup
    if (startup_id) {
      const { data: startup } = await supabaseAdmin
        .from("Startups")
        .select("id")
        .eq("id", startup_id)
        .eq("student_id", user_id)
        .maybeSingle();

      if (!startup) {
        return new Response(JSON.stringify({ error: "Startup not found or not yours" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "create") {
      if (!title || !startup_id) {
        return new Response(JSON.stringify({ error: "title and startup_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseAdmin
        .from("Milestones")
        .insert({
          startup_id,
          title,
          description: description || null,
          status: status || "pending",
          due_date: due_date || null,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      if (!milestone_id) {
        return new Response(JSON.stringify({ error: "Missing milestone_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (title) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (status) updates.status = status;
      if (due_date !== undefined) updates.due_date = due_date;

      const { data, error } = await supabaseAdmin
        .from("Milestones")
        .update(updates)
        .eq("id", milestone_id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
