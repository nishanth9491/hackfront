import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import Implement from "../Calendar/implement";
import "../Today/today.css";

const Today = () => {
  const adminEmails = [
    "hostel@gmail.com",
    "academic@gmail.com",
    "administration@gmail.com",
    "newadmin@gmail.com",
  ];
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [sortedArr, setSortedArr] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false); // Added loading state for delete operation
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [email, setEmail] = useState();

  useEffect(() => {
    if (adminEmails.includes(email)) {
      const AdminData = async () => {
        const res = await axios.get("https://bend1.onrender.com/studentRoute/");
        console.log(res.data.task);
        const taskTeams = res.data.task.map((task) => task.TaskTeam);
        console.log("Task Teams:", taskTeams);
        const hasTaskTeamInEmail = taskTeams.some((team) =>
          email.includes(team)
        );
        console.log(hasTaskTeamInEmail);
      };
      AdminData();
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://bend1.onrender.com/studentRoute/update-student/${id}`
        );
        setEmail(res.data.email);
        if (res.status === 200) {
          const today = new Date().toDateString();
          const tasksForToday = res.data.task.filter(
            (task) => task.TaskDate === today
          );

          const sortedTasks = tasksForToday
            .filter((task) => task.TaskTime != null)
            .sort((a, b) =>
              String(a.TaskTime).localeCompare(String(b.TaskTime))
            );

          setSortedArr(sortedTasks);
          setLoading(false);
        } else {
          setError(`Failed to fetch tasks: ${res.status}`);
          setLoading(false);
        }
      } catch (err) {
        setError(`Error fetching tasks: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteTask = async (taskId) => {
    try {
      setLoadingDelete(true); // Set loading state to true during deletion

      const res = await axios.delete(
        `https://bend1.onrender.com/studentRoute/delete-task/${id}/${taskId}`
      );

      if (res.status === 200) {
        setSortedArr((prevArr) =>
          prevArr.filter((task) => task._id !== taskId)
        );
      } else {
        setError(`Failed to delete task: ${res.status}`);
      }
      window.location.reload();
    } catch (err) {
      setError(`Error deleting task: ${err.message}`);
    } finally {
      setLoadingDelete(false); // Set loading state back to false after deletion (success or failure)
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/home/${id}/${taskId}`);
    document.getElementById("implement").scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="containers" id="today">
      <h1 className="todayText">Complaints</h1>

      {sortedArr.map((task, index) => (
        <React.Fragment key={index}>
          <div
            className={`dot ${currentTime > task.TaskTime ? "late" : ""}`}
            data-n={""}
          >
            <div className="innerdi">{task.TaskTime}</div>
          </div>
          <div className="line" data-n={""}>
            {adminEmails.includes(email) && (
              <div className="leftinnerdiv">
                <textarea
                  className="textarea"
                  name=""
                  id=""
                  cols="10"
                  rows="5"
                  style={{
                    borderRadius: "5px",
                    color: "black",
                    backgroundColor: "white ",
                  }}
                ></textarea>
                <button className="resolvebtn">resolve</button>
                {/* <select
                  id="infoPriority"
                  name="infoPriority"
                  className="infoPrior"
                  style={{ width: "100px", color: "black" }}
                >
                  <option value="academics">Academics</option>
                  <option value="administration">Administration</option>
                  <option value="hostel">Hostel</option>
                </select> */}
              </div>
            )}
            <div className="innerdiv">
              {task.TaskName.slice(0, 10)}.... {task.Priority}
            </div>
            <button
              className="btn-delt"
              onClick={() => handleDeleteTask(task.taskId)}

              // Disable the delete button during loading
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
            <button
              className="btn-edit"
              onClick={() => handleEditTask(task.taskId)}
            >
              Edit
            </button>
          </div>
        </React.Fragment>
      ))}
      <div className="dot" data-n={""}>
        <div className="innerdi"></div>
      </div>
    </div>
  );
};

export default Today;
