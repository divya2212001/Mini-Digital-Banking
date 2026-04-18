import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Profile</h1>
      <p className="text-slate-500 mb-8">Your registered identity.</p>
      <div className="max-w-lg rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-slate-500">Name</p>
          <p className="text-lg">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Email</p>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Role</p>
          <p className="text-lg capitalize">{user?.role}</p>
        </div>
        {user?.createdAt && (
          <div>
            <p className="text-xs uppercase text-slate-500">Member since</p>
            <p className="text-lg text-slate-300">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
