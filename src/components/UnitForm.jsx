import React from "react";
import { useTranslation } from "react-i18next";

function UnitForm({ unit, onChange, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = !!unit;
  const [form, setForm] = React.useState(
    unit
      ? {
          id: unit.id,
          type: unit.type,
          status: unit.status,
          latitude: unit.latitude,
          longitude: unit.longitude,
        }
      : { id: "", type: "", status: 0, latitude: "", longitude: "" }
  );

  React.useEffect(() => {
    if (unit) {
      setForm({
        id: unit.id,
        type: unit.type,
        status: unit.status,
        latitude: unit.latitude,
        longitude: unit.longitude,
      });
    } else {
      setForm({ id: "", type: "", status: 0, latitude: "", longitude: "" });
    }
  }, [unit]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
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
            status: parseInt(form.status, 10),
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude),
          });
      }}
    >
      <h3 className="text-xl font-bold mb-2">
        {isEdit ? t("edit_unit") : t("add_unit")}
      </h3>
      <div>
        <label className="block text-sm font-semibold mb-1">{t("id")}</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          value={form.id}
          onChange={(e) => handleChange("id", e.target.value)}
          required
          disabled={isEdit}
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
          {t("status")}
        </label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
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
          value={form.latitude}
          onChange={(e) => handleChange("latitude", e.target.value)}
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
          value={form.longitude}
          onChange={(e) => handleChange("longitude", e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEdit ? t("save_changes") : t("add_unit")}
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

export default UnitForm;
