import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Finance from "@/components/pages/Finance";
import Weather from "@/components/pages/Weather";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="farms" element={<Farms />} />
          <Route path="crops" element={<Crops />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="finance" element={<Finance />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;