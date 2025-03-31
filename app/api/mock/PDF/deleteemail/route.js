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
        const userId = url.searchParams.get("UserId")
    } catch (error) {
        
    }
}