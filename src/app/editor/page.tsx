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
  Circle,
  Square,
  Copy,
  FlipHorizontal,
  FlipVertical,
  ArrowUp,
  ArrowDown,
  AlignCenter,
  Plus,
  X,
  Upload,
  Eye,
  Edit,
  Grid3x3,
  Pipette,
  Ruler,
  Maximize2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { IconSidebar } from "@/components/editor/IconSidebar";
import { CanvasArea } from "@/components/editor/CanvasArea";
import { ProductPreview } from "@/components/editor/ProductPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getProductDoodleSVG,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from "@/lib/editor/product-doodle-outlines";
import { cn } from "@/lib/utils";

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

  const productHandle = searchParams.get("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeObject, setActiveObject] = useState<any>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#401268");
  const [canvasBgColor, setCanvasBgColor] = useState("#ffffff");
  const [selectedCategory, setSelectedCategory] = useState<string>("t-shirt");
  const [selectedFace, setSelectedFace] = useState<string>("front");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Active Object Metrics state (Width, Height, X, Y, Rotation)
  const [objectMetrics, setObjectMetrics] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
    angle: number;
  } | null>(null);

  // Canva / Photoshop tool drawer state
  const [activeTool, setActiveTool] = useState<string | null>("products");
  const [showGridlines, setShowGridlines] = useState(true);
  const [editMode, setEditMode] = useState<"edit" | "preview">("edit");
  const [zoomLevel] = useState(100);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?limit=20");
        const json = await res.json();
        const fetchedProducts = json.products || [];
        setProducts(fetchedProducts);

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
            setSelectedProduct(fetchedProducts[0]);
            setSelectedVariant(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fetchedProducts[0].variants.find((v: any) => v.available) ||
                fetchedProducts[0].variants[0]
            );
          }
        } else if (fetchedProducts.length > 0) {
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

  // Current active category object
  const currentCategory =
    PRODUCT_CATEGORIES.find(
      (c) =>
        c.type === selectedCategory ||
        (selectedProduct &&
          selectedProduct.product_type?.toLowerCase().includes(c.id))
    ) || PRODUCT_CATEGORIES[0];

  // Helper to load product line-art SVG mockup guide onto Fabric.js canvas
  const loadProductGuide = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas: any,
    product: Product | null,
    category: string,
    face: string,
    bgColor: string = canvasBgColor
  ) => {
    if (!canvas) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric as any;
    if (!fabric) return;

    if (productGuideRef.current) {
      try {
        canvas.remove(productGuideRef.current);
      } catch (e) {
        console.error("Error removing guide:", e);
      }
      productGuideRef.current = null;
    }

    const isDarkBg =
      bgColor === "#18181b" ||
      bgColor === "#1e1b4b" ||
      bgColor === "#000000" ||
      bgColor === "#401268";

    const strokeColor = isDarkBg ? "#c5a3ff" : "#401268";
    const accentColor = isDarkBg ? "#818cf8" : "#6366f1";

    const typeString = product?.product_type || product?.title || category;
    const svgString = getProductDoodleSVG(
      typeString,
      face,
      strokeColor,
      accentColor
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric.loadSVGFromString(svgString, (objects: any[], options: any) => {
      if (!canvas) return;
      if (!objects || objects.length === 0) return;

      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        originX: "center",
        originY: "center",
      });

      obj.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
      });

      const objWidth = obj.width || 500;
      const objHeight = obj.height || 500;
      const scale = Math.min(
        (canvas.width * 0.82) / objWidth,
        (canvas.height * 0.82) / objHeight
      );

      if (!isNaN(scale) && isFinite(scale) && scale > 0) {
        obj.scale(scale);
      }

      canvas.add(obj);
      productGuideRef.current = obj;
      canvas.sendToBack(obj);
      canvas.renderAll();
    });
  };

  // Load product vector guide when product, category, or face changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      loadProductGuide(
        fabricCanvasRef.current,
        selectedProduct,
        selectedCategory,
        selectedFace,
        canvasBgColor
      );
    }
  }, [selectedProduct, selectedVariant, selectedCategory, selectedFace, canvasBgColor]);

  // Update canvas background color
  const changeCanvasBgColor = (color: string) => {
    setCanvasBgColor(color);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setBackgroundColor(color, () => {
        loadProductGuide(
          fabricCanvasRef.current,
          selectedProduct,
          selectedCategory,
          selectedFace,
          color
        );
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  // Helper to extract active object metrics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateObjectMetrics = (obj: any) => {
    if (!obj) {
      setObjectMetrics(null);
      return;
    }
    const scaledWidth = (obj.width * (obj.scaleX || 1) * 0.05).toFixed(1);
    const scaledHeight = (obj.height * (obj.scaleY || 1) * 0.05).toFixed(1);
    const leftCm = (obj.left * 0.05).toFixed(1);
    const topCm = (obj.top * 0.05).toFixed(1);
    const angle = Math.round(obj.angle || 0);

    setObjectMetrics({
      width: Number(scaledWidth),
      height: Number(scaledHeight),
      left: Number(leftCm),
      top: Number(topCm),
      angle,
    });
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (isLoading) return;

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
          width: 500,
          height: 560,
          backgroundColor: "#ffffff",
        });

        fabricCanvasRef.current = canvas;

        // Load initial vector mockup guide immediately after canvas creation
        loadProductGuide(canvas, selectedProduct, selectedCategory, selectedFace);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("selection:created", (e: any) => {
          const obj = e.selected[0];
          setActiveObject(obj);
          updateObjectMetrics(obj);
          if (obj.type === "i-text" || obj.type === "text") {
            setTextInput(obj.text || "");
            if (obj.fontFamily) setSelectedFont(obj.fontFamily);
            if (obj.fill) setSelectedColor(obj.fill);
          }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("selection:updated", (e: any) => {
          const obj = e.selected[0];
          setActiveObject(obj);
          updateObjectMetrics(obj);
          if (obj.type === "i-text" || obj.type === "text") {
            setTextInput(obj.text || "");
            if (obj.fontFamily) setSelectedFont(obj.fontFamily);
            if (obj.fill) setSelectedColor(obj.fill);
          }
        });
        canvas.on("selection:cleared", () => {
          setActiveObject(null);
          setObjectMetrics(null);
        });

        // Track metric changes on object transformation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("object:scaling", (e: any) => updateObjectMetrics(e.target));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("object:moving", (e: any) => updateObjectMetrics(e.target));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvas.on("object:rotating", (e: any) => updateObjectMetrics(e.target));

        const saveState = () => {
          const json = JSON.stringify(canvas.toJSON());
          const currentHistory = historyRef.current;
          const currentIndex = historyIndexRef.current;
          const newHistory = currentHistory.slice(0, currentIndex + 1);
          newHistory.push(json);

          historyRef.current = newHistory;
          historyIndexRef.current = newHistory.length - 1;
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        };
        canvas.on("object:added", saveState);
        canvas.on("object:modified", saveState);
        canvas.on("object:removed", saveState);

        let previewTimeout: NodeJS.Timeout | null = null;
        const updatePreview = () => {
          if (previewTimeout) {
            clearTimeout(previewTimeout);
          }
          previewTimeout = setTimeout(() => {
            try {
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
              console.error("Failed to update preview:", error);
            }
          }, 350);
        };

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

        canvas.renderAll();
        setTimeout(() => updatePreview(), 600);
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
    if (!fabricCanvasRef.current) return;
    const textToAdd = textInput.trim() || "Your Custom Text";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;
    if (!fabric) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text: any = new fabric.IText(textToAdd, {
      left: 250,
      top: 280,
      fontFamily: selectedFont,
      fill: selectedColor || "#401268",
      fontSize: 38,
      originX: "center",
      originY: "center",
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    if (productGuideRef.current) {
      fabricCanvasRef.current.bringToFront(text);
    }
    fabricCanvasRef.current.renderAll();
    setTextInput("");
  };

  const updateActiveText = (val: string) => {
    setTextInput(val);
    if (
      fabricCanvasRef.current &&
      activeObject &&
      (activeObject.type === "i-text" || activeObject.type === "text")
    ) {
      activeObject.set("text", val);
      fabricCanvasRef.current.renderAll();
    }
  };

  const addShape = (type: "circle" | "rectangle") => {
    if (!fabricCanvasRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabric = (window as any).fabric;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shape: any;
    const fillColor = selectedColor || "#401268";

    if (type === "circle") {
      shape = new fabric.Circle({
        radius: 55,
        fill: fillColor,
        left: 250,
        top: 280,
        originX: "center",
        originY: "center",
      });
    } else if (type === "rectangle") {
      shape = new fabric.Rect({
        width: 120,
        height: 90,
        fill: fillColor,
        left: 250,
        top: 280,
        originX: "center",
        originY: "center",
      });
    }

    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      if (productGuideRef.current) {
        fabricCanvasRef.current.bringToFront(shape);
      }
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
          left: 250,
          top: 280,
          originX: "center",
          originY: "center",
        });
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        if (productGuideRef.current) {
          fabricCanvasRef.current.bringToFront(img);
        }
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
    setObjectMetrics(null);
  };

  const bringForward = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    fabricCanvasRef.current.bringForward(activeObject);
    fabricCanvasRef.current.renderAll();
  };

  const sendBackward = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    fabricCanvasRef.current.sendBackwards(activeObject);
    if (productGuideRef.current) {
      fabricCanvasRef.current.sendToBack(productGuideRef.current);
    }
    fabricCanvasRef.current.renderAll();
  };

  const flipX = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    activeObject.set("flipX", !activeObject.flipX);
    fabricCanvasRef.current.renderAll();
  };

  const flipY = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    activeObject.set("flipY", !activeObject.flipY);
    fabricCanvasRef.current.renderAll();
  };

  const centerObjectOnCanvas = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    activeObject.center();
    fabricCanvasRef.current.renderAll();
    updateObjectMetrics(activeObject);
  };

  const duplicateSelected = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    activeObject.clone((cloned: typeof activeObject) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      fabricCanvasRef.current.add(cloned);
      fabricCanvasRef.current.setActiveObject(cloned);
      fabricCanvasRef.current.renderAll();
      updateObjectMetrics(cloned);
    });
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
      (activeObject.type !== "i-text" && activeObject.type !== "text")
    )
      return;

    activeObject.set("fontFamily", font);
    fabricCanvasRef.current.renderAll();
  };

  const rotateObject = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    activeObject.rotate((activeObject.angle || 0) + 15);
    fabricCanvasRef.current.renderAll();
    updateObjectMetrics(activeObject);
  };

  const downloadDesign = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = `geek-design-${selectedFace}-${Date.now()}.png`;
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
      const preview = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 0.9,
      });

      const formData = new FormData();
      const blob = await fetch(preview).then((r) => r.blob());
      formData.append("file", blob, `design-${selectedFace}-${Date.now()}.png`);
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
            printFace: selectedFace,
            metrics: objectMetrics,
          }),
        });

        if (mockupRes.ok) {
          const mockupData = await mockupRes.json();
          mockupUrl = mockupData.mockupUrl;
        }
      } catch (err) {
        console.error("Mockup generation failed:", err);
      }

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
          variant_title: `${selectedVariant.title} (${selectedFace.toUpperCase()})`,
          price: selectedVariant.price,
          image: variantImage?.src || selectedProduct.images[0]?.src || "",
          sku: selectedVariant.sku,
          max_quantity: selectedVariant.inventory_quantity,
          uploaded_design_url: uploadData.url,
          mockup_url: mockupUrl,
        },
        1
      );

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground text-sm font-semibold">
          Initializing Photoshop/Canva Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-foreground select-none">
      {/* Sleek Ultra-Compact Top Navbar (Maximizes Y-Space) */}
      <header className="bg-card border-b border-border px-4 py-2 flex items-center justify-between z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-xl hover:bg-muted text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span
            className="text-base font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            GEEK STUDIO
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            / Print Measurement Studio
          </span>
        </div>

        {/* Quick Top Actions: Mode Toggle, Preview Modal & Add To Cart */}
        <div className="flex items-center gap-2">
          <Button
            variant={editMode === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode("edit")}
            className="h-8 px-3 text-xs font-bold gap-1"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Mode
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewModal(true)}
            className="h-8 px-3 text-xs font-bold gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Mockup
          </Button>

          {selectedVariant && (
            <Button
              onClick={handleAddToCart}
              disabled={isSaving}
              size="sm"
              className="h-8 px-4 font-bold text-xs gap-1.5 bg-primary text-primary-foreground shadow-md"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )}
              Add to Cart ₦{selectedVariant.price.toLocaleString()}
            </Button>
          )}
        </div>
      </header>

      {/* Studio Body Layout (Canva / Photoshop Dock + Flyout Tool Drawer + Maximum Y Canvas) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Photoshop / Canva Tool Dock */}
        <IconSidebar
          activeTool={activeTool}
          onToolSelect={(tool) => setActiveTool(tool)}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        {/* Canva-Style Tool Drawer Flyout Panel */}
        {activeTool && (
          <aside className="w-80 h-full bg-card border-r border-border shadow-2xl z-20 flex flex-col shrink-0 animate-in slide-in-from-left-4 duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {activeTool} Tools
              </span>
              <button
                onClick={() => setActiveTool(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {/* Products Tool Tab */}
              {activeTool === "products" && (
                <div className="space-y-4">
                  {/* Category Tiles Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Product Categories
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_CATEGORIES.map((cat: ProductCategory) => {
                        const isCatSelected = selectedCategory === cat.type;

                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.type);
                              setSelectedFace(cat.faces[0]?.id || "front");
                            }}
                            className={cn(
                              "p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group",
                              isCatSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                                : "bg-card border-border hover:border-border/80 hover:bg-muted/40"
                            )}
                          >
                            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                              {cat.icon}
                            </span>
                            <div>
                              <div className="font-bold text-xs leading-tight">
                                {cat.name}
                              </div>
                              <div
                                className={cn(
                                  "text-[10px] mt-0.5 truncate",
                                  isCatSelected
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                )}
                              >
                                {cat.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Product Items */}
                  <div className="pt-3 border-t border-border/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Items
                    </h4>

                    <div className="space-y-3">
                      {products.map((product) => {
                        const isSelected = selectedProduct?.id === product.id;

                        return (
                          <div key={product.id} className="space-y-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setSelectedVariant(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  product.variants.find((v: any) => v.available) ||
                                    product.variants[0]
                                );
                              }}
                              className={cn(
                                "w-full p-3 rounded-2xl border flex items-center gap-3 transition-all text-left",
                                isSelected
                                  ? "bg-primary/10 border-primary shadow-sm"
                                  : "bg-card border-border/80 hover:border-border hover:bg-muted/30"
                              )}
                            >
                              {product.images[0] && (
                                <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/40">
                                  <Image
                                    src={product.images[0].src}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-xs truncate text-foreground">
                                  {product.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase truncate">
                                  {product.product_type}
                                </div>
                              </div>
                            </button>

                            {/* Variant Pills */}
                            {isSelected && product.variants.length > 1 && (
                              <div className="pl-2 flex flex-wrap gap-1.5">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {product.variants.map((variant: any) => (
                                  <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={cn(
                                      "px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all",
                                      selectedVariant?.id === variant.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    {variant.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Text Tool Tab */}
              {activeTool === "text" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Type Text Content
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={textInput}
                        onChange={(e) => updateActiveText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addText()}
                        placeholder="Enter text string..."
                        className="h-10 rounded-xl bg-background border-border text-xs"
                      />
                      <Button
                        onClick={addText}
                        size="sm"
                        className="h-10 px-3 font-bold text-xs gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Font Family
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {FONTS.map((font) => (
                        <button
                          key={font}
                          onClick={() => changeFont(font)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl text-xs border transition-all",
                            selectedFont === font
                              ? "bg-primary/10 border-primary text-primary font-bold"
                              : "border-border/60 hover:bg-muted"
                          )}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Uploads Tool Tab */}
              {activeTool === "upload" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Upload Custom Graphic
                  </h4>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-6 text-center cursor-pointer bg-muted/20 transition-all group"
                  >
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-foreground">
                      Click to Upload Image
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Supports PNG, JPG, SVG, WebP
                    </p>
                  </div>
                </div>
              )}

              {/* Shapes Tool Tab */}
              {activeTool === "shapes" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Vector Elements
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => addShape("circle")}
                      className="h-20 flex-col gap-1.5 rounded-2xl border-border hover:border-primary"
                    >
                      <Circle className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold">Circle</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addShape("rectangle")}
                      className="h-20 flex-col gap-1.5 rounded-2xl border-border hover:border-primary"
                    >
                      <Square className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold">Rectangle</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Colors Tool Tab with Custom Color Picker & Swatches */}
              {activeTool === "colors" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Color Palette & Custom Picker
                  </h4>

                  {/* Interactive Color Picker */}
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => changeColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0 shadow-xs"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          Custom Color
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground uppercase">
                          {selectedColor}
                        </span>
                      </div>
                    </div>
                    <Pipette className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-5 gap-2.5 pt-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => changeColor(color)}
                        className={cn(
                          "aspect-square rounded-xl border transition-all hover:scale-110 shadow-xs",
                          selectedColor === color
                            ? "ring-2 ring-primary ring-offset-2 border-white"
                            : "border-border/60"
                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layers & Transform Tool Tab */}
              {activeTool === "layers" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Layering & Position
                  </h4>

                  {activeObject ? (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={rotateObject}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <RotateCw className="w-4 h-4 text-primary" /> Rotate +15°
                      </Button>
                      <Button
                        variant="outline"
                        onClick={bringForward}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <ArrowUp className="w-4 h-4 text-primary" /> Bring Forward
                      </Button>
                      <Button
                        variant="outline"
                        onClick={sendBackward}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <ArrowDown className="w-4 h-4 text-primary" /> Send Backward
                      </Button>
                      <Button
                        variant="outline"
                        onClick={flipX}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <FlipHorizontal className="w-4 h-4 text-primary" /> Flip Horizontal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={flipY}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <FlipVertical className="w-4 h-4 text-primary" /> Flip Vertical
                      </Button>
                      <Button
                        variant="outline"
                        onClick={centerObjectOnCanvas}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <AlignCenter className="w-4 h-4 text-primary" /> Center Object
                      </Button>
                      <Button
                        variant="outline"
                        onClick={duplicateSelected}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <Copy className="w-4 h-4 text-primary" /> Duplicate Object
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={deleteSelected}
                        className="w-full justify-start gap-2 h-9 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Object
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Select an object on the canvas to inspect layering and transform controls.
                    </p>
                  )}
                </div>
              )}

              {/* Canvas Settings Tool Tab with Background Color Picker */}
              {activeTool === "settings" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Canvas Preferences & Background
                  </h4>

                  {/* Canvas Background Color Picker */}
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                    <span className="text-xs font-bold text-foreground block">
                      Canvas Stage Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={canvasBgColor}
                        onChange={(e) => changeCanvasBgColor(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        {canvasBgColor}
                      </span>
                    </div>
                    {/* Quick Swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {["#ffffff", "#f4f4f5", "#18181b", "#1e1b4b", "#401268"].map(
                        (bg) => (
                          <button
                            key={bg}
                            onClick={() => changeCanvasBgColor(bg)}
                            className={cn(
                              "w-6 h-6 rounded-lg border transition-transform hover:scale-110",
                              canvasBgColor === bg
                                ? "ring-2 ring-primary ring-offset-1 border-white"
                                : "border-border/60"
                            )}
                            style={{ backgroundColor: bg }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <Button
                    variant={showGridlines ? "default" : "outline"}
                    onClick={() => setShowGridlines(!showGridlines)}
                    className="w-full justify-start gap-2 h-10 text-xs font-bold"
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Toggle Gridlines
                  </Button>

                  <Button
                    variant="outline"
                    onClick={downloadDesign}
                    className="w-full justify-start gap-2 h-10 text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </Button>
                </div>
              )}
            </ScrollArea>
          </aside>
        )}

        {/* 100% Spacious Y-Direction Canvas Area with Face Switcher & Metrics HUD */}
        <main className="flex-1 h-full w-full relative flex flex-col overflow-hidden">
          {/* Top Multi-Face View Switcher Pill Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-card/85 backdrop-blur-md border border-border/80 shadow-lg">
            {currentCategory.faces.map((face) => (
              <button
                key={face.id}
                onClick={() => setSelectedFace(face.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                  selectedFace === face.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {face.name}
              </button>
            ))}
          </div>

          {/* Real-time Design Metrics HUD Floating Card */}
          {objectMetrics && (
            <div className="absolute bottom-4 right-4 z-30 p-3 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-xl space-y-1.5 min-w-[200px] text-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border/50 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-primary" /> Metrics HUD
                </span>
                <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {selectedFace.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground">Width: </span>
                  <span className="font-bold text-foreground">{objectMetrics.width} cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Height: </span>
                  <span className="font-bold text-foreground">{objectMetrics.height} cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pos X: </span>
                  <span className="font-bold text-foreground">{objectMetrics.left} cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pos Y: </span>
                  <span className="font-bold text-foreground">{objectMetrics.top} cm</span>
                </div>
              </div>
              {objectMetrics.angle !== 0 && (
                <div className="text-[11px] font-mono text-muted-foreground pt-0.5 border-t border-border/30">
                  Rotation: <span className="font-bold text-foreground">{objectMetrics.angle}°</span>
                </div>
              )}
            </div>
          )}

          <CanvasArea
            canvasRef={canvasRef}
            fabricCanvasRef={fabricCanvasRef}
            showGridlines={showGridlines}
            zoomLevel={zoomLevel}
            isMobile={isMobile}
          />
        </main>
      </div>

      {/* Mockup Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <ProductPreview
              product={selectedProduct}
              variant={selectedVariant}
              canvasDataUrl={canvasDataUrl}
            />
          </div>
        </div>
      )}

      {/* Hidden File Input for Graphics */}
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
          <p className="text-muted-foreground text-sm font-semibold">
            Loading Geek Studio...
          </p>
        </div>
      }
    >
      <ProductCustomizerContent />
    </Suspense>
  );
}
