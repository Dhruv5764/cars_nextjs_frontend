'use client';

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
import client from '../../../lib/apolloClient';
import { GET_CURRENT_USER } from '../../graphql/mutations';
import { getUserFromLocalStorage } from '../../utils';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user?.id) setUserId(user.id);
  }, []);

  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    variables: { id: userId },
    client,
    skip: !userId,
    onCompleted: (data) => {
      if (data?.me) {
        setFormData({ username: data.me.username, email: data.me.email });
      }
    },
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Update Profile →', formData);
    // TODO: Add mutation
    setShowEditModal(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Change Password →', passwords);
    // TODO: Add mutation
    setShowPasswordModal(false);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (!userId || loading) {
    return <div className="text-center mt-20 text-gray-600 text-lg">Loading your profile...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-20">Error: {error.message}</div>;
  }

  const user = data?.me;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-blue-700 border-b pb-4">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 uppercase">User ID</label>
            <p className="text-lg font-medium text-gray-600">{user.id}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 uppercase">Username</label>
            <p className="text-lg font-medium text-gray-600">{user.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 uppercase">Email</label>
            <p className="text-lg font-medium text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
            zIndex: 50, // Ensures it's above other content
          }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border rounded-md text-gray-700"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md text-gray-700"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
            zIndex: 50, // Ensures it's above other content
          }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Current Password"
                  className="w-full p-3 border rounded-md text-gray-700"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className="w-full p-3 border rounded-md text-gray-700"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  className="w-full p-3 border rounded-md text-gray-700"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
