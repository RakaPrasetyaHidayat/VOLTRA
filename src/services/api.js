const API_BASE = "https://voltra-be.vercel.app/api";

export const getToken = () => {
return (
localStorage.getItem("token") ||
sessionStorage.getItem("token") ||
""
);
};

export const authHeaders = () => ({
"Content-Type": "application/json",
Authorization: `Bearer ${getToken()}`,
});

export const apiFetch = async (
endpoint,
options = {}
) => {
try {
const response = await fetch(
`${API_BASE}${endpoint}`,
{
headers: authHeaders(),
...options,
}
);

const contentType =
  response.headers.get("content-type");

let data = null;

if (
  contentType &&
  contentType.includes("application/json")
) {
  data = await response.json();
}

if (!response.ok) {
  throw new Error(
    data?.message ||
      `Request failed (${response.status})`
  );
}

return data;

} catch (error) {
console.error(error);
throw error;
}
};

export default API_BASE;
