"use client";

export interface Option {
  value: string;
  label: string;
}

export type IntakeData = Record<string, string | string[]>;

export function getStr(data: IntakeData, name: string): string {
  const v = data[name];
  return typeof v === "string" ? v : "";
}

export function getArr(data: IntakeData, name: string): string[] {
  const v = data[name];
  return Array.isArray(v) ? v : [];
}

export const inputClass =
  "w-full min-h-11 rounded-sm border border-near-black/15 bg-white px-3 py-2.5 text-sm text-near-black placeholder:text-stone outline-none transition-colors focus:border-forest";
export const labelClass = "block text-sm font-medium text-near-black mb-1.5";
export const subLabelClass = "block text-xs font-medium text-stone mb-1.5";
export const helpClass = "text-xs text-stone mb-3 max-w-[60ch] leading-relaxed";
export const errorTextClass = "mt-1.5 text-xs text-red-700";
export const choiceClass =
  "flex items-start gap-3 rounded-sm border border-near-black/15 bg-white px-3.5 py-3 min-h-11 cursor-pointer transition-colors has-[:checked]:border-deep-forest has-[:checked]:bg-warm-gray";

export function FieldWrap({
  label,
  help,
  error,
  required,
  htmlFor,
  children,
}: {
  label?: string;
  help?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className={labelClass} htmlFor={htmlFor}>
          {label}
          {required && <span className="text-forest ml-0.5">*</span>}
        </label>
      )}
      {help && <p className={helpClass}>{help}</p>}
      {children}
      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  help,
  required,
  error,
  autoComplete,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <FieldWrap label={label} help={help} error={error} required={required} htmlFor={`f-${name}`}>
      <input
        id={`f-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(name, e.target.value)}
        className={`${inputClass}${error ? " border-red-400" : ""}`}
        aria-invalid={!!error}
      />
    </FieldWrap>
  );
}

export function TextAreaField({
  name,
  label,
  value,
  onChange,
  placeholder,
  help,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  help?: string;
}) {
  return (
    <FieldWrap label={label} help={help} htmlFor={`f-${name}`}>
      <textarea
        id={`f-${name}`}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(e) => onChange(name, e.target.value)}
        className={`${inputClass} resize-y`}
      />
    </FieldWrap>
  );
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  help,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: Option[];
  help?: string;
}) {
  return (
    <FieldWrap label={label} help={help} htmlFor={`f-${name}`}>
      <select
        id={`f-${name}`}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

export function RadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  help,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: Option[];
  help?: string;
}) {
  return (
    <FieldWrap label={label} help={help}>
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <label key={o.value} className={choiceClass}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(name, o.value)}
              className="mt-0.5 accent-deep-forest"
            />
            <span className="text-sm text-near-black">{o.label}</span>
          </label>
        ))}
      </div>
    </FieldWrap>
  );
}

export function CheckboxGroup({
  name,
  label,
  value,
  onChange,
  options,
  help,
  maxSelect,
}: {
  name: string;
  label?: string;
  value: string[];
  onChange: (name: string, value: string[]) => void;
  options: Option[];
  help?: string;
  maxSelect?: number;
}) {
  function toggle(optionValue: string) {
    const has = value.includes(optionValue);
    if (has) {
      onChange(name, value.filter((v) => v !== optionValue));
      return;
    }
    if (maxSelect && value.length >= maxSelect) return;
    onChange(name, [...value, optionValue]);
  }

  return (
    <FieldWrap label={label} help={help}>
      <div className="flex flex-col gap-2">
        {options.map((o) => {
          const checked = value.includes(o.value);
          const disabled = !checked && !!maxSelect && value.length >= maxSelect;
          return (
            <label
              key={o.value}
              className={`${choiceClass}${disabled ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                name={name}
                value={o.value}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(o.value)}
                className="mt-0.5 accent-deep-forest"
              />
              <span className="text-sm text-near-black">{o.label}</span>
            </label>
          );
        })}
      </div>
    </FieldWrap>
  );
}

export function ScaleField({
  name,
  label,
  value,
  onChange,
  minLabel,
  maxLabel,
  help,
  steps = 5,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  minLabel: string;
  maxLabel: string;
  help?: string;
  steps?: number;
}) {
  const options = Array.from({ length: steps }, (_, i) => String(i + 1));
  return (
    <FieldWrap label={label} help={help}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-stone min-w-[9ch]">{minLabel}</span>
        <div className="flex gap-2">
          {options.map((v) => (
            <label
              key={v}
              className={`flex h-11 w-11 items-center justify-center rounded-sm border border-near-black/15 bg-white text-sm cursor-pointer transition-colors has-[:checked]:bg-deep-forest has-[:checked]:border-deep-forest has-[:checked]:text-white`}
            >
              <input
                type="radio"
                name={name}
                value={v}
                checked={value === v}
                onChange={() => onChange(name, v)}
                className="sr-only"
              />
              {v}
            </label>
          ))}
        </div>
        <span className="text-xs text-stone min-w-[9ch]">{maxLabel}</span>
      </div>
    </FieldWrap>
  );
}

export interface LikertStatement {
  name: string;
  label: string;
}

const LIKERT_COLUMNS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export function LikertGrid({
  label,
  help,
  statements,
  value,
  onChange,
}: {
  label?: string;
  help?: string;
  statements: LikertStatement[];
  value: Record<string, string>;
  onChange: (name: string, val: string) => void;
}) {
  return (
    <FieldWrap label={label} help={help}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[560px]">
          <thead>
            <tr>
              <th className="text-left pb-2 pr-2 font-medium text-near-black" />
              {LIKERT_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="pb-2 px-1 text-center text-[11px] uppercase tracking-wide text-stone font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statements.map((st) => (
              <tr key={st.name} className="border-t border-near-black/10">
                <td className="py-3 pr-3 text-near-black align-middle w-[40%]">{st.label}</td>
                {LIKERT_COLUMNS.map((_, i) => {
                  const v = String(i + 1);
                  return (
                    <td key={v} className="text-center align-middle">
                      <input
                        type="radio"
                        name={st.name}
                        value={v}
                        checked={value[st.name] === v}
                        onChange={() => onChange(st.name, v)}
                        className="accent-deep-forest h-4 w-4"
                        aria-label={`${st.label}: ${LIKERT_COLUMNS[i]}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FieldWrap>
  );
}

export function Conditional({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <div className="mt-3 pl-4 border-l-2 border-forest-25">{children}</div>;
}

export function QuestionBlock({ children }: { children: React.ReactNode }) {
  return <div className="mb-8 pb-8 border-b border-near-black/10 last:border-b-0 last:mb-0 last:pb-0">{children}</div>;
}
