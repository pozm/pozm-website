import useSWR from "swr/esm/use-swr";
import {fetcher} from "../utils";
import {AdminData} from "../types/adminTypes";


export default function useUser() {
    const { data, mutate, error } = useSWR("/api/getUser", fetcher);

    const loading = !data && !error;
    const loggedOut = error && error.status === 403;

    return {
        loading,
        loggedOut,
        user: data?.data as AdminData.User | undefined,
        mutate
    };
}