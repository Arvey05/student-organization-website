// Executive Board V, A.Y. 2026–2027. Photos live in public/team as square WebP
// files named by `photo`; people without one render an initials avatar.

export type BoardMember = {
  name: string;
  role: string;
  photo?: string;
};

export type Committee = {
  name: string;
  description: string;
  directors: BoardMember[];
  members: BoardMember[];
};

export const BOARD_TERM = "Executive Board V · A.Y. 2026–2027";

export const guidance: { faculty: BoardMember[]; mentors: BoardMember[] } = {
  faculty: [
    { name: "Bernard M. Tiongson", role: "Faculty Adviser", photo: "bernard-tiongson" },
    { name: "Noel Pangan Lomerio", role: "Faculty Adviser" },
    { name: "Orlando R. Bernaldez", role: "Faculty Adviser", photo: "orlando-bernaldez" },
  ],
  mentors: [
    { name: "Dave Anthony R. De Jesus", role: "Lead Peer Mentor", photo: "dave-de-jesus" },
    { name: "Glen Justine P. Batis", role: "Lead Peer Mentor", photo: "glen-batis" },
  ],
};

export const coreExecutives: BoardMember[] = [
  { name: "Raphael M. De Castro", role: "President", photo: "raphael-de-castro" },
  { name: "Sophia Margaret E. Ramos", role: "Vice President for External Affairs", photo: "sophia-ramos" },
  { name: "Arvey Jed A. Enriquez", role: "Vice President for Internal Affairs", photo: "arvey-enriquez" },
  { name: "Aidrhick James M. Curacha", role: "Executive Secretary", photo: "aidrhick-curacha" },
];

export const committees: Committee[] = [
  {
    name: "External Committee",
    description:
      "Builds and maintains relationships with external organizations, industry sponsors, and partner student communities.",
    directors: [],
    members: [
      { name: "Marco Andrei E. Tanig", role: "External Associate", photo: "marco-tanig" },
      { name: "Miles Nogueras", role: "External Associate", photo: "miles-nogueras" },
      { name: "Jessie Claire C. Santos", role: "External Associate", photo: "jessie-claire-santos" },
    ],
  },
  {
    name: "Finance Committee",
    description:
      "Oversees the financial health, budgeting, transparent procurement, and auditing of the organization.",
    directors: [
      { name: "Marvin Bollosa", role: "Director for Finance", photo: "marvin-bollosa" },
      { name: "Rochel D. Encarnacion", role: "Director for Audit", photo: "rochel-encarnacion" },
    ],
    members: [
      { name: "Coleen DC. Deliguer", role: "Resource Manager", photo: "coleen-deliguer" },
      { name: "Alveen John S. Villarin", role: "Procurement Officer", photo: "alveen-villarin" },
      { name: "Kyle Acuña", role: "Procurement Officer", photo: "kyle-acuna" },
    ],
  },
  {
    name: "Student Development Committee",
    description:
      "Builds the technical skills and engagement of BulSU MSC members and guides aspiring Microsoft Learn Student Ambassadors.",
    directors: [
      { name: "Hezekiah Christal Dionisio", role: "Director for Student Development", photo: "hezekiah-dionisio" },
      { name: "Ivan Joseph I. Ilagan", role: "Director for Events", photo: "ivan-ilagan" },
    ],
    members: [
      { name: "Zairich Paulwyn So", role: "Membership Coordinator", photo: "zairich-so" },
      { name: "Lenon Adriano", role: "Membership Coordinator", photo: "lenon-adriano" },
      { name: "Jielken M. Larong", role: "Research Lead", photo: "jielken-larong" },
      { name: "Rafael Philip S. Atibagos", role: "Logistics Officer", photo: "rafael-atibagos" },
      { name: "Marcus Andrei V. Guinto", role: "Logistics Officer", photo: "marcus-guinto" },
      { name: "Angelicka Tolentino", role: "Logistics Officer", photo: "angelicka-tolentino" },
      { name: "Jhazper Lumagbas", role: "Logistics Officer", photo: "jhazper-lumagbas" },
    ],
  },
  {
    name: "Media Creatives Committee",
    description:
      "Leads visual identity, event documentation, technical support, and digital communications.",
    directors: [
      { name: "John Angelo A. Cortez", role: "Director for Creatives", photo: "john-angelo-cortez" },
      { name: "Lorenz Amarille", role: "Director for Media", photo: "lorenz-amarille" },
    ],
    members: [
      { name: "Jenica S. Crisostomo", role: "Creative Designer", photo: "jenica-crisostomo" },
      { name: "John Marco Aguirre", role: "Creative Designer", photo: "john-marco-aguirre" },
      { name: "Vericx Craine R. Monsayac", role: "Content Lead", photo: "vericx-monsayac" },
      { name: "Hilmar Dela Cruz", role: "Content Lead", photo: "hilmar-dela-cruz" },
      { name: "Jessie B. Torres Jr.", role: "Digital Manager", photo: "jessie-torres" },
      { name: "Stephen Victoria", role: "Digital Manager", photo: "stephen-victoria" },
      { name: "Darl Shanen G. Floresca", role: "Technical Support", photo: "darl-floresca" },
      { name: "Don Samuel D. Anico", role: "Technical Support", photo: "don-anico" },
      { name: "Guile Robin G. Dela Cruz", role: "Documentation Officer", photo: "guile-dela-cruz" },
      { name: "Eisen Raigne Jimenez", role: "Documentation Officer", photo: "eisen-jimenez" },
    ],
  },
];
