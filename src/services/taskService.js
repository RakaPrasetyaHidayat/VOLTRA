import { apiFetch } from "./api";

export const createTask = async (
payload
) => {
return apiFetch("/task", {
method: "POST",
body: JSON.stringify(payload),
});
};

export const getTeamTasks = async (
teamId
) => {
return apiFetch(
`/task/team/${teamId}`
);
};

export const getTaskDetail = async (
taskId
) => {
return apiFetch(`/task/${taskId}`);
};

export const updateTask = async (
taskId,
payload
) => {
return apiFetch(`/task/${taskId}`, {
method: "PUT",
body: JSON.stringify(payload),
});
};

export const deleteTask = async (
taskId
) => {
return apiFetch(`/task/${taskId}`, {
method: "DELETE",
});
};
