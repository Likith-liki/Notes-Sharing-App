import { useState } from "react";
import { authAPI } from "../utils/api";

function ChangePassword() {
const [formData, setFormData] = useState({
currentPassword: "",
newPassword: "",
confirmPassword: "",
});

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setSuccess("");

if (
  formData.newPassword !==
  formData.confirmPassword
) {
  setError("Passwords do not match");
  return;
}

if (formData.newPassword.length < 6) {
  setError("New password must be at least 6 characters");
  return;
}

try {
  setLoading(true);

  const response = await authAPI.changePassword({
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword,
  });

  setSuccess(
    response.data?.message ||
      "Password changed successfully"
  );

  setFormData({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
} catch (err) {
  console.log("Error:", err);
  console.log("Response:", err.response);

  setError(
    err.response?.data?.message ||
    "Failed to change password"
  );
} finally {
  setLoading(false);
}

};

return ( <div className="container"> <div className="auth-card card"> <h2> Change Password</h2>

    {error && (
      <div className="alert alert-error">
        {error}
      </div>
    )}

    {success && (
      <div className="alert alert-success">
        {success}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          placeholder="Current Password"
          className="form-input"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              currentPassword: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="New Password"
          className="form-input"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              newPassword: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm New Password"
          className="form-input"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
          required
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "10px",
        }}
      >
        {loading
          ? "Updating Password..."
          : "Change Password"}
      </button>
    </form>
  </div>
</div>

);
}

export default ChangePassword;