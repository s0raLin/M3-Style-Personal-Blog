import { Toaster } from "@/app/components/ui/sonner";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <div>
      <AdminDashboard />
      <Toaster richColors position="top-right" />
    </div>
  );
}
