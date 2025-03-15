import React from "react";
import { Outlet } from "react-router-dom";
import EnhancedClientDashboard from "../ClientDashboard"; // Your dashboard component

const ClientLayout = () => {
  return (
    <div>
        <EnhancedClientDashboard /> {/* The dashboard for all /client routes */}
      <main>
        <Outlet /> {/* This is where nested routes like /client/players will render */}
      </main>
    </div>
  );
};

export default ClientLayout;
