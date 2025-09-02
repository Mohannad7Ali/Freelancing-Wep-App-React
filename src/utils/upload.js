import axios from "axios";

const upload = async (file) => {
  /**
   *  FormData: كائن يستخدم لإرسال بيانات النموذج (خاصة الملفات)
      نضيف الملف المراد رفعه باستخدام data.append("file", file)
      نضيف إعدادات الرفع المسبق (upload preset) باسم "syverr"
   */
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "syverr");
  
  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/dbiag6wlr/upload`, data); //نستخدم axios.post لإرسال طلب HTTP POST إلى Cloudinary

    const { url } = res.data;
    console.log(url)
    return url;
  } catch (err) {
    console.log("error in uploading images : "+err);
  }
};


export default upload;
