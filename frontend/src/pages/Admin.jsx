import React, { useState } from "react";
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video } from "lucide-react";
import { NavLink } from "react-router";

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "btn-warning",
      bgColor: "bg-warning/10",
      route: "/admin/update",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "btn-error",
      bgColor: "bg-error/10",
      route: "/admin/delete",
    },
    {
      id: "video",
      title: "Video Problem",
      description: "Upload And Delete Videos",
      icon: Video,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/video",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Admin Panel
          </h1>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Manage and control platform problems efficiently
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="bg-base-100 border border-base-300 rounded-2xl hover:border-primary transition"
              >
                <div className="p-8 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-4 rounded-xl mb-5`}>
                    <IconComponent size={28} className="text-base-content" />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold mb-2">{option.title}</h2>

                  {/* Description */}
                  <p className="text-base-content/60 text-sm mb-6">
                    {option.description}
                  </p>

                  {/* Action */}
                  <NavLink
                    to={option.route}
                    className={`btn ${option.color} btn-sm w-full mt-auto`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
