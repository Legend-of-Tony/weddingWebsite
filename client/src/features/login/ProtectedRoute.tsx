import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/admin/session`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          navigate("/admin");
        } else {
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
