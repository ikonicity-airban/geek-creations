"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Type,
  Circle,
  Square,
  Trash2,
  Download,
  RotateCw,
  Palette,
  Upload,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

const FONTS = [
  "Arial",
  "Impact",
  "Georgia",
  "Courier New",
  "Comic Sans MS",
  "Verdana",
  "Times New Roman",
  "Orbitron",
  "Roboto",
  "Open Sans",
];

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#401268",
  "#c5a3ff",
  "#e2ae3d",
  "#e21b35",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
];

function ProductCustomizerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get product handle from URL if coming from PDP
  const productHandle = searchParams.get("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeObject, setActiveObject] = useState<any>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?limit=20");
        const json = await res.json();
        const fetchedProducts = json.products || [];
        setProducts(fetchedProducts);

        // If product handle provided, select that product
        if (productHandle && fetchedProducts.length > 0) {
          const product = fetchedProducts.find(
            (p: Product) => p.handle === productHandle
          );
          if (product) {
            setSelectedProduct(product);
            setSelectedVariant(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              product.variants.find((v: any) => v.available) ||
                product.variants[0]
            );
          } else {
            // Default to first product
            setSelectedProduct(fetchedProducts[0]);
            setSelectedVariant(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fetchedProducts[0].variants.find((v: any) => v.available) ||
                fetchedProducts[0].variants[0]
            );
          }
        } else if (fetchedProducts.length > 0) {
          // Default to first product
          setSelectedProduct(fetchedProducts[0]);
          setSelectedVariant(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchedProducts[0].variants.find((v: any) => v.available) ||
              fetchedProducts[0].variants[0]
          );
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [productHandle]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (isLoading) return;

    // Load Fabric.js from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (canvasRef.current && (window as any).fabric) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fabric = (window as any).fabric;
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 400,
          height: 500,
          backgroundColor: "#ffffff",
        });

        fabricCanvasRef.current = canvas;

        // Listen for object selection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("selection:created", (e: any) =>
          setActiveObject(e.selected[0])
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("selection:updated", (e: any) =>
          setActiveObject(e.selected[0])
        );
        canvas.on("selection:cleared", () => setActiveObject(null));
      }
    };
    document.body.appendChild(script);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isLoading]);

  const addText = () => {
    if (!fabricCanvasRef.current || !textInput.trim()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text: any = new fabric.IText(textInput, {
      left: 100,
      top: 100,
      fontFamily: selectedFont,
      fill: selectedColor,
      fontSize: 40,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    setTextInput("");
  };

  const addShape = (type: string) => {
    if (!fabricCanvasRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shape: any;
    if (type === "circle") {
      shape = new fabric.Circle({
        radius: 50,
        fill: selectedColor,
        left: 150,
        top: 150,
      });
    } else if (type === "rectangle") {
      shape = new fabric.Rect({
        width: 100,
        height: 80,
        fill: selectedColor,
        left: 150,
        top: 150,
      });
    }

    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      fabricCanvasRef.current.renderAll();
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fabric = (window as any).fabric;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fabric.Image.fromURL(event.target?.result as string, (img: any) => {
        img.scaleToWidth(200);
        img.set({
          left: 100,
          top: 100,
        });
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current || !activeObject) return;

    fabricCanvasRef.current.remove(activeObject);
    fabricCanvasRef.current.renderAll();
    setActiveObject(null);
  };

  const changeColor = (color: string) => {
    setSelectedColor(color);
    if (!fabricCanvasRef.current || !activeObject) return;

    activeObject.set("fill", color);
    fabricCanvasRef.current.renderAll();
  };

  const changeFont = (font: string) => {
    setSelectedFont(font);
    if (
      !fabricCanvasRef.current ||
      !activeObject ||
      activeObject.type !== "i-text"
    )
      return;

    activeObject.set("fontFamily", font);
    fabricCanvasRef.current.renderAll();
  };

  const rotateObject = () => {
    if (!fabricCanvasRef.current || !activeObject) return;

    activeObject.rotate(activeObject.angle + 15);
    fabricCanvasRef.current.renderAll();
  };

  const downloadDesign = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = `custom-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleAddToCart = async () => {
    if (!fabricCanvasRef.current || !selectedProduct || !selectedVariant) {
      alert("Please select a product and variant first.");
      return;
    }

    setIsSaving(true);
    try {
      // Get preview image
      const preview = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 0.9,
      });

      // Upload design to server
      const formData = new FormData();
      const blob = await fetch(preview).then((r) => r.blob());
      formData.append("file", blob, `design-${Date.now()}.png`);
      formData.append("productId", selectedProduct.id);
      formData.append("productType", selectedProduct.product_type);

      const uploadRes = await fetch("/api/designs/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload design");
      }

      const uploadData = await uploadRes.json();

      // Generate mockup
      let mockupUrl = null;
      try {
        const mockupRes = await fetch("/api/mockups/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: selectedProduct.id,
            productType: selectedProduct.product_type,
            variantId: selectedVariant.id,
            designImageUrl: uploadData.url,
          }),
        });

        if (mockupRes.ok) {
          const mockupData = await mockupRes.json();
          mockupUrl = mockupData.mockupUrl;
        }
      } catch (err) {
        console.error("Mockup generation failed:", err);
      }

      // Add to cart with design info
      const variantImage = selectedVariant.image_id
        ? selectedProduct.images.find(
            (img) => img.id === selectedVariant.image_id
          )
        : selectedProduct.images[0];

      addToCart(
        {
          variant_id: selectedVariant.id,
          product_id: selectedProduct.id,
          product_title: selectedProduct.title,
          variant_title: selectedVariant.title,
          price: selectedVariant.price,
          image: variantImage?.src || selectedProduct.images[0]?.src || "",
          sku: selectedVariant.sku,
          max_quantity: selectedVariant.inventory_quantity,
          uploaded_design_url: uploadData.url,
          mockup_url: mockupUrl,
        },
        1
      );

      // Navigate to cart or show success
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add design to cart. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: COLORS.primary }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 text-sm font-semibold hover:opacity-80 transition"
            style={{ color: COLORS.primary }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
          <h1
            className="text-4xl md:text-5xl font-black mb-2"
            style={{
              color: COLORS.primary,
              fontFamily: "Orbitron, sans-serif",
            }}
          >
            Product Customizer
          </h1>
          <p className="text-lg" style={{ color: "rgba(64, 18, 104, 0.75)" }}>
            Design your perfect product with our easy-to-use editor
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{ border: `1px solid ${COLORS.primary}20` }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: COLORS.primary }}
              >
                Add Elements
              </h3>

              {/* Add Text */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.primary }}
                >
                  Add Text
                </label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addText()}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-2 rounded-lg border-2 mb-2 text-sm"
                  style={{
                    borderColor: `${COLORS.primary}20`,
                  }}
                />
                <button
                  onClick={addText}
                  className="w-full py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Type className="w-4 h-4" />
                  Add Text
                </button>
              </div>

              {/* Upload Image */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.primary }}
                >
                  Upload Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
                  style={{
                    backgroundColor: `${COLORS.secondary}40`,
                    color: COLORS.primary,
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              </div>

              {/* Add Shapes */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.primary }}
                >
                  Add Shapes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addShape("circle")}
                    className="py-2.5 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition hover:opacity-80"
                    style={{
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                    }}
                  >
                    <Circle className="w-4 h-4" />
                    Circle
                  </button>
                  <button
                    onClick={() => addShape("rectangle")}
                    className="py-2.5 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition hover:opacity-80"
                    style={{
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                    }}
                  >
                    <Square className="w-4 h-4" />
                    Square
                  </button>
                </div>
              </div>

              {/* Color Picker */}
              <div className="mb-6">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: COLORS.primary }}
                >
                  <Palette className="w-4 h-4" />
                  Colors
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => changeColor(color)}
                      className="aspect-square rounded-lg border-2 transition hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          selectedColor === color ? COLORS.primary : "#ddd",
                        borderWidth: selectedColor === color ? "3px" : "2px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Selector */}
              {activeObject?.type === "i-text" && (
                <div className="mb-6">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    Font Family
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => changeFont(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 text-sm cursor-pointer"
                    style={{
                      borderColor: `${COLORS.primary}20`,
                    }}
                  >
                    {FONTS.map((font) => (
                      <option
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-6">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
              style={{ border: `1px solid ${COLORS.primary}20` }}
            >
              <canvas ref={canvasRef} className="rounded-lg" />

              {/* Canvas Controls */}
              {activeObject && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={rotateObject}
                    className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 transition hover:opacity-90"
                    style={{ backgroundColor: COLORS.accentWarm }}
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 transition hover:opacity-90"
                    style={{ backgroundColor: COLORS.accentBold }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Product Selection & Actions */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{ border: `1px solid ${COLORS.primary}20` }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: COLORS.primary }}
              >
                Select Product
              </h3>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedVariant(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        product.variants.find((v: any) => v.available) ||
                          product.variants[0]
                      );
                    }}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition ${
                      selectedProduct?.id === product.id
                        ? "shadow-md"
                        : "hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor:
                        selectedProduct?.id === product.id
                          ? `${COLORS.secondary}20`
                          : "white",
                      borderColor:
                        selectedProduct?.id === product.id
                          ? COLORS.primary
                          : "#ddd",
                    }}
                  >
                    {product.images[0] && (
                      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={product.images[0].src}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <div
                        className="font-bold text-sm truncate"
                        style={{ color: COLORS.primary }}
                      >
                        {product.title}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "rgba(64, 18, 104, 0.6)" }}
                      >
                        {product.product_type}
                      </div>
                    </div>
                  </button>
                ))}
                {products.length === 0 && (
                  <p
                    className="text-sm text-center py-4"
                    style={{ color: "rgba(64, 18, 104, 0.6)" }}
                  >
                    No products available
                  </p>
                )}
              </div>

              {selectedProduct && selectedVariant && (
                <>
                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{
                      backgroundColor: `${COLORS.secondary}20`,
                    }}
                  >
                    <div
                      className="font-semibold mb-1 text-sm"
                      style={{ color: COLORS.primary }}
                    >
                      Selected: {selectedProduct.title}
                    </div>
                    <div
                      className="text-2xl font-black"
                      style={{ color: COLORS.primary }}
                    >
                      ₦{selectedVariant.price.toLocaleString()}
                    </div>
                    {selectedVariant.compare_at_price && (
                      <div className="text-sm line-through opacity-60">
                        ₦{selectedVariant.compare_at_price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={downloadDesign}
                      className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
                      style={{ backgroundColor: COLORS.accentWarm }}
                    >
                      <Download className="w-5 h-5" />
                      Download Design
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart - ₦
                          {selectedVariant.price.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tips */}
                  <div
                    className="mt-6 p-4 rounded-xl text-sm"
                    style={{
                      backgroundColor: COLORS.background,
                      color: "rgba(64, 18, 104, 0.7)",
                    }}
                  >
                    <strong style={{ color: COLORS.primary }}>💡 Tips:</strong>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Click elements to select and edit</li>
                      <li>Drag to move, use corners to resize</li>
                      <li>Double-click text to edit directly</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCustomizer() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: COLORS.background }}
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: COLORS.primary }}
          />
        </div>
      }
    >
      <ProductCustomizerContent />
    </Suspense>
  );
}
