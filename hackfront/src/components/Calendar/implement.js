import React, { useState, useEffect } from "react";
import { generateDate, months } from "./calendar";
import cn from "./cn";
import dayjs from "dayjs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import "../Calendar/implement.css";
import { Link } from "react-scroll";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import Sidecar from "./Sidecar";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating unique IDs

function Implement() {
  //form
  const [selectTeam, setSelectTeam] = useState("academics");
  const handleTeam = (e) => {
    setSelectTeam(e.target.value);
  };
  const [selectedPriority, setSelectedPriority] = useState(null);

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };
  const [grievance, setGrievance] = useState("");

  const handleGrievanceChange = (event) => {
    setGrievance(event.target.value);
  };
  const navigate = useNavigate();

  const [sortedArr, setSortedArr] = useState([]);

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const animateProgressBar = () => {
      let currentPercentage = 0;
      const duration = 2000; // 2 seconds
      const interval = setInterval(() => {
        currentPercentage += 1;
        setPercentage(currentPercentage);
        if (currentPercentage === 100) {
          clearInterval(interval);
        }
      }, duration / 100); // Adjust the interval based on your desired animation speed
    };

    animateProgressBar();
  }, []); // Empty dependency array to run the effect only once on mount

  const [useText, setUseText] = useState([]);
  const [submittedValue, setSubmittedValue] = useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    setUseText([...useText, inputValue]); // Add inputValue to useText
    setInputValue(""); // Clear the input field after submission
    setSubmittedValue(submittedValue + 1);
    console.log(arr);
    handleClick();
  };

  // const renderTextAfterLineH = (index) => {
  //   if (index < submittedValue) {
  //     return <div className="inputPrintText">{useText[index]}</div>;
  //   }
  //   return null;
  // };

  ///inputime

  useEffect(() => {
    // Get the current time using dayjs

    const now = dayjs();
    const currentTimeFormatted = now.format("HH:mm");
    setCurrentTime(currentTimeFormatted);
  }, []);

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();

  const [today, setToday] = useState(currentDate);
  const { id } = useParams();

  const [selectDate, setSelectDate] = useState(currentDate);
  const [currentTime, setCurrentTime] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [arr, setArr] = useState([]);
  const [initialValue, setInitialValue] = useState({});

  const submitbtn = async () => {
    console.log("submitted");
    // Generate a unique taskId using UUID

    // Create a new item with the current state values and the generated taskId

    const taskId = uuidv4();
    const newItem = {
      taskId,
      TaskTeam: selectTeam,
      TaskPriority: selectedPriority,

      TaskDate: selectDate.toDate().toDateString(),
      TaskTime: currentTime,
      TaskName: grievance, // Corrected from inputValue
    };
    console.log(selectDate.toDate());

    try {
      const res = await axios.get(
        "https://bend1.onrender.com/studentRoute/update-student/" + id
      );

      if (res.status === 200) {
        const data = {
          name: res.data.name,
          email: res.data.email,
          admin: res.data.admin,
          password: res.data.password,
          task: [...res.data.task, newItem],
        };

        const updateRes = await axios.put(
          "https://bend1.onrender.com/studentRoute/update-student/" + id,
          data
        );
        console.log(data);

        if (updateRes.status === 200) {
          // alert("Record updated");
          setSortedArr((prevArr) => [...prevArr, newItem]);
          // Optionally, you can update the state without reloading the page
        } else {
          console.error("Failed to update record");
        }
      } else {
        console.error("Failed to fetch initial value");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check the console for details.");
    }

    window.location.reload();
  };
  const [taskId, settaskId] = useState(""); // Add this line to declare taskId state

  const [updatebool, setUpdatebool] = useState(false);
  const taskd = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://bend1.onrender.com/studentRoute/update-student/" + id
        );
        console.log(res.data);

        if (res.status === 200) {
          // Check if taskd is defined and has the taskId property
          if (taskd && taskd.taskId) {
            // Find the task with the specified taskId
            const targetTask = res.data.task.find(
              (task) => task.taskId === taskd.taskId
            );

            // Check if targetTask is defined
            if (targetTask) {
              // Set the default values for input fields
              setSelectDate(dayjs(targetTask.TaskDate));
              setCurrentTime(targetTask.TaskTime);
              setGrievance(targetTask.TaskName); // Update this line
              setUpdatebool(true);

              // Sort tasks based on time
              const tasksForTargetDate = res.data.task.filter(
                (task) => task.TaskDate === targetTask.TaskDate
              );
              const sortedTasks = tasksForTargetDate.sort((a, b) =>
                a.TaskTime.localeCompare(b.TaskTime)
              );

              // Update the state after successfully fetching the data
              setSortedArr(sortedTasks);
            }
          }
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please check the console for details.");
      }
    };

    fetchData();
  }, [id, taskd.taskId]);

  const handleDeleteTask = (taskd) => {
    console.log("deleting start");

    return axios
      .delete(
        "https://bend1.onrender.com/studentRoute/delete-task/" +
          id +
          "/" +
          taskd
      )
      .then((res) => {
        if (res.status === 200) {
          // Update the sortedArr state after deleting the task
          setSortedArr((prevArr) =>
            prevArr.filter((task) => task._id !== taskd)
          );

          console.log("success del");
        } else {
          return Promise.reject();
        }
      })
      .catch((err) => {
        alert(err);
        return Promise.reject(err);
      });
  };

  const updateTask = () => {
    console.log(taskd.taskId);
    submitbtn();
    navigate("/home/" + id);
  };
  const handleClick = async () => {
    if (updatebool) {
      await handleDeleteTask(taskd.taskId); // Wait for handleDeleteTask to complete

      updateTask();
      console.log("ok");
      setUpdatebool(false);
    } else {
      console.log("false");
      submitbtn();
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://bend1.onrender.com/studentRoute/update-student/" + id
        );
        console.log(res.data);

        if (res.status === 200) {
          // Filter tasks based on the selected date
          const tasksForSelectedDate = res.data.task.filter(
            (task) => task.TaskDate === selectDate.toDate().toDateString()
          );

          // Set the sortedArr state with the filtered tasks
          setSortedArr(tasksForSelectedDate);

          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please check the console for details.");
      }
    };

    fetchData();
  }, [id, selectDate]);

  return (
    <div id="implement">
      <h1 className="implementText " id="infoms">
        Implement
      </h1>
      <p
        onChange={(e) => {
          settaskId(e.target.value);
          console.log(taskId);
        }}
        id="info"
      ></p>

      <div style={{ width: 120, height: 200 }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0.25,

            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "butt",

            // Text size
            textSize: "16px",

            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,

            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',

            // Colors
            pathColor: `rgba(0, 0, 0, ${percentage / 100})`,
            textColor: "rgba(232,81,95)",
            trailColor: "#d6d6d6",
            backgroundColor: "rgba(0,0,0)",
          })}
        />
      </div>
      <div className="container">
        <div className="calendr flex w-1/2 mx-auto  gap-10  items-center">
          <div className="w-70 h-70 ">
            <div className="flex justify-between">
              <h1 className="font-semibold">
                {months[today.month()]},{today.year()}
              </h1>
              <div className="flex item-center gap-5">
                <GrFormPrevious
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setToday(today.month(today.month() - 1));
                  }}
                />
                <h1
                  className="cursor-pointer"
                  onClick={() => {
                    setToday(currentDate);
                  }}
                >
                  Today
                </h1>
                <GrFormNext
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setToday(today.month(today.month() + 1));
                  }}
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-7 text-sm text-gray-500">
              {days.map((day, index) => {
                return (
                  <h1
                    key={index}
                    className="h-14 grid place-content-center text-sm"
                  >
                    {day}
                  </h1>
                );
              })}
            </div>

            <div className="w-full grid grid-cols-7">
              {generateDate(today.month(), today.year()).map(
                ({ date, currentMonth, today }, index) => {
                  return (
                    <div
                      key={index}
                      className="h-14 border-t grid place-content-center text-sm"
                    >
                      <h1
                        className={cn(
                          currentMonth ? "" : "text-gray-400",
                          today ? "bg-red-600 text-white " : "",
                          selectDate.toDate().toDateString() ===
                            date.toDate().toDateString()
                            ? "bg-black text-white"
                            : "",
                          "h-10 w-10 grid place-content-center rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
                        )}
                        onClick={() => {
                          setSelectDate(date);
                        }}
                      >
                        {date.date()}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className="form of input h-96  px-5">
            <h1 className="font-semibold">
              complaints for {selectDate.toDate().toDateString()}
            </h1>

            <p>
              {sortedArr.length} complaints on{" "}
              {selectDate.toDate().toDateString()}
            </p>
            {/* <h1 className="todayText">{selectDate.toDate().toDateString()}</h1> */}
            {/* <div className="sideCar">
            <Link className="dotH"></Link>
            {renderTextAfterLineH(0)}

            <div className="lineH"></div>
            <Link className="dotH"></Link>
            {renderTextAfterLineH(1)}
            <div className="lineH"></div>
            <Link className="dotH"></Link>
            {renderTextAfterLineH(2)}
            <div className="lineH"></div>
            <Link className="dotH"></Link>
            {renderTextAfterLineH(3)}
          </div> */}

            {/* <Sidecar /> */}

            <form onSubmit={handleSubmit}>
              <div className="radiosp">
                <label htmlFor="infoPriority" style={{ color: "red" }}>
                  Select Priority:
                </label>
                <label>
                  <input
                    type="radio"
                    name="infoPriority"
                    value="high"
                    checked={selectedPriority === "high"}
                    onChange={handlePriorityChange}
                  />
                  High
                </label>

                <label>
                  <input
                    type="radio"
                    name="infoPriority"
                    value="medium"
                    checked={selectedPriority === "medium"}
                    onChange={handlePriorityChange}
                  />
                  Medium
                </label>

                <label>
                  <input
                    type="radio"
                    name="infoPriority"
                    value="low"
                    checked={selectedPriority === "low"}
                    onChange={handlePriorityChange}
                  />
                  Low
                </label>
              </div>

              <label htmlFor="" style={{ color: "red" }}>
                Dept__
              </label>
              <select
                style={{ borderRadius: "10px" }}
                id="infoPriority"
                name="infoPriority"
                value={selectTeam}
                onChange={handleTeam}
              >
                <option value="academics">Academics</option>
                <option value="administration">Administration</option>
                <option value="hostel">Hostel</option>
              </select>
              <br />
              <textarea
                className="grievance"
                placeholder="Grievance"
                name="grievance"
                value={grievance}
                onChange={handleGrievanceChange}
                cols="30"
                rows="10"
                style={{
                  resize: "none",
                  textAlign: "center",
                  lineHeight: "inherit",
                  padding: "10px",
                }}
              ></textarea>

              <button type="submit" className="submitbtn">
                Submit
              </button>
            </form>
          </div>
          <div className="sideCar flex flex-col items-center">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {sortedArr.map((task, index) => (
                  <React.Fragment key={index}>
                    <Link className="dotH">
                      <p>{task.TaskTime}</p>
                    </Link>
                    <div className="lineH">
                      <p>{task.TaskName.slice(0, 5)}..</p>
                    </div>
                  </React.Fragment>
                ))}
                <Link className="dotH"></Link>
                <p className="okbab">
                  <span className="text-center okbab" style={{ color: "red" }}>
                    {sortedArr.length} Tasks
                  </span>{" "}
                  on {selectDate.toDate().toDateString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Implement;
