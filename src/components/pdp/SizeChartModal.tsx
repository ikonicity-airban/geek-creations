"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: string;
}

// Size chart data for different product types
const SIZE_CHARTS: Record<string, { sizes: string[]; measurements: Record<string, { [key: string]: string }> }> = {
  "T-Shirts": {
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    measurements: {
      "Chest (inches)": {
        XS: "32-34",
        S: "36-38",
        M: "40-42",
        L: "44-46",
        XL: "48-50",
        "2XL": "52-54",
        "3XL": "56-58",
      },
      "Length (inches)": {
        XS: "26",
        S: "28",
        M: "29",
        L: "30",
        XL: "31",
        "2XL": "32",
        "3XL": "33",
      },
      "Sleeve (inches)": {
        XS: "7.5",
        S: "8",
        M: "8.5",
        L: "9",
        XL: "9.5",
        "2XL": "10",
        "3XL": "10.5",
      },
    },
  },
  Hoodies: {
    sizes: ["S", "M", "L", "XL", "2XL"],
    measurements: {
      "Chest (inches)": {
        S: "40-42",
        M: "44-46",
        L: "48-50",
        XL: "52-54",
        "2XL": "56-58",
      },
      "Length (inches)": {
        S: "28",
        M: "29",
        L: "30",
        XL: "31",
        "2XL": "32",
      },
      "Sleeve (inches)": {
        S: "33",
        M: "34",
        L: "35",
        XL: "36",
        "2XL": "37",
      },
    },
  },
  Default: {
    sizes: ["One Size"],
    measurements: {
      "Dimensions": {
        "One Size": "Fits All",
      },
    },
  },
};

export default function SizeChartModal({
  isOpen,
  onClose,
  productType = "Default",
}: SizeChartModalProps) {
  const chartData =
    SIZE_CHARTS[productType] ||
    SIZE_CHARTS[productType.split(" ")[0]] ||
    SIZE_CHARTS.Default;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition"
                style={{ color: COLORS.primary }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                <h2
                  className="text-3xl font-black mb-6"
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  Size Chart
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          className="px-4 py-3 text-left font-bold border-b-2"
                          style={{
                            borderColor: COLORS.primary,
                            color: COLORS.primary,
                          }}
                        >
                          Size
                        </th>
                        {chartData.sizes.map((size) => (
                          <th
                            key={size}
                            className="px-4 py-3 text-center font-bold border-b-2"
                            style={{
                              borderColor: COLORS.primary,
                              color: COLORS.primary,
                            }}
                          >
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(chartData.measurements).map(
                        ([measurement, values], idx) => (
                          <tr
                            key={measurement}
                            className={idx % 2 === 0 ? "bg-white" : `${COLORS.secondary}10`}
                          >
                            <td
                              className="px-4 py-3 font-semibold"
                              style={{ color: COLORS.primary }}
                            >
                              {measurement}
                            </td>
                            {chartData.sizes.map((size) => (
                              <td
                                key={size}
                                className="px-4 py-3 text-center"
                                style={{ color: COLORS.primary }}
                              >
                                {values[size] || "-"}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${COLORS.secondary}20` }}>
                  <p className="text-sm" style={{ color: COLORS.primary }}>
                    <strong>Note:</strong> All measurements are in inches. Please refer to
                    this chart to find your perfect fit. If you're between sizes, we
                    recommend sizing up.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

