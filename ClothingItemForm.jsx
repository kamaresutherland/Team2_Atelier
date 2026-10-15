import { useState } from "react";

const API_URL = "http://localhost:3001/api/items";
const TYPES = ["Top", "Bottom", "Dress", "Outerwear", "Shoes", "Accessory", "Other"];
const SEASONS = ["All seasons", "Spring", "Summer", "Fall", "Winter"];

const EMPTY = {
  name: "", type: "", color: "", brand: "", size: "",
  material: "", season: "", occasion: "", notes: "",
};

export default function ClothingItemForm({ imageUrl = null, onSaved }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | saved | failed

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = "Give this item a name.";
    if (!values.type) errs.type = "Choose a type.";
    if (!values.color.trim()) errs.color = "Enter a color.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("saving");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, image_url: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setStatus("failed");
        return;
      }
      setStatus("saved");
      setValues(EMPTY);
      onSaved?.(data);
    } catch {
      setStatus("failed");
    }
  };

  const field = (id, label, input, required) => (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>
        {label}{required && " *"}
      </label>
      {input}
      {errors[id] && <span role="alert" style={styles.error}>{errors[id]}</span>}
    </div>
  );

  const text = (id, placeholder) => (
    <input
      id={id} type="text" value={values[id]} onChange={set(id)}
      placeholder={placeholder} style={styles.input}
    />
  );

  const select = (id, options, placeholder) => (
    <select id={id} value={values[id]} onChange={set(id)} style={styles.input}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={styles.form}>
      <h2 style={styles.heading}>Describe your item</h2>

      {field("name", "Name", text("name", "Navy linen blazer"), true)}
      <div style={styles.row}>
        {field("type", "Type", select("type", TYPES, "Choose a type"), true)}
        {field("color", "Color", text("color", "Navy"), true)}
      </div>
      <div style={styles.row}>
        {field("brand", "Brand", text("brand", "Everlane"))}
        {field("size", "Size", text("size", "M"))}
      </div>
      <div style={styles.row}>
        {field("material", "Material", text("material", "Linen"))}
        {field("season", "Season", select("season", SEASONS, "Choose a season"))}
      </div>
      {field("occasion", "Occasion", text("occasion", "Work, dinner out"))}
      {field("notes", "Notes",
        <textarea
          id="notes" rows={3} value={values.notes} onChange={set("notes")}
          placeholder="Runs slightly small, dry clean only"
          style={{ ...styles.input, resize: "vertical" }}
        />
      )}

      <button onClick={handleSubmit} disabled={status === "saving"} style={styles.button}>
        {status === "saving" ? "Saving…" : "Save item"}
      </button>

      {status === "saved" && <p role="status" style={styles.success}>Item saved to your closet.</p>}
      {status === "failed" && !Object.keys(errors).length && (
        <p role="alert" style={styles.error}>Couldn't save the item. Check your connection and try again.</p>
      )}
    </div>
  );
}

const styles = {
  form: { maxWidth: 520, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" },
  heading: { margin: "0 0 20px", fontSize: 22 },
  row: { display: "flex", gap: 12 },
  field: { display: "flex", flexDirection: "column", flex: 1, marginBottom: 14 },
  label: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  input: { padding: "10px 12px", fontSize: 15, border: "1px solid #bbb", borderRadius: 6, font: "inherit" },
  error: { color: "#b3261e", fontSize: 13, marginTop: 4 },
  success: { color: "#1b6e3c", fontSize: 14 },
  button: {
    padding: "12px 20px", fontSize: 15, fontWeight: 600, color: "#fff",
    background: "#22303c", border: "none", borderRadius: 6, cursor: "pointer",
  },
};
