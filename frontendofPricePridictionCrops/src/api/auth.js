const BASE_URL = '/api/auth';

export const loginUser = async (email, password) => {
  try {
    console.log("Login Request:", {
      url: `${BASE_URL}/login`,
      data: { email, password: "***" }
    });

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const responseBody = await response.json();

    console.log("Backend Response:", {
      status: response.status,
      statusText: response.statusText,
      data: responseBody
    });

    const { success, data } = responseBody;

    if (response.ok && success) {
      const { accessToken, refreshToken } = data.tokens;
      const user = data.user;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Login successful for:", user.email);

      return { success: true, data };
    }

    return {
      success: false,
      error: responseBody.message || "Unexpected response structure from server."
    };

  } catch (error) {
    console.error("Login Error:", error);

    return {
      success: false,
      error: error.message || "Login failed. Please check backend server status."
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;

  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user.");
    }

    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Failed to update profile.");
    }

    return await response.json();
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};
