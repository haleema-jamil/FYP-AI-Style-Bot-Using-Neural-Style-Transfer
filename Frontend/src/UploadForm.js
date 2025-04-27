import React from 'react';
import './css/style.css';

const UploadForm = () => {
  const showPreview = (imageId, fileId, previewId) => {
    const file = document.getElementById(fileId).files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(imageId).src = e.target.result;
      document.getElementById(previewId).style.display = 'none';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center">
      <h1>Upload Your Preferred Images</h1>
      <img className="image-back" title="Main Image" src="/Images/Image-01.jpg" alt="Main Image" />
      <div className="multiple-forms">
        <div className="form-input">
          <h5>Reference Image For Style</h5>
          <div className="preview">
            <img className="preview-img" src="/Images/Mockups-22.png" title="Input1" id="image-1" alt="Preview" />
            <img className="preview-img" src="/Images/Images_Icon-21.png" title="Image Icon" id="preview-img1" alt="Preview Icon" />
          </div>
          <label htmlFor="file-ip-1">Upload Image</label>
          <input type="file" id="contentImage" accept="image/*" />
          <input type="file" id="file-ip-1" accept="image/*" onChange={() => showPreview('image-1', 'file-ip-1', 'preview-img1')} />
        </div>

        <div className="form-input">
          <h5>Reference Image For Pattern</h5>
          <div className="preview">
            <img className="preview-img" src="/Images/Mockups-22.png" title="Input2" id="image-2" alt="Preview" />
            <img className="preview-img" src="/Images/Images_Icon-21.png" title="Image Icon" id="preview-img2" alt="Preview Icon" />
          </div>
          <label htmlFor="file-ip-2">Upload Image</label>
          <input type="file" id="styleImage" accept="image/*" />
          <input type="file" id="file-ip-2" accept="image/*" onChange={() => showPreview('image-2', 'file-ip-2', 'preview-img2')} />
        </div>

        <div className="form-input-color">
          <h5>Reference For Colour</h5>
          <div className="preview">
            <input type="color" id="favcolor" name="favcolor" defaultValue="#ff0000" />
          </div>
          <label htmlFor="favcolor">Select Color</label>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
