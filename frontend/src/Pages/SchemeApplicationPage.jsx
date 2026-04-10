import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSchemeConfig } from "../data/schemeFormConfig";
import { createApplication } from "../utils/applications";

export default function SchemeApplicationPage({ auth }) {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const schemeFromState = location.state?.scheme || null;
  const detectedState = location.state?.detectedState || "Jharkhand";
  const [formData, setFormData] = useState({});
  const [docFiles, setDocFiles] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scheme = useMemo(
    () =>
      schemeFromState || {
        id: schemeId,
        name: `Scheme ${schemeId}`,
        category: "General",
        mode: "Online"
      },
    [schemeFromState, schemeId]
  );

  const config = getSchemeConfig(scheme.id);
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const onChangeField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const isValidDocumentFile = (file) => {
    if (!file) return false;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    return allowed.includes(file.type);
  };

  const getMissingOrInvalidDocs = () => {
    return config.documents.filter((doc) => !isValidDocumentFile(docFiles[doc]));
  };

  const uploadFiles = async () => {
    const docsToUpload = config.documents
      .filter((doc) => docFiles[doc])
      .map((doc) => ({ documentType: doc, file: docFiles[doc] }));

    if (!docsToUpload.length) return [];

    const body = new FormData();
    docsToUpload.forEach((item) => {
      body.append("files", item.file);
      body.append("documentTypes", item.documentType);
    });

    const res = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      body
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.files || [];
  };

  const onSubmit = async () => {
    setError("");
    const missing = config.fields.find((f) => f.required && !formData[f.key]);
    if (missing) {
      setError(`Please fill ${missing.label}`);
      return;
    }

    const missingDocs = getMissingOrInvalidDocs();
    if (missingDocs.length) {
      setError(`Please upload valid files for: ${missingDocs.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const uploaded = await uploadFiles();
      const now = new Date();
      createApplication({
        id: `APP-${now.getTime()}`,
        schemeId: scheme.id,
        schemeName: scheme.name,
        category: scheme.category || "General",
        userId: auth?.userId || "",
        state: detectedState,
        status: "Pending",
        progress: 20,
        filed: now.toLocaleDateString(),
        formData,
        requiredDocuments: config.documents,
        uploadedFiles: uploaded,
        timeline: [
          { label: "Form Submitted", done: true, date: now.toLocaleDateString() },
          { label: "Documents Verification", done: false, date: "~3 days" },
          { label: "Approval Pending", done: false, date: "~7 days" }
        ]
      });
      localStorage.removeItem("pendingSchemeApply");
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = (file) => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      return <img src={url} alt={file.name} className="mt-2 w-full h-28 object-cover rounded-lg border border-stone-200" />;
    }
    return (
      <div className="mt-2 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
        PDF selected: {file.name}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-stone-100 rounded-3xl p-6">
        <h1 className="font-serif text-3xl text-stone-900">{scheme.name}</h1>
        <p className="text-sm text-stone-500 mt-1">Apply for this scheme in {detectedState}</p>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-stone-500 mb-2">
            <span>Step {step} of 3</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-3 text-xs">
            <span className={step >= 1 ? "text-emerald-700" : "text-stone-400"}>Details</span>
            <span className={step >= 2 ? "text-emerald-700" : "text-stone-400"}>Documents</span>
            <span className={step >= 3 ? "text-emerald-700" : "text-stone-400"}>Review</span>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <label className="text-xs text-stone-500">{field.label}{field.required ? "*" : ""}</label>
                <input
                  type={field.type}
                  value={formData[field.key] || ""}
                  onChange={(e) => onChangeField(field.key, e.target.value)}
                  className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-stone-800 mb-2">Upload required documents</p>
            <div className="space-y-3">
              {config.documents.map((doc) => {
                const selected = docFiles[doc];
                const valid = selected ? isValidDocumentFile(selected) : false;
                return (
                  <div key={doc} className="rounded-xl border border-stone-200 p-3">
                    <label className="text-sm font-medium text-stone-800">{doc}</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setDocFiles((prev) => ({ ...prev, [doc]: file || null }));
                      }}
                      className="mt-2 block text-sm"
                    />
                    <p className={`text-xs mt-1 ${selected && !valid ? "text-rose-600" : "text-stone-500"}`}>
                      {selected ? (valid ? `Selected: ${selected.name}` : "Invalid type. Use PDF/JPG/PNG/WEBP.") : "No file selected"}
                    </p>
                    {selected && valid && renderPreview(selected)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 text-sm text-stone-700">
            <p className="font-medium mb-2">Review</p>
            <p>Scheme: {scheme.name}</p>
            <p>State: {detectedState}</p>
            <p>Uploaded files: {Object.values(docFiles).filter(Boolean).length}</p>
          </div>
        )}

        {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="px-4 py-2 rounded-xl border border-stone-200 text-sm">
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => {
                setError("");
                if (step === 2) {
                  const missingDocs = getMissingOrInvalidDocs();
                  if (missingDocs.length) {
                    setError(`Please upload valid files for: ${missingDocs.join(", ")}`);
                    return;
                  }
                }
                setStep(step + 1);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm"
            >
              Next
            </button>
          ) : (
            <button onClick={onSubmit} disabled={loading} className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm">
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
