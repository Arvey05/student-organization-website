/**
 * BulSU Colleges, Programs, and Majors
 *
 * Source: Bulacan State University official curriculum offerings.
 * TODO: Verify the complete and up-to-date list of programs and majors
 *       with the BulSU registrar or official BulSU website.
 *       Add or remove entries as needed.
 */

export type Major = {
  label: string;
  value: string;
};

export type Program = {
  label: string;
  value: string;
  majors: Major[];
};

export type College = {
  label: string;
  value: string;
  programs: Program[];
};

export const COLLEGES: College[] = [
  {
    label: "College of Information and Communications Technology",
    value: "CICT",
    programs: [
      {
        label: "Bachelor of Science in Information Technology",
        value: "BSIT",
        majors: [
          { label: "Network Technology", value: "Network Technology" },
          { label: "Web and Mobile Technology", value: "Web and Mobile Technology" },
          // TODO: Verify complete BSIT majors with BulSU CICT
        ],
      },
      {
        label: "Bachelor of Science in Computer Science",
        value: "BSCS",
        majors: [],
      },
      {
        label: "Bachelor of Science in Information Systems",
        value: "BSIS",
        majors: [],
      },
    ],
  },
  {
    label: "College of Engineering",
    value: "CE",
    programs: [
      {
        label: "Bachelor of Science in Civil Engineering",
        value: "BSCE",
        majors: [],
      },
      {
        label: "Bachelor of Science in Electrical Engineering",
        value: "BSEE",
        majors: [],
      },
      {
        label: "Bachelor of Science in Electronics Engineering",
        value: "BSEcE",
        majors: [],
      },
      {
        label: "Bachelor of Science in Mechanical Engineering",
        value: "BSME",
        majors: [],
      },
      // TODO: Verify complete CE program list with BulSU registrar
    ],
  },
  {
    label: "College of Business Administration",
    value: "CBA",
    programs: [
      {
        label: "Bachelor of Science in Business Administration",
        value: "BSBA",
        majors: [
          { label: "Human Resource Management", value: "Human Resource Management" },
          { label: "Marketing Management", value: "Marketing Management" },
          { label: "Financial Management", value: "Financial Management" },
          { label: "Operations Management", value: "Operations Management" },
          // TODO: Verify BSBA majors with BulSU CBA
        ],
      },
      {
        label: "Bachelor of Science in Accountancy",
        value: "BSA",
        majors: [],
      },
      {
        label: "Bachelor of Science in Management Accounting",
        value: "BSMA",
        majors: [],
      },
      // TODO: Add other CBA programs if offered
    ],
  },
  {
    label: "College of Arts and Sciences",
    value: "CAS",
    programs: [
      {
        label: "Bachelor of Arts in Communication",
        value: "BA Communication",
        majors: [],
      },
      {
        label: "Bachelor of Science in Psychology",
        value: "BS Psychology",
        majors: [],
      },
      {
        label: "Bachelor of Science in Mathematics",
        value: "BS Mathematics",
        majors: [],
      },
      // TODO: Verify complete CAS program list with BulSU registrar
    ],
  },
  {
    label: "College of Education",
    value: "CEduc",
    programs: [
      {
        label: "Bachelor of Elementary Education",
        value: "BEEd",
        majors: [],
      },
      {
        label: "Bachelor of Secondary Education",
        value: "BSEd",
        majors: [
          { label: "English", value: "English" },
          { label: "Mathematics", value: "Mathematics" },
          { label: "Science", value: "Science" },
          { label: "Filipino", value: "Filipino" },
          // TODO: Verify BSEd majors with BulSU CEduc
        ],
      },
      // TODO: Add other CEduc programs if offered
    ],
  },
  {
    label: "College of Architecture and Fine Arts",
    value: "CAFA",
    programs: [
      {
        label: "Bachelor of Science in Architecture",
        value: "BS Architecture",
        majors: [],
      },
      {
        label: "Bachelor of Fine Arts",
        value: "BFA",
        majors: [],
      },
      // TODO: Verify complete CAFA program list
    ],
  },
  {
    label: "College of Law",
    value: "CL",
    programs: [
      {
        label: "Juris Doctor",
        value: "JD",
        majors: [],
      },
    ],
  },
  // TODO: Add remaining BulSU colleges (e.g., College of Nursing, College of Agriculture, etc.)
];

// Flat sets for server-side validation
export const VALID_COLLEGE_VALUES = new Set(COLLEGES.map((c) => c.value));

export const VALID_PROGRAM_VALUES = new Set(
  COLLEGES.flatMap((c) => c.programs.map((p) => p.value)),
);

export const VALID_MAJOR_VALUES = new Set(
  COLLEGES.flatMap((c) =>
    c.programs.flatMap((p) => p.majors.map((m) => m.value)),
  ),
);

/** Returns programs for a given college value, or [] if not found. */
export function getProgramsForCollege(collegeValue: string): Program[] {
  return COLLEGES.find((c) => c.value === collegeValue)?.programs ?? [];
}

/** Returns majors for a given program value, or [] if not found. */
export function getMajorsForProgram(programValue: string): Major[] {
  for (const college of COLLEGES) {
    const program = college.programs.find((p) => p.value === programValue);
    if (program) return program.majors;
  }
  return [];
}

/**
 * Validates that the program belongs to the given college, and that
 * the major (if provided) belongs to the given program.
 * Returns an error string, or null if valid.
 */
export function validateCollegeProgramMajor(
  college: string | null,
  program: string | null,
  major: string | null,
): string | null {
  if (!college && !program && !major) return null;

  if (college && !VALID_COLLEGE_VALUES.has(college)) {
    return "Invalid college selected.";
  }

  if (program) {
    if (!VALID_PROGRAM_VALUES.has(program)) {
      return "Invalid program selected.";
    }
    // Ensure program belongs to college
    if (college) {
      const programs = getProgramsForCollege(college);
      if (!programs.some((p) => p.value === program)) {
        return "The selected program does not belong to the selected college.";
      }
    }
  }

  if (major) {
    if (!VALID_MAJOR_VALUES.has(major)) {
      return "Invalid major selected.";
    }
    // Ensure major belongs to program
    if (program) {
      const majors = getMajorsForProgram(program);
      if (!majors.some((m) => m.value === major)) {
        return "The selected major does not belong to the selected program.";
      }
    }
  }

  return null;
}

export const YEAR_LEVELS = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "5th Year", value: "5th Year" },
];

export const VALID_YEAR_LEVEL_VALUES = new Set(YEAR_LEVELS.map((y) => y.value));

export const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

export const VALID_GENDER_VALUES = new Set(GENDER_OPTIONS.map((g) => g.value));
