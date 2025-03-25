import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const useUserId = () => {
    const { user } = useSelector((state) => state.auth);

    const getUserIdFromToken = (token) => {
        if (!token) {
            console.warn("Invalid or missing token.");
            return null;
        }
        try {
            const decoded = jwtDecode(token);
            return decoded?.UserId || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const userId = useMemo(() => {
        return user?.token ? getUserIdFromToken(user.token) : null;
    }, [user?.token]);

    return userId;
};

export default useUserId;
