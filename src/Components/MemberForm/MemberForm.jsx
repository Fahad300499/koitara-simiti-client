import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MemberForm = ({ member }) => {
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    name: member?.name || "",
    mobile: member?.mobile || "",
    idNo: member?.idNo || "",
    photo: null,
    sign: null,
  });

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: URL.createObjectURL(e.target.files[0]),
    });
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`member-form-${formData.name}.pdf`);
  };

  return (
    <div className="p-6">
      {/* INPUT FORM */}
      <div className="grid gap-4 mb-6">
        <input
          placeholder="নাম"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="মোবাইল"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="সদস্য আইডি"
          value={formData.idNo}
          onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
          className="border p-2 rounded"
        />

        <label>
          ছবি আপলোড
          <input type="file" name="photo" onChange={handleFileChange} />
        </label>

        <label>
          সাইন আপলোড
          <input type="file" name="sign" onChange={handleFileChange} />
        </label>
      </div>

      {/* PDF CONTENT */}
      <div
        ref={pdfRef}
        className="bg-white p-6 w-[794px] mx-auto border"
      >
        <h1 className="text-center text-2xl font-bold mb-6">
          সদস্য আবেদন ফরম
        </h1>

        <p><strong>নাম:</strong> {formData.name}</p>
        <p><strong>মোবাইল:</strong> {formData.mobile}</p>
        <p><strong>সদস্য আইডি:</strong> {formData.idNo}</p>

        <div className="flex justify-between mt-6">
          {formData.photo && (
            <div>
              <p>ছবি</p>
              <img src={formData.photo} className="w-24 h-24 border" />
            </div>
          )}

          {formData.sign && (
            <div>
              <p>সাইন</p>
              <img src={formData.sign} className="w-32 h-16 border" />
            </div>
          )}
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold"
      >
        PDF ডাউনলোড করুন
      </button>
    </div>
  );
};

export default MemberForm;
