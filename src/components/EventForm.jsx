import React from "react";
import { useTranslation } from "react-i18next";

function EventForm({ event, onChange, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = !!event;
  const [form, setForm] = React.useState(
    event
      ? {
          location: event.location,
          type: event.type,
          position: [event.position[0], event.position[1]],
        }
      : { name: "", type: "", position: ["", ""] }
  );

  React.useEffect(() => {
    if (event) {
      setForm({
        location: event.location,
        type: event.type,
        position: [event.position[0], event.position[1]],
      });
    } else {
      setForm({ location: "", type: "", position: ["", ""] });
    }
  }, [event]);

  const handleChange = (field, value) => {
    if (field === "position") {
      setForm({ ...form, position: value });
    } else {
      setForm({ ...form, [field]: value });
    }
    if (onChange) onChange({ ...form, [field]: value });
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit)
          onSubmit({
            ...form,
            position: [
              parseFloat(form.position[0]),
              parseFloat(form.position[1]),
            ],
          });
      }}
    >
      <h3 className="text-xl font-bold mb-2">
        {isEdit ? t("edit_event") : t("add_event")}
      </h3>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("location")}
        </label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">{t("type")}</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("latitude")}
        </label>
        <input
          type="number"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.position[0]}
          onChange={(e) =>
            handleChange("position", [e.target.value, form.position[1]])
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("longitude")}
        </label>
        <input
          type="number"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.position[1]}
          onChange={(e) =>
            handleChange("position", [form.position[0], e.target.value])
          }
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEdit ? t("save_changes") : t("add_event")}
        </button>
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

export default EventForm;
