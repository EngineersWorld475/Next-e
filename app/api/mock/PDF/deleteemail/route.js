const { mockGroups } = require("../../mockData");

export async function DELETE(req) {
    try {
        const authToken = req.headers.get("Authorization");

        if(!authToken) {
            return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        const url = new URL(req.url);
        const userId = url.searchParams.get("UserId");
        const groupId = Number(url.searchParams.get("GroupId"));
        const email = url.searchParams.get("Email");

        if (!userId || isNaN(groupId) || !email) {
            return new Response(JSON.stringify({ error: "userId, groupId, and email are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        let groupFound = false;
        for (let group of mockGroups) {
            if (group.userId === userId && group.groupId === groupId) {
                const initialLength = group.tags.length;
                group.tags = group.tags.filter((item) => item !== email); 

                if (group.tags.length < initialLength) {
                    groupFound = true;
                }
                break;
            }
        }

        if (!groupFound) {
            return new Response(JSON.stringify({ error: "Group not found or email not in group" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "Email deleted successfully", data: mockGroups }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}