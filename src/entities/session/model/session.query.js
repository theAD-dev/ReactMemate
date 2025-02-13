import { useQuery } from "@tanstack/react-query";
import { getSession } from "../api/session-api";

export const useSessionQuery = () => {
    return useQuery({
        queryKey: ['session'],
        queryFn: getSession
    });
}