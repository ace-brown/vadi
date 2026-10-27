import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { ListingResponse, ProviderType } from "@/types";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "nullableNumber" // empty means null (e.g. unlimited data)
  | "select"
  | "checkbox"
  | "date"
  | "list" // comma-separated list of strings
  | "provider";

export type Field = {
  name: string; // dot paths like "coverage.nationwide" are allowed
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
};

export type Column = { label: string; value: (item: Item) => React.ReactNode };

type Item = Record<string, unknown> & { _id: string };
type FormState = Record<string, string | boolean>;

function getPath(item: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown> | undefined)?.[key], item);
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let current = target;
  keys.slice(0, -1).forEach((key) => {
    current[key] = (current[key] as Record<string, unknown>) ?? {};
    current = current[key] as Record<string, unknown>;
  });
  current[keys[keys.length - 1]] = value;
}

function toForm(fields: Field[], item?: Item): FormState {
  const form: FormState = {};
  fields.forEach((field) => {
    const value = item ? getPath(item, field.name) : undefined;
    if (field.type === "checkbox") {
      form[field.name] = value === undefined ? true : Boolean(value);
    } else if (field.type === "provider") {
      form[field.name] = (value as ProviderType | string | undefined) && typeof value === "object"
        ? (value as ProviderType)._id
        : (value as string) ?? "";
    } else if (field.type === "date") {
      form[field.name] = value ? String(value).slice(0, 10) : "";
    } else if (field.type === "list") {
      form[field.name] = Array.isArray(value) ? value.join(", ") : "";
    } else {
      form[field.name] = value === null || value === undefined ? "" : String(value);
    }
  });
  return form;
}

function toBody(fields: Field[], form: FormState) {
  const body: Record<string, unknown> = {};
  fields.forEach((field) => {
    const raw = form[field.name];
    let value: unknown;
    switch (field.type) {
      case "checkbox":
        value = Boolean(raw);
        break;
      case "number":
        if (raw === "") return;
        value = Number(raw);
        break;
      case "nullableNumber":
        value = raw === "" ? null : Number(raw);
        break;
      case "date":
        value = raw ? new Date(String(raw)).toISOString() : null;
        break;
      case "list":
        value = String(raw).split(",").map((part) => part.trim()).filter(Boolean);
        break;
      default:
        value = raw;
    }
    setPath(body, field.name, value);
  });
  return body;
}

function FieldInput({
  field,
  value,
  providers,
  onChange,
}: {
  field: Field;
  value: string | boolean;
  providers: ProviderType[];
  onChange: (value: string | boolean) => void;
}) {
  const id = `field-${field.name}`;
  const label = (
    <span className="block text-sm font-medium">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
      {field.hint && <span className="block text-xs font-normal text-gray-500">{field.hint}</span>}
    </span>
  );

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  const selectOptions =
    field.type === "provider"
      ? providers.map((provider) => ({ value: provider._id, label: provider.name }))
      : field.options;

  return (
    <label htmlFor={id} className="block space-y-1">
      {label}
      {selectOptions ? (
        <select
          id={id}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          value={String(value)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">–</option>
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <Textarea id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input
          id={id}
          type={field.type === "date" ? "date" : field.type.endsWith("umber") ? "number" : "text"}
          step="any"
          value={String(value)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

// List, create, edit and delete one kind of item through the generic API
export default function ResourceAdmin({
  endpoint,
  fields,
  columns,
  sort,
  hasActive = false,
}: {
  endpoint: string;
  fields: Field[];
  columns: Column[];
  sort: string;
  hasActive?: boolean;
}) {
  const auth = useContext(AuthContext);
  const [items, setItems] = useState<Item[]>([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [errors, setErrors] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<ListingResponse<Item>>(
        `${endpoint}?includeInactive=true&limit=100&sort=${sort}`,
        { token: auth.token }
      );
      setItems(data.items);
    } catch (err) {
      toast.error(String(err instanceof Error ? err.message : err));
    }
  }, [endpoint, sort, auth.token]);

  useEffect(() => {
    load();
    if (fields.some((field) => field.type === "provider")) {
      apiFetch<ListingResponse<ProviderType>>("/api/providers?limit=100").then((data) => setProviders(data.items));
    }
  }, [load, fields]);

  function startEdit(item: Item | "new") {
    setEditing(item);
    setForm(toForm(fields, item === "new" ? undefined : item));
    setErrors([]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const isNew = editing === "new";
    try {
      await apiFetch(isNew ? endpoint : `${endpoint}/${(editing as Item)._id}`, {
        method: isNew ? "POST" : "PATCH",
        token: auth.token,
        body: toBody(fields, form),
      });
      toast.success(isNew ? "Created" : "Saved");
      setEditing(null);
      load();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors?.map((error) => `${error.field}: ${error.message}`) ?? [err.message]);
      }
    }
  }

  async function remove(item: Item) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await apiFetch(`${endpoint}/${item._id}`, { method: "DELETE", token: auth.token });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  async function toggleActive(item: Item) {
    await apiFetch(`${endpoint}/${item._id}`, { method: "PATCH", token: auth.token, body: { active: !item.active } });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{items.length} items</p>
        <Button size="sm" onClick={() => startEdit("new")}>
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {editing && (
        <Card className="p-4">
          <form onSubmit={save} className="space-y-4">
            <h2 className="font-semibold">{editing === "new" ? "New item" : "Edit item"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  providers={providers}
                  onChange={(value) => setForm((prev) => ({ ...prev, [field.name]: value }))}
                />
              ))}
            </div>
            {errors.length > 0 && (
              <ul className="text-sm text-red-600 list-disc pl-5" role="alert">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className="p-3 font-medium">
                  {column.label}
                </th>
              ))}
              {hasActive && <th className="p-3 font-medium">Active</th>}
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className={`border-t ${hasActive && !item.active ? "text-gray-400" : ""}`}>
                {columns.map((column) => (
                  <td key={column.label} className="p-3">
                    {column.value(item)}
                  </td>
                ))}
                {hasActive && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      aria-label="Active"
                      checked={Boolean(item.active)}
                      onChange={() => toggleActive(item)}
                    />
                  </td>
                )}
                <td className="p-3 text-right whitespace-nowrap">
                  <button type="button" aria-label="Edit" className="p-1 hover:text-blue-700" onClick={() => startEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" aria-label="Delete" className="p-1 hover:text-red-600" onClick={() => remove(item)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
