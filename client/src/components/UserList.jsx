import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = ({ onCallUser }) => {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/api/auth/users', { userId: currentUser._id });
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Available Users</h2>
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user._id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <button
                            onClick={() => onCallUser(user._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Call
                        </button>
                    </div>
                ))}
                {users.length === 0 && <p className="text-gray-500">No other users found.</p>}
            </div>
        </div>
    );
};

export default UserList;
