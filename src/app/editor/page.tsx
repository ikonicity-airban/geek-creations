"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trash2,
  Download,
  RotateCw,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Save,
  ChevronRight,
  ChevronLeft,
  Circle,
  Square,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Toolbar } from "@/components/editor/Toolbar";
import { IconSidebar } from "@/components/editor/IconSidebar";
import { BottomNav } from "@/components/editor/BottomNav";
import { BottomSheet } from "@/components/editor/BottomSheet";
import { ZoomControls } from "@/components/editor/ZoomControls";
import { CanvasArea } from "@/components/editor/CanvasArea";
import { ProductPreview } from "@/components/editor/ProductPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productGuideRef = useRef<any>(null);

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

  // New state for redesigned editor
  const [showGridlines, setShowGridlines] = useState(true);
  const [editMode, setEditMode] = useState<"edit" | "preview">("edit");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<
    "colors" | "fonts" | "shapes" | "text" | "products" | null
  >(null);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProductSidebarCollapsed, setIsProductSidebarCollapsed] =
    useState(false);

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

  // Load product guide image when product/variant changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !selectedProduct) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric as any;
    if (!fabric) return;

    const productImageUrl =
      selectedVariant?.image_id &&
      selectedProduct.images.find((img) => img.id === selectedVariant.image_id)
        ? selectedProduct.images.find(
            (img) => img.id === selectedVariant.image_id
          )?.src
        : selectedProduct.images[0]?.src;

    if (!productImageUrl) return;

    // Remove old guide if exists
    if (productGuideRef.current) {
      fabricCanvasRef.current.remove(productGuideRef.current);
      productGuideRef.current = null;
    }

    // Load and add product guide as locked background
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric.Image.fromURL(productImageUrl, (img: any) => {
      img.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        opacity: 0.3, // Make it subtle
        originX: "center",
        originY: "center",
      });

      // Center the image
      const canvas = fabricCanvasRef.current;
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
      });

      // Scale to fit canvas
      const scale = Math.min(
        (canvas.width * 0.8) / img.width,
        (canvas.height * 0.8) / img.height
      );
      img.scale(scale);

      // Add to canvas at the bottom (background layer)
      // Ensure guide is always at the bottom
      canvas.insertAt(img, 0, false);
      productGuideRef.current = img;

      // Move guide to bottom if other objects exist
      canvas.sendToBack(img);
      canvas.renderAll();
    });
  }, [selectedProduct, selectedVariant]);

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

        // Debug: Log canvas setup
        console.log("Canvas initialized:", canvas.width, "x", canvas.height);
        console.log("Canvas objects:", canvas.getObjects().length);

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

        // Save canvas state for history
        let currentHistoryIndex = historyIndex;
        const saveState = () => {
          const json = JSON.stringify(canvas.toJSON());
          setHistory((prev) => {
            const newHistory = prev.slice(0, currentHistoryIndex + 1);
            newHistory.push(json);
            currentHistoryIndex = newHistory.length - 1;
            setHistoryIndex(currentHistoryIndex);
            return newHistory;
          });
        };
        canvas.on("object:added", saveState);
        canvas.on("object:modified", saveState);
        canvas.on("object:removed", saveState);

        // Update preview data URL - debounced to avoid infinite loops
        let previewTimeout: NodeJS.Timeout | null = null;
        const updatePreview = () => {
          if (previewTimeout) {
            clearTimeout(previewTimeout);
          }
          previewTimeout = setTimeout(() => {
            try {
              // Use requestAnimationFrame to ensure canvas is ready
              requestAnimationFrame(() => {
                if (fabricCanvasRef.current) {
                  const dataUrl = fabricCanvasRef.current.toDataURL({
                    format: "png",
                    quality: 0.9,
                  });
                  setCanvasDataUrl(dataUrl);
                }
              });
            } catch (error) {
              // Silently fail if canvas is not ready
              console.error("Failed to update preview:", error);
            }
          }, 500); // Debounce by 500ms
        };

        // Only update preview on object changes, not on every render
        // Remove after:render listener to prevent infinite loops
        canvas.on("object:added", () => {
          canvas.renderAll();
          updatePreview();
        });
        canvas.on("object:modified", () => {
          canvas.renderAll();
          updatePreview();
        });
        canvas.on("object:removed", () => {
          canvas.renderAll();
          updatePreview();
        });
        canvas.on("object:moved", () => {
          canvas.renderAll();
          updatePreview();
        });

        // Initial render
        canvas.renderAll();
        // Initial preview after a delay
        setTimeout(() => updatePreview(), 1000);
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
  }, [isLoading, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0 && fabricCanvasRef.current) {
      const newIndex = historyIndex - 1;
      fabricCanvasRef.current.loadFromJSON(history[newIndex], () => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && fabricCanvasRef.current) {
      const newIndex = historyIndex + 1;
      fabricCanvasRef.current.loadFromJSON(history[newIndex], () => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current || !textInput.trim()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;
    if (!fabric) {
      console.error("Fabric.js not loaded");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text: any = new fabric.IText(textInput, {
      left: 200,
      top: 250,
      fontFamily: selectedFont,
      fill: selectedColor || "#000000", // Ensure color is set
      fontSize: 40,
      stroke: null,
      strokeWidth: 0,
      originX: "center",
      originY: "center",
    });

    // Ensure color is visible
    if (!selectedColor || selectedColor === "#FFFFFF") {
      text.set("fill", "#000000");
    }

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    // Ensure text is above product guide
    if (productGuideRef.current) {
      fabricCanvasRef.current.bringToFront(text);
    }
    // Force render
    fabricCanvasRef.current.renderAll();
    console.log("Text added:", textInput, "Color:", text.fill);
    setTextInput("");
    if (isMobile) {
      setShowBottomSheet(false);
      setActiveTool(null);
    }
  };

  const addShape = (type: "circle" | "rectangle") => {
    if (!fabricCanvasRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shape: any;
    if (type === "circle") {
      shape = new fabric.Circle({
        radius: 50,
        fill: selectedColor,
        left: 200,
        top: 250,
        stroke: "#000000",
        strokeWidth: 0,
      });
    } else if (type === "rectangle") {
      shape = new fabric.Rect({
        width: 100,
        height: 80,
        fill: selectedColor,
        left: 200,
        top: 250,
        stroke: "#000000",
        strokeWidth: 0,
      });
    }

    if (shape) {
      // Ensure color is set - default to black if white or empty
      const fillColor =
        selectedColor && selectedColor !== "#FFFFFF"
          ? selectedColor
          : "#000000";
      shape.set("fill", fillColor);

      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      // Ensure shape is above product guide
      if (productGuideRef.current) {
        fabricCanvasRef.current.bringToFront(shape);
      }
      // Force render
      fabricCanvasRef.current.renderAll();
      console.log(
        "Shape added:",
        type,
        "Color:",
        fillColor,
        "Objects on canvas:",
        fabricCanvasRef.current.getObjects().length
      );
      if (isMobile) {
        setShowBottomSheet(false);
        setActiveTool(null);
      }
    } else {
      console.error("Failed to create shape:", type);
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
          left: 200,
          top: 250,
          originX: "center",
          originY: "center",
        });
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        // Ensure image is above product guide
        if (productGuideRef.current) {
          fabricCanvasRef.current.bringToFront(img);
        }
        // Force render
        fabricCanvasRef.current.renderAll();
        console.log("Image uploaded and added to canvas");
        if (isMobile) {
          setShowBottomSheet(false);
          setActiveTool(null);
        }
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
    if (!fabricCanvasRef.current || !activeObject) {
      // If no active object, just update the selected color for next object
      return;
    }

    // Update the active object's color
    if (activeObject.type === "i-text" || activeObject.type === "text") {
      activeObject.set("fill", color);
    } else {
      activeObject.set("fill", color);
    }
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

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    if (isMobile) {
      if (tool === "colors") {
        setBottomSheetContent("colors");
        setShowBottomSheet(true);
      } else if (tool === "fonts") {
        setBottomSheetContent("fonts");
        setShowBottomSheet(true);
      } else if (tool === "shapes") {
        setBottomSheetContent("shapes");
        setShowBottomSheet(true);
      } else if (tool === "upload") {
        fileInputRef.current?.click();
      } else if (tool === "text") {
        setBottomSheetContent("text");
        setShowBottomSheet(true);
      }
    } else {
      // Desktop: handle text input inline
      if (tool === "text") {
        // Text input is shown inline on desktop
      }
    }
  };

  const handleZoomChange = (zoom: number) => {
    setZoomLevel(Math.max(25, Math.min(200, zoom)));
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
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <div className="bg-white border-b border-primary/20 px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        {isMobile ? (
          <h1
            className="text-lg font-bold flex-1"
            style={{ color: COLORS.primary }}
          >
            Product Customizer
          </h1>
        ) : (
          <div className="flex-1">
            <h1
              className="text-2xl font-black"
              style={{
                color: COLORS.primary,
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              Product Customizer
            </h1>
            <p className="text-sm" style={{ color: "rgba(64, 18, 104, 0.75)" }}>
              Design your perfect product
            </p>
          </div>
        )}
      </div>

      {/* Top Toolbar */}
      <Toolbar
        editMode={editMode}
        onEditModeChange={setEditMode}
        showGridlines={showGridlines}
        onToggleGridlines={() => setShowGridlines(!showGridlines)}
        zoomLevel={zoomLevel}
        onZoomIn={() => handleZoomChange(zoomLevel + 10)}
        onZoomOut={() => handleZoomChange(zoomLevel - 10)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Icon Sidebar - Desktop only */}
        {!isMobile && (
          <IconSidebar
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            onTextClick={() => {
              // Show text input in a modal or inline
              const input = prompt("Enter text:");
              if (input) {
                setTextInput(input);
                addText();
              }
            }}
            onUploadClick={() => fileInputRef.current?.click()}
            onShapeClick={addShape}
            onColorClick={() => {
              setActiveTool("colors");
            }}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col">
            <CanvasArea
              canvasRef={canvasRef}
              fabricCanvasRef={fabricCanvasRef}
              showGridlines={showGridlines}
              zoomLevel={zoomLevel}
              isMobile={isMobile}
            />

            {/* Canvas Object Controls */}
            {activeObject && editMode === "edit" && (
              <div className="bg-white border-t border-primary/20 px-4 py-2 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateObject}
                  className="gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelected}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}

            {/* Text Input - Desktop inline */}
            {!isMobile && activeTool === "text" && (
              <div className="bg-white border-t border-primary/20 px-4 py-3">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addText()}
                      placeholder="Enter your text..."
                      className="flex-1"
                    />
                    <Button onClick={addText}>Add</Button>
                  </div>
                  {activeObject?.type === "i-text" && (
                    <div className="flex gap-2">
                      <select
                        value={selectedFont}
                        onChange={(e) => changeFont(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-primary/20 text-sm"
                        style={{ fontFamily: selectedFont }}
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
                      <div className="grid grid-cols-6 gap-1">
                        {PRESET_COLORS.slice(0, 6).map((color) => (
                          <button
                            key={color}
                            onClick={() => changeColor(color)}
                            className={`w-8 h-8 rounded border-2 ${
                              selectedColor === color
                                ? "border-primary border-4"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Color Picker - Desktop inline */}
            {!isMobile && activeTool === "colors" && (
              <div className="bg-white border-t border-primary/20 px-4 py-3">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary">
                    Select Color
                  </h4>
                  <div className="grid grid-cols-8 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => changeColor(color)}
                        className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                          selectedColor === color
                            ? "border-primary border-4"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shapes Panel - Desktop inline */}
            {!isMobile && activeTool === "shapes" && (
              <div className="bg-white border-t border-primary/20 px-4 py-3">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary">
                    Add Shape
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => addShape("circle")}
                      className="h-24 flex-col gap-2"
                    >
                      <Circle className="w-8 h-8" />
                      <span>Circle</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addShape("rectangle")}
                      className="h-24 flex-col gap-2"
                    >
                      <Square className="w-8 h-8" />
                      <span>Rectangle</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Preview - Desktop only */}
          {!isMobile && (
            <div className="w-80 border-l border-primary/20 bg-white p-4 overflow-y-auto">
              <ProductPreview
                product={selectedProduct}
                variant={selectedVariant}
                canvasDataUrl={canvasDataUrl}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - Product Selection - Desktop only */}
        {!isMobile && (
          <div
            className={`border-l border-primary/20 bg-white transition-all duration-300 ${
              isProductSidebarCollapsed ? "w-12" : "w-80"
            } flex flex-col`}
          >
            <div className="p-4 border-b border-primary/20 flex items-center justify-between">
              {!isProductSidebarCollapsed && (
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  Select Product
                </h3>
              )}
              <button
                onClick={() =>
                  setIsProductSidebarCollapsed(!isProductSidebarCollapsed)
                }
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                {isProductSidebarCollapsed ? (
                  <ChevronLeft className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
            {!isProductSidebarCollapsed && (
              <div className="flex-1 overflow-y-auto p-4">
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
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="accent"
                        onClick={downloadDesign}
                        className="w-full gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download Design
                      </Button>

                      <Button
                        onClick={handleAddToCart}
                        disabled={isSaving}
                        className="w-full gap-2"
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
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-primary/20 flex items-center justify-between px-4 py-2">
        {isMobile && (
          <ZoomControls
            zoomLevel={zoomLevel}
            onZoomIn={() => handleZoomChange(zoomLevel + 10)}
            onZoomOut={() => handleZoomChange(zoomLevel - 10)}
            onZoomChange={handleZoomChange}
            isMobile={true}
          />
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronDown className="w-4 h-4" />
            3D Preview
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNav
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          onProductSelect={() => {
            setBottomSheetContent("products");
            setShowBottomSheet(true);
          }}
        />
      )}

      {/* Mobile Bottom Sheet */}
      {isMobile && (
        <BottomSheet
          isOpen={showBottomSheet}
          onClose={() => {
            setShowBottomSheet(false);
            setBottomSheetContent(null);
          }}
          content={bottomSheetContent}
          selectedColor={selectedColor}
          onColorSelect={changeColor}
          selectedFont={selectedFont}
          onFontSelect={changeFont}
          onShapeSelect={addShape}
          presetColors={PRESET_COLORS}
          fonts={FONTS}
          textInput={textInput}
          onTextInputChange={setTextInput}
          onTextAdd={addText}
          products={products}
          selectedProduct={selectedProduct}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setSelectedVariant(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              product.variants.find((v: any) => v.available) ||
                product.variants[0]
            );
          }}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={uploadImage}
        className="hidden"
      />
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
