"use client";

import { useRef, useState } from "react";
import {
  IntakeData,
  getStr,
  getArr,
  TextField,
  SelectField,
  RadioGroup,
  CheckboxGroup,
  Conditional,
  QuestionBlock,
  labelClass,
  subLabelClass,
  helpClass,
  inputClass,
} from "./fields";

const COUNTRY_OPTIONS = [
  { value: "USA", label: "U.S.A." },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
  { value: "Other", label: "Other" },
];

const MARITAL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married or domestic partnership" },
  { value: "divorced", label: "Divorced or separated" },
  { value: "widowed", label: "Widowed" },
  { value: "no_say", label: "Prefer not to say" },
];

const HAS_CHILDREN_OPTIONS = [
  { value: "none", label: "None" },
  { value: "yes", label: "Yes — I'd like to share their details" },
  { value: "planning", label: "Planning to in the next few years" },
];

const HOBBIES_OPTIONS = [
  { value: "golf", label: "Golf" },
  { value: "travel", label: "Travel" },
  { value: "dining", label: "Dining out" },
  { value: "live_events_sports", label: "Live events — sports" },
  { value: "live_events_music", label: "Live events — music" },
  { value: "live_events_theater", label: "Live events — theater" },
  { value: "exercise", label: "Exercise" },
  { value: "outdoors", label: "Outdoors & fitness" },
  { value: "arts", label: "Arts & culture" },
  { value: "family", label: "Family time" },
  { value: "other", label: "Other" },
];

const LIFE_STAGE_OPTIONS = [
  { value: "building", label: "Building wealth — early/mid career, accumulating assets" },
  { value: "established", label: "Established — peak earning years, focused on growth and goals" },
  { value: "preretirement", label: "Pre-retirement — within 10 years of stepping back from work" },
  { value: "retired", label: "Already retired" },
];

function detectChildIds(data: IntakeData): number[] {
  const ids = new Set<number>();
  Object.keys(data).forEach((key) => {
    const match = key.match(/^child_(\d+)_name$/);
    if (match) ids.add(parseInt(match[1], 10));
  });
  return Array.from(ids).sort((a, b) => a - b);
}

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section1({ data, setField, errors }: SectionProps) {
  const [childIds, setChildIds] = useState<number[]>(() => detectChildIds(data));
  const nextChildId = useRef(Math.max(0, ...childIds) + 1);

  function addChild() {
    setChildIds((prev) => [...prev, nextChildId.current++]);
  }
  function removeChild(id: number) {
    setChildIds((prev) => prev.filter((i) => i !== id));
    setField(`child_${id}_name`, "");
    setField(`child_${id}_dob`, "");
    setField(`child_${id}_school`, "");
  }

  const maritalStatus = getStr(data, "marital_status");
  const hasChildren = getStr(data, "has_children");
  const hobbies = getArr(data, "hobbies");

  return (
    <div>
      <QuestionBlock>
        <label className={labelClass}>
          Your name<span className="text-forest ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TextField
            name="first_name"
            value={getStr(data, "first_name")}
            onChange={setField}
            placeholder="First"
            autoComplete="given-name"
            error={errors.first_name}
          />
          <TextField
            name="middle_name"
            value={getStr(data, "middle_name")}
            onChange={setField}
            placeholder="Middle"
            autoComplete="additional-name"
            error={errors.middle_name}
          />
          <TextField
            name="last_name"
            value={getStr(data, "last_name")}
            onChange={setField}
            placeholder="Last"
            autoComplete="family-name"
            error={errors.last_name}
          />
        </div>
        <p className={helpClass + " mt-2"}>
          Full legal middle name, please — we use it for account opening and custodial paperwork.
        </p>
      </QuestionBlock>

      <QuestionBlock>
        <TextField
          name="dob"
          label="Date of birth"
          type="date"
          value={getStr(data, "dob")}
          onChange={setField}
          autoComplete="bday"
        />
      </QuestionBlock>

      <QuestionBlock>
        <TextField
          name="email"
          label="Email"
          type="email"
          value={getStr(data, "email")}
          onChange={setField}
          autoComplete="email"
          error={errors.email}
        />
      </QuestionBlock>

      <QuestionBlock>
        <label className={labelClass}>Phone</label>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
          <SelectField
            name="phone_type"
            value={getStr(data, "phone_type") || "cell"}
            onChange={setField}
            options={[
              { value: "cell", label: "Cell" },
              { value: "home", label: "Home" },
              { value: "work", label: "Work" },
            ]}
          />
          <TextField
            name="phone"
            value={getStr(data, "phone")}
            onChange={setField}
            type="tel"
            placeholder="(000) 000-0000"
            autoComplete="tel"
          />
        </div>
      </QuestionBlock>

      <QuestionBlock>
        <label className={labelClass}>Home address</label>
        <div className="space-y-3">
          <input
            className={inputClass}
            name="address_street"
            placeholder="Street address"
            value={getStr(data, "address_street")}
            onChange={(e) => setField("address_street", e.target.value)}
            autoComplete="address-line1"
          />
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-3">
            <input
              className={inputClass}
              name="address_city"
              placeholder="City"
              value={getStr(data, "address_city")}
              onChange={(e) => setField("address_city", e.target.value)}
              autoComplete="address-level2"
            />
            <input
              className={inputClass}
              name="address_state"
              placeholder="State"
              value={getStr(data, "address_state")}
              onChange={(e) => setField("address_state", e.target.value)}
              autoComplete="address-level1"
            />
            <input
              className={inputClass}
              name="address_zip"
              placeholder="ZIP"
              value={getStr(data, "address_zip")}
              onChange={(e) => setField("address_zip", e.target.value)}
              autoComplete="postal-code"
            />
          </div>
          <div className="max-w-[20rem]">
            <label className={subLabelClass}>Country</label>
            <SelectField
              name="address_country"
              value={getStr(data, "address_country") || "USA"}
              onChange={setField}
              options={COUNTRY_OPTIONS}
            />
          </div>
        </div>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="marital_status"
          label="Marital / partnership status"
          value={maritalStatus}
          onChange={setField}
          options={MARITAL_OPTIONS}
        />
        <Conditional show={maritalStatus === "married"}>
          <label className={labelClass}>Your spouse or partner</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={subLabelClass}>First name</label>
              <TextField name="partner_first_name" value={getStr(data, "partner_first_name")} onChange={setField} />
            </div>
            <div>
              <label className={subLabelClass}>Middle name</label>
              <TextField name="partner_middle_name" value={getStr(data, "partner_middle_name")} onChange={setField} />
            </div>
            <div>
              <label className={subLabelClass}>Last name</label>
              <TextField name="partner_last_name" value={getStr(data, "partner_last_name")} onChange={setField} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className={subLabelClass}>Date of birth</label>
              <TextField name="partner_dob" type="date" value={getStr(data, "partner_dob")} onChange={setField} />
            </div>
            <div>
              <label className={subLabelClass}>Email</label>
              <TextField name="partner_email" type="email" value={getStr(data, "partner_email")} onChange={setField} />
            </div>
          </div>
          <div className="mt-3 max-w-[20rem]">
            <label className={subLabelClass}>Phone</label>
            <TextField name="partner_phone" type="tel" value={getStr(data, "partner_phone")} onChange={setField} />
          </div>
          <div className="mt-5">
            <RadioGroup
              name="partner_coclient"
              label="Will your spouse or partner be a co-client?"
              value={getStr(data, "partner_coclient")}
              onChange={setField}
              options={[
                { value: "yes", label: "Yes — we'd like to be joint clients" },
                { value: "no", label: "No — I'll be the sole client" },
              ]}
            />
          </div>
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="has_children"
          label="Children or other dependents"
          value={hasChildren}
          onChange={setField}
          options={HAS_CHILDREN_OPTIONS}
        />
        <Conditional show={hasChildren === "yes"}>
          <div className="space-y-3">
            {childIds.map((id) => (
              <div key={id} className="rounded-sm border border-dashed border-near-black/20 p-4 bg-warm-gray/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={subLabelClass}>Name</label>
                    <TextField
                      name={`child_${id}_name`}
                      placeholder="Child's name"
                      value={getStr(data, `child_${id}_name`)}
                      onChange={setField}
                    />
                  </div>
                  <div>
                    <label className={subLabelClass}>Date of Birth</label>
                    <TextField
                      name={`child_${id}_dob`}
                      type="date"
                      value={getStr(data, `child_${id}_dob`)}
                      onChange={setField}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={subLabelClass}>Current school (or N/A)</label>
                  <TextField
                    name={`child_${id}_school`}
                    value={getStr(data, `child_${id}_school`)}
                    onChange={setField}
                  />
                </div>
                <div className="text-right mt-3">
                  <button
                    type="button"
                    onClick={() => removeChild(id)}
                    className="text-xs text-red-700 hover:underline min-h-11 px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addChild}
              className="min-h-11 rounded-sm border border-near-black/20 px-4 text-sm text-near-black hover:bg-warm-gray transition-colors"
            >
              + Add child
            </button>
          </div>
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="hobbies"
          label="Hobbies & passions"
          help="Select all that apply."
          value={hobbies}
          onChange={setField}
          options={HOBBIES_OPTIONS}
        />
        <Conditional show={hobbies.includes("other")}>
          <TextField
            name="hobbies_other"
            label="Please specify"
            value={getStr(data, "hobbies_other")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="life_stage"
          label="Which best describes your current life stage?"
          value={getStr(data, "life_stage")}
          onChange={setField}
          options={LIFE_STAGE_OPTIONS}
        />
      </QuestionBlock>
    </div>
  );
}
