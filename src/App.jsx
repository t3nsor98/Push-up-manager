import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Auth from "./components/Auth";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Dumbbell,
  TrendingUp,
  Calendar as CalendarIcon,
  Edit2,
} from "lucide-react";

const ExerciseTypeCard = ({ type, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-lg transition-all ${
      selected
        ? "bg-blue-500 text-white"
        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
    }`}
  >
    <Dumbbell
      className={`w-6 h-6 ${
        selected ? "text-white" : "text-gray-600 dark:text-gray-300"
      }`}
    />
    <p className="mt-2 font-medium">{type}</p>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [exerciseType, setExerciseType] = useState("Normal");
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [view, setView] = useState("input");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, `pushups/${user.uid}/logs`),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddPushUps = async () => {
    if (!user || reps <= 0 || sets <= 0) return;

    await addDoc(collection(db, `pushups/${user.uid}/logs`), {
      exerciseType,
      reps: Number(reps),
      sets: Number(sets),
      totalPushUps: Number(reps) * Number(sets),
      timestamp: getLocalDateString(),
    });

    resetForm();
  };

  const resetForm = () => {
    setReps(0);
    setSets(0);
    setSelectedLog(null);
    setSelectedDate(null);
    setShowEditModal(false);
  };

  const handleDayClick = (value) => {
    const dateString = getLocalDateString(value);
    setSelectedDate(dateString);
    const log = logs.find((log) => log.timestamp === dateString);

    if (log) {
      setExerciseType(log.exerciseType);
      setReps(log.reps);
      setSets(log.sets);
      setSelectedLog(log);
      setShowEditModal(true);
    } else {
      resetForm();
      setSelectedDate(dateString);
    }
  };

  const handleUpdatePushUps = async () => {
    if (!selectedLog || reps <= 0 || sets <= 0) return;

    const logRef = doc(db, `pushups/${user.uid}/logs`, selectedLog.id);
    await updateDoc(logRef, {
      exerciseType,
      reps: Number(reps),
      sets: Number(sets),
      totalPushUps: Number(reps) * Number(sets),
    });

    resetForm();
  };

  const handleNumberChange = (value, setter) => {
    if (value === "") {
      setter(0);
    } else {
      const num = parseInt(value);
      if (!isNaN(num) && num >= 0) {
        setter(num);
      }
    }
  };

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Exercise - {selectedDate}
          </h3>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {["Normal", "Incline", "Decline"].map((type) => (
            <ExerciseTypeCard
              key={type}
              type={type}
              selected={exerciseType === type}
              onClick={() => setExerciseType(type)}
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reps per set
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={reps || ""}
              onChange={(e) => handleNumberChange(e.target.value, setReps)}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of sets
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={sets || ""}
              onChange={(e) => handleNumberChange(e.target.value, setSets)}
              min="0"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpdatePushUps}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Exercise
            </button>
            <button
              onClick={resetForm}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const chartData = logs
    .slice(-7)
    .reverse()
    .map((log) => ({
      date: new Date(log.timestamp).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      pushups: log.totalPushUps,
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Push-Up Tracker
          </h1>
          <Auth setUser={setUser} />
        </div>

        {user && (
          <div className="space-y-6">
            {/* User Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full ring-2 ring-blue-500"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Welcome back, {user.displayName}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Total pushups:{" "}
                    {logs.reduce((acc, log) => acc + log.totalPushUps, 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex space-x-4">
              <button
                onClick={() => setView("input")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  view === "input"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Dumbbell className="w-5 h-5" />
                <span>Log Exercise</span>
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  view === "calendar"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
                <span>Calendar</span>
              </button>
            </div>

            {view === "input" ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Log New Exercise
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {["Normal", "Incline", "Decline"].map((type) => (
                    <ExerciseTypeCard
                      key={type}
                      type={type}
                      selected={exerciseType === type}
                      onClick={() => setExerciseType(type)}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reps per set
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      value={reps || ""}
                      onChange={(e) =>
                        handleNumberChange(e.target.value, setReps)
                      }
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of sets
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      value={sets || ""}
                      onChange={(e) =>
                        handleNumberChange(e.target.value, setSets)
                      }
                      min="0"
                    />
                  </div>

                  <button
                    onClick={handleAddPushUps}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Log Exercise
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <Calendar
                  onClickDay={handleDayClick}
                  className="w-full rounded-lg border-0 shadow-none"
                  tileClassName={({ date }) => {
                    const dayData = logs.find(
                      (log) => log.timestamp === getLocalDateString(date)
                    );
                    return dayData
                      ? "bg-blue-100 dark:bg-blue-900 rounded-lg"
                      : "";
                  }}
                  tileContent={({ date }) => {
                    const dayData = logs.find(
                      (log) => log.timestamp === getLocalDateString(date)
                    );
                    return dayData ? (
                      <div className="flex flex-col items-center">
                        <p className="text-blue-500 dark:text-blue-300 font-bold mt-1">
                          {dayData.totalPushUps}
                        </p>
                        <Edit2 className="w-4 h-4 text-blue-500 dark:text-blue-300 mt-1" />
                      </div>
                    ) : null;
                  }}
                  maxDate={new Date()}
                />
              </div>
            )}

            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Weekly Progress
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="pushups"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {showEditModal && <EditModal />}
    </div>
  );
};

export default App;
