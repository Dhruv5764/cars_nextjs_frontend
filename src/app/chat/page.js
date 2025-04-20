'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation'; // ✅ Use this instead

const GET_USERS = gql`
  query GetUsers {
    usersPermissionsUsers {
    documentId
      username
      email
    }
  }
`;

const UserList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const router = useRouter();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users: {error.message}</p>;

  const handleUserClick = (user) => {
        router.push(`/chat/${user.documentId}?name=${encodeURIComponent(user.username)}`);
    
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Available Users</h2>
      <ul className="space-y-3">
        {data.usersPermissionsUsers.map((user) => (
          <li
            key={user.documentId}
            className="p-3 border rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500"
            onClick={() => handleUserClick(user)}
          >
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
