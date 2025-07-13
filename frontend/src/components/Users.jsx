import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [fillerUsers, setFillerUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  const excludeCurrentUser = (usersList) => {
    return usersList.filter(user => user._id.toString() !== currentUserId?.toString());
  };

  const debouncedSearch = useRef(
    debounce(async (value) => {
      try {
        const res = await axios.get(`/api/v1/user/bulk?filter=${value}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const filtered = excludeCurrentUser(res.data.userList);
        setUsers(filtered);
      } catch (err) {
        console.error("Error searching users:", err);
      }
    }, 500)
  ).current;

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const res = await axios.get("/api/v1/user/recent", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRecentUsers(excludeCurrentUser(res.data));
      } catch (err) {
        console.error("Error fetching recent users:", err);
      }
    }

    async function fetchFillerUsers() {
      try {
        const res = await axios.get("/api/v1/user/bulk?filter=", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFillerUsers(excludeCurrentUser(res.data.userList));
      } catch (err) {
        console.error("Error fetching filler users:", err);
      }
    }

    fetchRecentUsers();
    fetchFillerUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (recentUsers.length > 0 || fillerUsers.length > 0) {
      const combined = [...recentUsers, ...fillerUsers].filter(
        (user, index, self) => index === self.findIndex((u) => u._id === user._id)
      );
      setUsers(excludeCurrentUser(combined));
    }
  }, [recentUsers, fillerUsers]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      const combined = [...recentUsers, ...fillerUsers].filter(
        (user, index, self) => index === self.findIndex((u) => u._id === user._id)
      );
      setUsers(excludeCurrentUser(combined));
    } else {
      debouncedSearch(value);
    }
  };

  return (
    <>
      <div className="font-bold mt-10 mx-4 text-lg">Users:</div>
      <div className="m-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 bg-[#1E1E1E] text-[#E0E0E0] border border-gray-600 rounded-md placeholder-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {users.map((user) => (
          <User key={user._id} user={user} navigate={navigate} />
        ))}
      </div>
    </>
  );
};

function User({ user, navigate }) {
  return (
    <div className="flex justify-between items-center p-4 rounded-xl shadow-md bg-[#1E1E1E]">
      <div className="flex items-center space-x-3">
        <Avatar name={user.firstName} />
        <div className="text-md font-medium">
          {user.firstName} {user.lastName}
        </div>
      </div>
      <button
        onClick={() =>
          navigate(`/send/${user._id}`, {
            state: { firstName: user.firstName, lastName: user.lastName },
          })
        }
        className="btn text-white px-4 py-1 rounded hover:btn transition"
      >
        Send
      </button>
    </div>
  );
}
