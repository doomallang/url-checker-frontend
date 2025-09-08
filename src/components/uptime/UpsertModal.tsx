"use client";
import { HealthCheckRequest } from "@/interfaces/interface.health.check";

export default function UpsertModal({
  open,
  onClose,
  editingId,
  form,
  setForm,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  editingId: number | null;
  form: HealthCheckRequest;
  setForm: (f: HealthCheckRequest) => void;
  onSubmit: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Check" : "New Check"}
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com/health"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Interval (sec)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={form.intervalSeconds}
                min={10}
                onChange={(e) =>
                  setForm({
                    ...form,
                    intervalSeconds: Number(e.target.value) || 60,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as any })
                }
              >
                <option value="HTTP">HTTP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
          >
            {editingId ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
