// Multi-Face SVG line-art vector mockups for print metric measurements

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  type: string;
  description: string;
  faces: { id: string; name: string }[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "t-shirt",
    name: "T-Shirts",
    icon: "👕",
    type: "t-shirt",
    description: "Front, Back & Sleeve Print Areas",
    faces: [
      { id: "front", name: "Front Chest" },
      { id: "back", name: "Back Surface" },
      { id: "left-arm", name: "Left Sleeve" },
      { id: "right-arm", name: "Right Sleeve" },
    ],
  },
  {
    id: "hoodie",
    name: "Hoodies & Sweaters",
    icon: "🧥",
    type: "hoodie",
    description: "Front, Back & Arm Print Areas",
    faces: [
      { id: "front", name: "Front Pocket & Chest" },
      { id: "back", name: "Back Surface" },
      { id: "left-arm", name: "Left Arm" },
      { id: "right-arm", name: "Right Arm" },
    ],
  },
  {
    id: "mug",
    name: "Mugs & Drinkware",
    icon: "☕",
    type: "mug",
    description: "Cylindrical Full-Wrap Surface",
    faces: [
      { id: "wrap", name: "Cylindrical Full Wrap" },
      { id: "front", name: "Front Side" },
      { id: "back", name: "Back Side" },
    ],
  },
  {
    id: "jotter",
    name: "Jotters & Diaries",
    icon: "📓",
    type: "jotter",
    description: "Front Cover, Back Cover & Spine",
    faces: [
      { id: "front", name: "Front Cover" },
      { id: "back", name: "Back Cover" },
      { id: "spine", name: "Book Spine" },
    ],
  },
  {
    id: "tote",
    name: "Tote Bags",
    icon: "🛍️",
    type: "tote",
    description: "Front & Back Canvas Faces",
    faces: [
      { id: "front", name: "Front Canvas" },
      { id: "back", name: "Back Canvas" },
    ],
  },
  {
    id: "cap",
    name: "Caps & Hats",
    icon: "🧢",
    type: "cap",
    description: "Front Crown & Side Seams",
    faces: [
      { id: "front", name: "Front Crown" },
      { id: "side", name: "Side Panel" },
    ],
  },
];

export function getProductDoodleSVG(
  productType: string = "t-shirt",
  faceId: string = "front",
  strokeColor: string = "#401268",
  accentColor: string = "#6366f1"
): string {
  const type = productType.toLowerCase();

  // MUGS - Cylindrical Flattened Full-Wrap & Sides
  if (type.includes("mug") || type.includes("cup") || type.includes("drink")) {
    if (faceId === "wrap") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <!-- Flattened Cylindrical Mug Surface Wrap Outline -->
        <rect x="60" y="140" width="380" height="220" rx="12" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Handle Position Boundaries (Left & Right Margins) -->
        <line x1="110" y1="140" x2="110" y2="360" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
        <text x="85" y="255" font-family="sans-serif" font-size="10" font-weight="bold" fill="${strokeColor}" opacity="0.7" transform="rotate(-90 85 255)">HANDLE LEFT GAP</text>

        <line x1="390" y1="140" x2="390" y2="360" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
        <text x="415" y="255" font-family="sans-serif" font-size="10" font-weight="bold" fill="${strokeColor}" opacity="0.7" transform="rotate(90 415 255)">HANDLE RIGHT GAP</text>

        <!-- Center Alignment Guide -->
        <line x1="250" y1="140" x2="250" y2="360" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.5"/>

        <!-- Surface Print Boundary Box (Full Wrap 20cm x 8.5cm metric) -->
        <rect x="115" y="155" width="270" height="190" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
        <text x="250" y="132" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">CYLINDRICAL FLATTENED PRINT AREA (20cm x 8.5cm)</text>
      </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <rect x="140" y="110" width="200" height="260" rx="20" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="240" cy="110" rx="100" ry="12" fill="none" stroke="${strokeColor}" stroke-width="3"/>
      <ellipse cx="240" cy="370" rx="100" ry="12" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-dasharray="4 4"/>
      <path d="M 340 160 C 410 160, 410 310, 340 310 C 370 290, 370 180, 340 160 Z" fill="none" stroke="${strokeColor}" stroke-width="4"/>
      <rect x="160" y="150" width="160" height="180" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <text x="240" y="142" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">PRINT AREA SIDE</text>
    </svg>`;
  }

  // JOTTERS & DIARIES - Flattened Book Covers & Spine
  if (type.includes("jotter") || type.includes("diary") || type.includes("notebook")) {
    if (faceId === "spine") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <!-- Spine Vertical Rectangle -->
        <rect x="200" y="80" width="100" height="340" rx="8" fill="none" stroke="${strokeColor}" stroke-width="3.5"/>
        <line x1="250" y1="80" x2="250" y2="420" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
        <rect x="215" y="100" width="70" height="300" rx="4" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="5 5"/>
        <text x="250" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">SPINE PRINT METRICS AREA</text>
      </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <!-- Cover Rectangle -->
      <rect x="120" y="70" width="260" height="360" rx="14" fill="none" stroke="${strokeColor}" stroke-width="4"/>
      <!-- Binding Stitch Line -->
      <line x1="140" y1="70" x2="140" y2="430" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="3 3"/>
      <!-- Surface Area Print Boundary Box -->
      <rect x="155" y="95" width="210" height="310" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <text x="250" y="87" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">JOTTER COVER PRINT AREA</text>
    </svg>`;
  }

  // HOODIES - Front, Back, Arms
  if (type.includes("hoodie") || type.includes("sweater") || type.includes("jacket")) {
    if (faceId === "back") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <!-- Hoodie Back View Outline -->
        <path d="M 170 110 C 210 90, 290 90, 330 110 L 440 170 L 400 240 L 370 210 L 370 420 L 130 420 L 130 210 L 100 240 L 60 170 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Hood Outline Back -->
        <path d="M 190 100 C 200 40, 300 40, 310 100" fill="none" stroke="${strokeColor}" stroke-width="3"/>
        <line x1="130" y1="400" x2="370" y2="400" stroke="${strokeColor}" stroke-width="3"/>
        <rect x="175" y="140" width="150" height="210" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
        <text x="250" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">BACK PRINT AREA (30cm x 40cm)</text>
      </svg>`;
    }
    if (faceId === "left-arm" || faceId === "right-arm") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <!-- Sleeve Arm Outline -->
        <path d="M 180 80 L 320 110 L 280 430 L 160 410 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Cuff Ribbing -->
        <line x1="160" y1="410" x2="280" y2="430" stroke="${strokeColor}" stroke-width="3"/>
        <line x1="163" y1="390" x2="277" y2="410" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Sleeve Print Box -->
        <rect x="190" y="130" width="100" height="230" rx="6" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
        <text x="240" y="120" font-family="sans-serif" font-size="10" font-weight="bold" fill="${accentColor}" text-anchor="middle">SLEEVE PRINT AREA</text>
      </svg>`;
    }
    // Default Hoodie Front
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <path d="M 170 110 C 190 70, 310 70, 330 110 L 440 170 L 400 240 L 370 210 L 370 420 L 130 420 L 130 210 L 100 240 L 60 170 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 210 120 C 230 145, 270 145, 290 120" fill="none" stroke="${strokeColor}" stroke-width="3"/>
      <path d="M 225 140 L 225 210" stroke="${strokeColor}" stroke-width="2.5"/>
      <path d="M 275 140 L 275 210" stroke="${strokeColor}" stroke-width="2.5"/>
      <path d="M 180 340 L 320 340 L 340 400 L 160 400 Z" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4"/>
      <line x1="130" y1="400" x2="370" y2="400" stroke="${strokeColor}" stroke-width="3"/>
      <rect x="175" y="165" width="150" height="155" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <text x="250" y="157" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">FRONT CHEST PRINT AREA</text>
    </svg>`;
  }

  // T-SHIRTS - Front, Back, Left Sleeve, Right Sleeve
  if (faceId === "back") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <!-- T-Shirt Back View Outline -->
      <path d="M 160 110 C 200 95, 300 95, 340 110 L 440 165 L 390 240 L 360 210 L 360 430 L 140 430 L 140 210 L 110 240 L 60 165 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 195 110 C 220 120, 280 120, 305 110" fill="none" stroke="${strokeColor}" stroke-width="3"/>
      <line x1="140" y1="210" x2="160" y2="110" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4"/>
      <line x1="360" y1="210" x2="340" y2="110" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4"/>
      <rect x="170" y="140" width="160" height="220" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <text x="250" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">BACK PRINT AREA (30cm x 40cm)</text>
    </svg>`;
  }

  if (faceId === "left-arm" || faceId === "right-arm") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <!-- T-Shirt Sleeve Arm Outline -->
      <path d="M 170 120 L 330 150 L 290 380 L 150 350 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="150" y1="350" x2="290" y2="380" stroke="${strokeColor}" stroke-width="3"/>
      <rect x="180" y="170" width="110" height="150" rx="6" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <text x="235" y="160" font-family="sans-serif" font-size="10" font-weight="bold" fill="${accentColor}" text-anchor="middle">SLEEVE PRINT AREA (10cm x 15cm)</text>
    </svg>`;
  }

  // Default: T-Shirt Front View Outline
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <path d="M 160 110 C 190 135, 310 135, 340 110 L 440 165 L 390 240 L 360 210 L 360 430 L 140 430 L 140 210 L 110 240 L 60 165 Z" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 195 110 C 220 140, 280 140, 305 110" fill="none" stroke="${strokeColor}" stroke-width="3"/>
    <line x1="140" y1="210" x2="160" y2="110" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="360" y1="210" x2="340" y2="110" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4 4"/>
    <rect x="175" y="160" width="150" height="190" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6 6"/>
    <text x="250" y="152" font-family="sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">FRONT CHEST PRINT AREA (28cm x 35cm)</text>
  </svg>`;
}
