import React, { useState } from "react";
import firebase from "../../firebaseConfig";
import "firebase/storage";

const ImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (image) {
      try {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${image.name}`);
        await imageRef.put(image);

        // Get the download URL from Firebase Storage
        const url = await imageRef.getDownloadURL();
        onImageUpload(url); // Call the callback function with the image URL

        console.log("Image uploaded successfully");
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUploader;
