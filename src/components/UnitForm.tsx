import React from "react";
import { useTranslation } from "react-i18next";
import type { Unit } from "@fabfabper/simpledispatch-shared-models/typescript/Unit";

interface UnitFormProps {
  unit?: Unit | null;
  onChange?: (unit: Partial<Unit>) => void;
  onSubmit?: (unit: Partial<Unit>) => void;
  onCancel?: () => void;
}

interface FormState {
  id: string;
  type: string;
  status: number;
  latitude: number;
  longitude: number;
}

function UnitForm({ unit, onChange, onSubmit, onCancel }: UnitFormProps) {
  const { t } = useTranslation();
  const isEdit = !!unit;
  const [form, setForm] = React.useState<FormState>(
    unit && unit.position
      ? {
          id: unit.id,
          type: unit.type,
          status: unit.status,
          latitude: unit.position.latitude,
          longitude: unit.position.longitude,
        }
      : { id: "", type: "", status: 0, latitude: 0, longitude: 0 }
  );

  React.useEffect(() => {
    if (unit && unit.position) {
      setForm({
        id: unit.id,
        type: unit.type,
        status: unit.status,
        latitude: unit.position.latitude,
        longitude: unit.position.longitude,
      });
    } else {
      setForm({ id: "", type: "", status: 0, latitude: 0, longitude: 0 });
    }
  }, [unit]);

  const handleChange = (field: keyof FormState, value: string | number) => {
    setForm({ ...form, [field]: value });
    // Note: onChange callback removed due to type complexity
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();

        if (onSubmit) {
          onSubmit({
            id: form.id,
            type: form.type,
            status: form.status,
            position: {
              latitude: form.latitude,
              longitude: form.longitude,
            },
          });
        }
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
          disabled={true}
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
          onChange={(e) =>
            handleChange("status", parseInt(e.target.value) || 0)
          }
          min="0"
          max="10"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("latitude")}
        </label>
        <input
          type="float"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.latitude}
          onChange={(e) =>
            handleChange("latitude", parseFloat(e.target.value) || 0)
          }
          min="-90"
          max="90"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("longitude")}
        </label>
        <input
          type="float"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.longitude}
          onChange={(e) =>
            handleChange("longitude", parseFloat(e.target.value) || 0)
          }
          min="-180"
          max="180"
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
