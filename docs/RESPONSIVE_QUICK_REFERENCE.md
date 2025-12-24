# Responsive Design Quick Reference 🎨

## 🚀 Quick Start

### Basic Responsive Component Template

```tsx
<section className="section-padding" style={{ backgroundColor: '#f8f6f0' }}>
  <div className="container-lg container-padding">
    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12">
      Section Title
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-responsive">
      {/* Your content here */}
    </div>
  </div>
</section>
```

---

## 📏 Spacing System

### Padding & Margins

```tsx
// Section padding (vertical + horizontal)
className="section-padding"  
// → py-12 sm:py-16 md:py-20 lg:py-24 + horizontal padding

// Container padding (horizontal only)
className="container-padding"  
// → px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16

// Responsive gaps (use standard Tailwind)
className="gap-3 sm:gap-4 md:gap-5 lg:gap-6"
className="gap-2 sm:gap-3 md:gap-4"

// Responsive spacing (use standard Tailwind)
className="space-y-4 sm:space-y-6 md:space-y-8"
```

---

## 🎯 Typography

### Headings (Auto-Responsive)

```tsx
<h1>  // text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
<h2>  // text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
<h3>  // text-xl sm:text-2xl md:text-3xl lg:text-4xl
<h4>  // text-lg sm:text-xl md:text-2xl
<h5>  // text-base sm:text-lg md:text-xl
<h6>  // text-sm sm:text-base md:text-lg
```

### Body Text

```tsx
<p className="text-sm sm:text-base">Normal body text</p>
<span className="text-xs sm:text-sm">Small text</span>
```

### Responsive Text Sizing

```tsx
// Use standard Tailwind responsive classes
className="text-xs sm:text-sm"
className="text-sm sm:text-base"
className="text-base sm:text-lg"
className="text-lg sm:text-xl md:text-2xl"
className="text-xl sm:text-2xl md:text-3xl"
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
```

---

## 🎨 Borders & Shadows

### Hairline Borders (0.5px)

```tsx
className="border-hairline"    // All sides
className="border-t-hairline"  // Top only
className="border-b-hairline"  // Bottom only
className="border-l-hairline"  // Left only
className="border-r-hairline"  // Right only
```

### Border Radius

```tsx
className="rounded-card"  // 12px → 16px (responsive)
className="rounded-btn"   // 8px → 12px (responsive)
```

### Shadows (Design System Compliant)

```tsx
className="shadow-card"          // Default card shadow
className="shadow-card-hover"    // Hover state
className="shadow-card-elevated" // Elevated/floating elements
```

---

## 📦 Layout & Containers

### Max Width Containers

```tsx
className="container-sm"  // max-w-3xl mx-auto
className="container-md"  // max-w-5xl mx-auto
className="container-lg"  // max-w-7xl mx-auto
```

### Grid Systems

```tsx
// 2-column responsive grid
className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5"

// 3-column responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"

// 4-column responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
```

### Manual Grid Layout

```tsx
// Product cards
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"

// Feature items
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"

// Category bento grid
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 gap-3 sm:gap-4"
```

---

## 🔘 Buttons

### Responsive Button Sizing

```tsx
// Small to large
className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4"

// Compact
className="px-3 py-1.5 sm:px-4 sm:py-2"

// Icon size in buttons
className="w-4 h-4 sm:w-5 sm:h-5"
```

### Complete Button Example

```tsx
<button className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-btn text-sm sm:text-base md:text-lg font-bold transition-smooth shadow-card hover:shadow-card-hover active:scale-95">
  Click Me
</button>
```

---

## 🖼️ Cards

### Responsive Card Template

```tsx
<div className="rounded-card overflow-hidden border-hairline shadow-card hover:shadow-card-hover transition-smooth">
  {/* Image */}
  <div className="aspect-square overflow-hidden">
    <Image 
      src={src} 
      alt={alt} 
      width={400} 
      height={400}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
  
  {/* Content */}
  <div className="p-3 sm:p-4">
    <h4 className="text-sm sm:text-base font-bold mb-2">{title}</h4>
    <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
  </div>
</div>
```

---

## 📱 Touch Targets

### Minimum Sizes (WCAG 2.1 Compliant)

```tsx
// Standard buttons
className="p-2 sm:p-3"  // Minimum 44x44px

// Icon buttons
className="w-10 h-10 sm:w-12 sm:h-12"

// Form inputs
className="py-2.5 sm:py-3"  // Minimum 44px height
```

---

## 🎭 Transitions & Animations

### Smooth Transitions

```tsx
className="transition-smooth"  // all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

// Hover states
className="hover:scale-105"
className="hover:shadow-card-hover"

// Active states (touch feedback)
className="active:scale-95"
className="active:scale-[0.98]"
```

### Focus States

```tsx
className="focus-ring"
// → focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve focus-visible:ring-offset-2
```

---

## 🖱️ Interactive Elements

### Hover Effects (Desktop Only)

```tsx
// Don't use hover-only interactions on mobile!
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
```

### Touch-Friendly

```tsx
// Always provide active states for touch feedback
className="active:scale-95 transition-smooth"

// Use proper touch targets
className="min-h-[44px] min-w-[44px]"
```

---

## 🎨 Design System Colors

```tsx
// Primary colors (use inline styles)
style={{ 
  backgroundColor: '#401268',  // indigo-ink
  color: '#ffffff'
}}

style={{ 
  backgroundColor: '#c5a3ff',  // mauve
  color: '#401268'
}}

style={{ 
  backgroundColor: '#f8f6f0',  // porcelain
  color: '#401268'
}}

style={{ 
  backgroundColor: '#e2ae3d',  // honey-bronze
  color: '#ffffff'
}}

style={{ 
  backgroundColor: '#e21b35',  // scarlet-rush
  color: '#ffffff'
}}

// Border colors
style={{ borderColor: 'rgba(64, 18, 104, 0.2)' }}  // Light mode
style={{ borderColor: 'rgba(197, 163, 255, 0.3)' }} // Dark mode
```

---

## 📐 Breakpoints Reference

```
Mobile:   < 640px
sm:       640px  (Large phones, small tablets)
md:       768px  (Tablets)
lg:       1024px (Small laptops)
xl:       1280px (Desktops)
2xl:      1536px (Large desktops)
```

---

## ✅ Component Checklist

When creating a new component, ensure:

- [ ] Mobile-first approach (base styles for smallest screen)
- [ ] Responsive font sizes (use utility classes)
- [ ] Hairline borders (0.5px) where needed
- [ ] Proper touch targets (44x44px minimum)
- [ ] Active states for touch feedback
- [ ] Responsive padding/margins
- [ ] Grid layout that adapts
- [ ] Images use Next.js Image component
- [ ] Transitions are smooth (0.3s cubic-bezier)
- [ ] Design system colors (from design.json)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Test on multiple screen sizes

---

## 🔥 Common Patterns

### Section with Cards Grid

```tsx
<section className="section-padding" style={{ backgroundColor: '#f8f6f0' }}>
  <div className="container-lg container-padding">
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
        Title
      </h2>
      <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
        Description
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {items.map(item => <Card key={item.id} {...item} />)}
    </div>
  </div>
</section>
```

### Responsive Image Container

```tsx
<div className="relative aspect-square overflow-hidden rounded-card">
  <Image
    src={imageSrc}
    alt={altText}
    width={600}
    height={600}
    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
  />
</div>
```

### Two-Column Layout (Mobile Stack)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

---

## 🚫 Common Mistakes to Avoid

❌ **DON'T:**
```tsx
className="p-8"              // Fixed padding
className="text-3xl"         // Non-responsive text
className="border-2"         // Thick borders
className="w-96"             // Fixed width
onMouseEnter={...}           // Hover-only interaction
```

✅ **DO:**
```tsx
className="p-4 sm:p-6 md:p-8"                    // Responsive padding
className="text-2xl sm:text-3xl md:text-4xl"    // Responsive text
className="border-hairline"                       // Hairline border
className="w-full max-w-md"                      // Fluid width
className="active:scale-95 hover:scale-105"      // Touch + hover
```

---

## 🎓 Pro Tips

1. **Always test on real devices** - Emulators don't capture everything
2. **Use Chrome DevTools Device Mode** - Quick testing for multiple sizes
3. **Check landscape orientation** - Often forgotten but important
4. **Reduced motion** - Respect user preferences
5. **High DPI displays** - Hairline borders look crisp
6. **Touch targets** - 44px minimum, always
7. **Text contrast** - Maintain 4.5:1 ratio minimum
8. **Loading states** - Make them responsive too

---

## 📚 Related Files

- `src/app/globals.css` - All utility classes defined here
- `design.json` - Color palette and design tokens
- `RESPONSIVE_DESIGN.md` - Full documentation
- `tailwind.config.ts` - Tailwind configuration

---

## 🆘 Need Help?

1. Check `RESPONSIVE_DESIGN.md` for detailed docs
2. Reference existing components for patterns
3. Test in multiple viewports before committing
4. Use browser DevTools for debugging

---

**Remember:** Mobile-first, touch-friendly, accessible! 🚀