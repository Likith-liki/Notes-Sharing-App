import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary.v2;
// CLOUD_NAME=dgyfex7tl
// CLOUD_API_KEY=785645137468837
// CLOUD_API_SECRET=qAksdTSxPey8kxccmm4e_QV75d0