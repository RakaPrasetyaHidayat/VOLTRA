const API_URL =
  "https://voltra-be.vercel.app/api/servers";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/*
|--------------------------------------------------------------------------
| CREATE SERVER
|--------------------------------------------------------------------------
*/

export const createServer = async (
  serverData
) => {
  const response = await fetch(
    API_URL,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(serverData),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed create server"
    );
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| GET ALL SERVERS
|--------------------------------------------------------------------------
*/

export const getServers =
  async () => {
    const response =
      await fetch(API_URL, {
        headers: getHeaders(),
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed get servers"
      );
    }

    return data;
  };

/*
|--------------------------------------------------------------------------
| GET SERVER BY ID
|--------------------------------------------------------------------------
*/

export const getServerById =
  async (serverId) => {
    const response =
      await fetch(
        `${API_URL}/${serverId}`,
        {
          headers: getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed get server"
      );
    }

    return data;
  };

/*
|--------------------------------------------------------------------------
| UPDATE SERVER
|--------------------------------------------------------------------------
*/

export const updateServer =
  async (
    serverId,
    serverData
  ) => {
    const response =
      await fetch(
        `${API_URL}/${serverId}`,
        {
          method: "PUT",
          headers:
            getHeaders(),
          body: JSON.stringify(
            serverData
          ),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed update server"
      );
    }

    return data;
  };

/*
|--------------------------------------------------------------------------
| DELETE SERVER
|--------------------------------------------------------------------------
*/

export const deleteServer =
  async (serverId) => {
    const response =
      await fetch(
        `${API_URL}/${serverId}`,
        {
          method: "DELETE",
          headers:
            getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed delete server"
      );
    }

    return data;
  };

/*
|--------------------------------------------------------------------------
| JOIN SERVER
|--------------------------------------------------------------------------
*/

export const joinServer =
  async (serverId) => {
    const response =
      await fetch(
        `${API_URL}/join`,
        {
          method: "POST",
          headers:
            getHeaders(),
          body: JSON.stringify({
            serverId,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed join server"
      );
    }

    return data;
  };

/*
|--------------------------------------------------------------------------
| LEAVE SERVER
|--------------------------------------------------------------------------
*/

export const leaveServer =
  async (serverId) => {
    const response =
      await fetch(
        `${API_URL}/${serverId}/leave`,
        {
          method: "POST",
          headers:
            getHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed leave server"
      );
    }

    return data;
  };