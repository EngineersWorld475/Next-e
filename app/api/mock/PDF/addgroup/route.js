let mockGroups = []; // Store groups persistently during runtime


export async function POST(req) {
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
    const groupName = url.searchParams.get("GroupName");
    const tagsText = url.searchParams.get("TagsText");

    if (!userId || !groupName || !tagsText) {
      return new Response(JSON.stringify({ error: "Missing required query parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create an object instead of an array
    const newGroup = {
      groupId: Math.floor(Math.random() * 1000),
      userId,
      groupName,
      tags: tagsText.split(","),
    };

    mockGroups.push(newGroup); // Push the object directly
    console.log("...mockGroups", mockGroups);

    return new Response(JSON.stringify({ success: true, message: "Group added successfully", data: [newGroup] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


// GET groups by userId
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("UserId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userGroups = mockGroups.filter(group => group.userId === userId); // ✅ Correct filtering

    console.log("Returning userGroups:", userGroups);
    return new Response(JSON.stringify({ success: true, data: userGroups || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



