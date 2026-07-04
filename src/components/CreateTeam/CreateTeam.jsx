import { useState, useEffect, useCallback } from "react";
import styles from "./CreateTeam.module.css";
import exitIcon from "../../assets/exit.svg";

function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [teamType, setTeamType] = useState("Private");
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTeamType("Private");
    setTeamName("");
    setDescription("");
  };

  // 1. Moved handleClose above useEffect and added onClose to the dependency array
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  // 2. useEffect now safely references handleClose after its definition
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Team name wajib diisi!");
      return;
    }

    try {
      await onSubmit({
        type: teamType,
        name: teamName.trim(),
        description: description.trim(),
      });

      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.popupOverlay}
      onClick={handleClose}
    >
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.headerRow}>
          <button
            type="button"
            className={styles.exitButton}
            onClick={handleClose}
          >
            <img
              src={exitIcon}
              width="20"
              alt="Close"
            />
          </button>

          <div className={styles.titleWrapper}>
            <span className={styles.headerText}>
              Create New
            </span>

            <select
              value={teamType}
              onChange={(e) =>
                setTeamType(e.target.value)
              }
              className={styles.dropdownType}
            >
              <option value="Private">
                Private
              </option>

              <option value="Team">
                Team
              </option>
            </select>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.formBody}
        >
          <div className={styles.formGroup}>
            <label htmlFor="teamName">
              <b>Team Name</b>
            </label>

            <input
              id="teamName"
              type="text"
              placeholder="Enter team name"
              className={styles.inputField}
              value={teamName}
              onChange={(e) =>
                setTeamName(e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">
              <b>Project Description</b>
            </label>

            <textarea
              id="description"
              rows="4"
              placeholder="Enter project description"
              className={styles.textareaField}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading
                ? "Creating..."
                : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamModal;