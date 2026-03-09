const API_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

export interface Group {
    id: string;
    name: string;
    owner_id: string;
    created_at: number;
}

export interface GroupMember {
    group_id: string;
    user_id: string;
    role: number;
    joined_at: number;
}

export const GroupService = {
    // We will add the following methods one by one:
    // - createGroup
    // - deleteGroup
    // - updateGroup
    // - changeMemberRole
    // - addGroupMember
    // - removeGroupMember

    createGroup: async (groupObj: { name: string }) => {
        const res = await fetch(`${API_URL}/createGroup`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(groupObj),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create group.");
        }

        const data = await res.json();

        // Map the timestamp to simple number of seconds
        return {
            message: data.message,
            group: {
                ...data.group,
                created_at: data.group.created_at.seconds,
            } as Group,
        };
    },

    deleteGroup: async (groupId: string) => {
        const res = await fetch(`${API_URL}/deleteGroup`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id: groupId }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("SERVER ERROR DETAILS:", error);
            throw new Error(error.error || "Failed to delete group.");
        }

        const data = await res.json();
        return data;
    },

    updateGroup: async (groupId: string, newName: string) => {
        const res = await fetch(`${API_URL}/updateGroup`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group_id: groupId,
                new_name: newName
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update group.");
        }

        const data = await res.json();

        return {
            message: data.message,
            group: {
                ...data.group,
                created_at: data.group.created_at.seconds,
            } as Group,
        };
    },

    addGroupMember: async (groupId: string, userId: string) => {
        const res = await fetch(`${API_URL}/addGroupMember`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group_id: groupId,
                user_id: userId
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to add group member.");
        }

        const data = await res.json();
        return data;
    },

    removeGroupMember: async (groupId: string, userId: string) => {
        const res = await fetch(`${API_URL}/removeGroupMember`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group_id: groupId,
                user_id: userId
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to remove group member.");
        }

        const data = await res.json();
        return data;
    },

    fetchGroupMembers: async (groupId: string) => {
        const res = await fetch(`${API_URL}/groupMembers?group_id=${groupId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to fetch group members.");
        }

        const data = await res.json();

        return {
            message: data.message,
            members: data.members.map((m: any) => ({
                ...m,
                joined_at: m.joined_at.seconds,
            })) as GroupMember[],
        };
    },

    fetchUserGroups: async () => {
        const res = await fetch(`${API_URL}/userGroups`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to fetch user groups.");
        }

        const data = await res.json();

        return {
            message: data.message,
            groups: data.groups.map((g: any) => ({
                ...g,
                created_at: g.created_at.seconds,
            })) as Group[],
        };
    },
};