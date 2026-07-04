import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTab } from "../../components/Tab/TabContext";

import IconText from "../../components/Icon/Icon1.jsx";

import plus from "../../assets/plus.svg";
import setting from "../../assets/setting.svg";
import icon from "../../assets/icon.svg";
import search from "../../assets/search.svg";
import home from "../../assets/home.svg";
import task from "../../assets/task.svg";
import notes from "../../assets/notes.svg";
import notif from "../../assets/notification.svg";

import styles from "./Sidebar.module.css";

import SearchModal from "../Search/Search";
import CreateTeamModal from "../CreateTeam/CreateTeam";

import {
  createTeam,
  getServerTeams,
} from "../../services/teamService";

import {
  createServer,
} from "../../services/serverService";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTab } = useTab();

  const [privateTeams, setPrivateTeams] =
    useState([]);

  const [publicTeams, setPublicTeams] =
    useState([]);

  const [activeTeam, setActiveTeam] =
    useState(null);

  const [loadingTeams, setLoadingTeams] =
    useState(false);

  const [creatingTeam, setCreatingTeam] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  const [showCreateTeam, setShowCreateTeam] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const isActive = (path) =>
    location.pathname === path;

  const openPage = (
    title,
    icon,
    route
  ) => {
    addTab(title, icon);
    navigate(route);
  };

  const fetchTeams = async () => {
  try {
    setLoadingTeams(true);

    const serverId =
      localStorage.getItem(
        "activeServerId"
      );

    console.log(
      "SERVER ID:",
      serverId
    );

    if (!serverId) {
      setPrivateTeams([]);
      setPublicTeams([]);
      return;
    }

    const response =
      await getServerTeams(serverId);

    console.log(
      "GET TEAMS RESPONSE:",
      response
    );

    const teams =
      Array.isArray(response)
        ? response
        : response?.data ||
          response?.teams ||
          [];

    console.log(
      "PARSED TEAMS:",
      teams
    );

    const privateList =
      teams.filter(
        (team) =>
          team.type ===
          "Private"
      );

    const publicList =
      teams.filter(
        (team) =>
          team.type ===
          "Public"
      );

    setPrivateTeams(privateList);
    setPublicTeams(publicList);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingTeams(false);
  }
};

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateServer =
    async () => {
      try {
        const serverName =
          prompt(
            "Input Server Name"
          );

        if (!serverName) return;

        const server =
          await createServer({
            name: serverName,
          });

        const serverId =
          server?.id ||
          server?.data?.id;

        localStorage.setItem(
          "activeServerId",
          serverId
        );

        alert(
          "Server created successfully"
        );

        fetchTeams();
      } catch (error) {
        console.error(error);

        alert(
          error.message ||
            "Failed create server"
        );
      }
    };

  const handleCreateTeamSubmit =
    async (teamData) => {
      try {
        setCreatingTeam(true);

        const serverId =
          localStorage.getItem(
            "activeServerId"
          );

        if (!serverId) {
          alert(
            "Create Server First"
          );
          return;
        }

        const result =
          await createTeam({
            serverId:
              Number(serverId),

            name: teamData.name,

            type:
              teamData.type,
          });

        const teamId =
          result?.id ||
          result?.data?.id;

        localStorage.setItem(
          "activeTeamId",
          teamId
        );

        setShowCreateTeam(false);

        await fetchTeams();

        window.dispatchEvent(
          new Event("teamChanged")
        );
      } catch (error) {
        console.error(error);

        alert(
          error.message ||
            "Failed create team"
        );
      } finally {
        setCreatingTeam(false);
      }
    };

  const handleSelectTeam = (
    team
  ) => {
    setActiveTeam(team);

    localStorage.setItem(
      "activeTeamId",
      team.id
    );

    window.dispatchEvent(
      new Event("teamChanged")
    );
  };

  return (
    <div id={styles.sidebar}>
      {/* TOP */}

      <div id={styles.sidebarTop}>
        <IconText />

        <nav>
          <ul>
            <li
              onClick={() =>
                setShowSearch(true)
              }
            >
              <img
                src={search}
                alt=""
                width="24"
              />
              Search
            </li>

            <li
              onClick={() =>
                openPage(
                  "Home",
                  home,
                  "/home"
                )
              }
              className={
                isActive("/home")
                  ? styles.active
                  : ""
              }
            >
              <img
                src={home}
                alt=""
                width="24"
              />
              Home
            </li>

            <li
              onClick={() =>
                openPage(
                  "Notes",
                  notes,
                  "/note"
                )
              }
              className={
                isActive("/note")
                  ? styles.active
                  : ""
              }
            >
              <img
                src={notes}
                alt=""
                width="24"
              />
              Notes
            </li>

            <li
              onClick={() =>
                openPage(
                  "Task",
                  task,
                  "/task"
                )
              }
              className={
                isActive("/task")
                  ? styles.active
                  : ""
              }
            >
              <img
                src={task}
                alt=""
                width="24"
              />
              Task
            </li>
          </ul>
        </nav>
      </div>

      {/* MIDDLE */}
              <div id={styles.sidebarMain}>
        <ul>

            <li onClick={handleCreateServer}>
            <span>
                <img src={plus} alt="" width="22" />
                Create Server
            </span>
            </li>

            <li onClick={() => setShowCreateTeam(true)}>
            <span>
                <img src={plus} alt="" width="22" />
                Create Team
            </span>
            </li>

            <div className={styles.sectionDivider}></div>

            <li className={styles.sectionTitle}>
            PRIVATE TEAMS
            </li>

            {privateTeams.map((team) => (
            <li
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className={
                activeTeam?.id === team.id
                    ? styles.active
                    : ""
                }
            >
                {team.name}
            </li>
            ))}

            <div className={styles.sectionDivider}></div>

            <li className={styles.sectionTitle}>
            PUBLIC TEAMS
            </li>

            {publicTeams.map((team) => (
            <li
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className={
                activeTeam?.id === team.id
                    ? styles.active
                    : ""
                }
            >
                {team.name}
            </li>
            ))}

        </ul>
        </div>

      {/* BOTTOM */}

      <div id={styles.sidebarBottom}>
        <ul>
          <li
            onClick={() =>
              openPage(
                "Notification",
                notif,
                "/notification"
              )
            }
          >
            <img
              src={notif}
              alt=""
              width="24"
            />
            Notification
          </li>

          <li>
            <img
              src={setting}
              alt=""
              width="24"
            />
            Setting
          </li>

          <li
            onClick={() =>
              navigate("/profile")
            }
          >
            <img
              src={icon}
              alt=""
              width="35"
            />
            Profile
          </li>
        </ul>
      </div>

      <SearchModal
        isOpen={showSearch}
        onClose={() =>
          setShowSearch(false)
        }
        searchQuery={searchQuery}
        setSearchQuery={
          setSearchQuery
        }
      />

      <CreateTeamModal
        isOpen={showCreateTeam}
        onClose={() =>
          setShowCreateTeam(false)
        }
        onSubmit={
          handleCreateTeamSubmit
        }
        loading={creatingTeam}
      />
    </div>
  );
}

export default Sidebar;