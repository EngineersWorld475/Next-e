import { mockGroups } from "../../mockData";

export async function PUT(req) {
  console.log('...mockgroups', mockGroups)
  try {
    const authToken = req.headers.get("Authorization");

    if (!authToken) {
      return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("UserId");
    const groupId = Number(url.searchParams.get("GroupId"));
    const newEmail = url.searchParams.get("newEmail");

    if (!userId || isNaN(groupId) || !newEmail) {
      return new Response(JSON.stringify({ error: "UserId, GroupId, and newEmail are required" }), { status: 400 });
    }

    let groupFound = false;
    console.log("Before loop - groupFound:", groupFound);

    for (let group of mockGroups) {
      console.log("Checking group:", group);
      if (group.userId === userId && group.groupId === groupId) {
        group.tags.push(newEmail);
        groupFound = true;
        break;
      }
    }

    console.log("After loop - groupFound:", groupFound);

    if (!groupFound) {
      return new Response(JSON.stringify({ error: "Group not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Email added", data: mockGroups }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
