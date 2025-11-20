# Arduino Line Tracer Function Generator - Design Guidelines

## Design Approach
**Developer Tool - VS Code Inspired Aesthetic**

Following developer-focused design patterns similar to GitHub, VS Code, and Replit interfaces. Prioritizing clarity, code readability, and efficient workflow over decorative elements.

## Core Design Principles
1. **Code-First Layout**: Code preview is the hero element
2. **Clear Hierarchy**: Controls → Preview → Documentation flow
3. **Technical Professionalism**: Clean, minimal, focused on functionality
4. **Dark Theme**: Default developer preference for reduced eye strain

## Typography

**Font Families**:
- UI Text: Inter or system-ui (`font-sans`)
- Code Display: 'Fira Code', 'JetBrains Mono', or Consolas (`font-mono`)
- Headings: Same as UI text, bold weights

**Scale**:
- Page Title: `text-2xl font-bold`
- Section Headers: `text-lg font-semibold`
- Function Names: `text-base font-medium`
- Body/Labels: `text-sm`
- Code: `text-sm font-mono`
- Helper Text: `text-xs text-gray-500`

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: `p-4` to `p-6`
- Section gaps: `gap-6` to `gap-8`
- Form field spacing: `space-y-4`

**Grid Structure**:
```
[Sidebar Controls - 320px fixed] | [Main Code Area - flex-1]
```

**Responsive Behavior**:
- Desktop (lg:): Side-by-side layout
- Tablet/Mobile: Stack vertically (controls on top)

## Component Library

### Navigation/Header
- Fixed top bar with app title
- Height: `h-14`
- Contains: Logo/title, mode toggle (if needed)

### Sidebar Controls (Left Panel)
- Fixed width: `w-80`
- Scrollable: `overflow-y-auto`
- Background: Distinct from main area
- Sections: Parameter Forms, Function Selector, Actions

### Form Components
**Input Groups**:
- Label above input: `mb-1`
- Input fields: `w-full rounded border px-3 py-2`
- Number inputs with clear +/- controls or range sliders
- Grouped related inputs with subtle borders

**Select Dropdowns**:
- Function selector (scanx, maju_cari_garis, etc.)
- Accuracy mode selector (Cepat, Normal, Presisi)

**Buttons**:
- Primary CTA: "Generate Code" - prominent, full width in sidebar
- Secondary: "Copy Function", "Copy All" - near code blocks
- Icon buttons: Copy icon with tooltip

### Code Display (Main Area)
**Code Block Structure**:
- Syntax highlighted Arduino C++
- Line numbers in gutter
- Header with function name and copy button
- Scrollable: `overflow-x-auto`
- Background: Dark code editor aesthetic
- Monospace font enforced

**Multiple Code Blocks**:
- Stacked vertically with clear separation (`gap-6`)
- Each function in its own collapsible/expandable card

### Documentation Panels
- Accordion/collapsible sections below each generated function
- Icons for parameters, usage examples, notes
- Smaller text, clear but secondary to code

### Status/Feedback
- Toast notifications for copy success
- Inline validation errors near form fields
- Success indicators when code generates

## Visual Hierarchy

**Z-Index Layers**:
1. Modals/Toasts: Highest
2. Fixed Header: Above content
3. Sticky Section Headers: Above scrolling content
4. Main Content: Base layer

**Contrast Patterns**:
- Code blocks: Highest contrast (syntax highlighting)
- Active/selected states: Clear distinction
- Disabled states: Reduced opacity (0.5)

## Interaction Patterns

**Primary Workflow**:
1. Select function from dropdown
2. Adjust parameters in form
3. Generate → Preview code
4. Copy individual or all functions
5. View documentation as needed

**Micro-interactions**:
- Button hover states: Subtle background change
- Copy button: Icon change on success (✓ checkmark)
- Code block: Highlight on hover for clarity
- Smooth scrolling between sections

## Accessibility
- All form inputs have associated labels
- Keyboard navigation for all controls
- Focus indicators on interactive elements
- ARIA labels for icon-only buttons
- Sufficient color contrast (WCAG AA minimum)

## Color Palette Notes
(Color specifications will be determined separately)
- Use semantic naming: primary, success, warning, danger
- Code syntax: Standard highlighting scheme (keywords, strings, comments, numbers)
- Dark theme base with light text
- Accent color for CTAs and active states

## Images
**No hero images needed** - this is a utility application. Focus entirely on functional interface elements.

Optional decorative elements:
- Small icon/logo in header
- Diagram illustrations in documentation sections showing sensor configurations (simple SVG line drawings)

## Special Considerations

**Code Preview Requirements**:
- Must handle long function bodies without breaking layout
- Horizontal scroll for wide code lines
- Copy button always visible (sticky or floating)
- Clear visual separation between multiple functions

**Parameter Forms**:
- Real-time validation (e.g., kecepatan 0-255)
- Tooltips explaining technical terms
- Preset buttons for common configurations (Cepat, Normal, Presisi)

**Export Functionality**:
- Copy to clipboard with formatting preserved
- Optional: Download as .txt or .ino file
- Visual confirmation of successful copy