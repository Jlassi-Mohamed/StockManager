import Swal from 'sweetalert2';
export let jwt = JSON.parse(localStorage.getItem("authTokens"))
export let userData = JSON.parse(localStorage.getItem("user"))
export const from_email = "jlassi.mohamedhani@gmail.com"


export const fetchUserProjects= async () => {
  try{
    const response = await fetch('http://127.0.0.1:8000/products/projects/my/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt.access}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; 
  } catch(error) {
    console.log(error)
  }
}
export const fetchProductsData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/products/get-all/', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${jwt.access}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const uploadImage = async (image, setForm, form) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "stockmanager-profilepictures");
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dyeiuox51/image/upload", {
        method: "POST",
        body: data,
      });
  
      const result = await response.json();
      if (response.ok) {
        setForm({ ...form, image: result.url });
        Swal.fire('Success', 'Image Successfully Uploaded', 'success');
    } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Image Upload Failed', 'error');
    }
  };
  

export const fetchRolesNames = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/accounts/roles/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt.access}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.detail || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export const fetchPermissionsNames = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/accounts/permissions/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt.access}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.detail || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
}

export const getUserPermissions = () => {
    console.log('permissions = ' + userData.permissions)
    if (userData && userData.permissions) {
        return userData.permissions;
    }
    return []; 
};

export const addNotification = async (message) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/accounts/notifications/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt.access}`
          },
          body: JSON.stringify({ message: message })
        });
        alert('Notif added')
        return response.data;
    } catch (error) {
        console.error('Error adding notification:', error.response?.data || error.message);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/accounts/notifications/", {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
          }
        });
        if (response.ok)
          return response.data;
        return Swal("error", "Can't fetch notifications !")
    } catch (error) {
        console.error('Error fetching notifications:', error.response?.data || error.message);
        throw error;
    }
};



