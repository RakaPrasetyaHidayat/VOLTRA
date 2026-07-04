import { apiFetch } from "./api";

export const createTeam = async ({
serverId,
name,
}) => {
return apiFetch("/teams", {
method: "POST",
body: JSON.stringify({
serverId,
name,
}),
});
};

export const getServerTeams = async (
serverId
) => {
return apiFetch(
`/teams/server/${serverId}`
);
};

export const getTeamDetail = async (
teamId
) => {
return apiFetch(`/teams/${teamId}`);
};

export const updateTeam = async (
teamId,
name
) => {
return apiFetch(`/teams/${teamId}`, {
method: "PUT",
body: JSON.stringify({
name,
}),
});
};

export const deleteTeam = async (
teamId
) => {
return apiFetch(`/teams/${teamId}`, {
method: "DELETE",
});
};

export const getTeamMembers = async (
teamId
) => {
return apiFetch(
`/teams/${teamId}/members`
);
};

export const addTeamMember = async (
teamId,
userId
) => {
return apiFetch(
`/teams/${teamId}/members`,
{
method: "POST",
body: JSON.stringify({
userId,
}),
}
);
};

export const removeTeamMember =
async (teamId, userId) => {
return apiFetch(
`/teams/${teamId}/members/${userId}`,
{
method: "DELETE",
}
);
};
