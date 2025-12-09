import supabase from "@/api/supabaseClient";

export async function startShift(attendantId) {
  const { data } = await supabase
    .from("attendant_shifts")
    .insert({
      attendant_id: attendantId,
      start_time: new Date(),
    })
    .select()
    .single();

  return data;
}

export async function closeShift(shiftId, summary) {
  return await supabase
    .from("attendant_shifts")
    .update({
      end_time: new Date(),
      ...summary
    })
    .eq("id", shiftId);
}

export async function getActiveShift(attendantId) {
  const { data } = await supabase
    .from("attendant_shifts")
    .select("*")
    .eq("attendant_id", attendantId)
    .is("end_time", null)
    .single();

  return data;
}
