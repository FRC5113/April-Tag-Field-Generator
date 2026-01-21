https://frc5113.github.io/April-Tag-Field-Generator/
# AprilTag Field Editor

A lightweight, browser-based tool for **creating, editing, and visualizing AprilTag field layouts**.  
It allows you to define a field, place AprilTags with 3D pose data, and import/export JSON files for use in robotics projects (e.g., FRC vision pipelines).

---

## Features

### Core Features
- Define **field dimensions** (width & length in inches).
- Add or edit AprilTags with:
  - **ID**
  - **X, Y, Z position** (inches)
  - **Roll, Pitch, Yaw rotation** (degrees)
- Real-time visualization of AprilTag positions and orientations on a 2D field canvas.
- Simple, responsive UI with a dark theme.

### New Enhanced Features

#### 1. Constant AprilTags from JSON
- **Import JSON files** containing predefined AprilTag configurations
- **Select specific tags** from the imported JSON to set as constants on the field
- Constant tags are displayed in **green** and marked with **(C)** to distinguish them from draggable tags
- Constant tags are **fixed** and cannot be moved via drag-and-drop
- Perfect for setting up official field layouts that shouldn't be accidentally modified

#### 2. Drag-and-Drop Functionality
- **Drag and position** AprilTags dynamically on the field canvas
- **Real-time position updates** as you drag tags
- **Visual distinction**: 
  - Constant tags: Green (non-draggable)
  - Draggable tags: Blue (unselected) / Red (selected)
- Cursor changes to indicate draggable tags
- Works seamlessly across modern browsers

#### 3. Background Image Support
- **Upload custom background images** (e.g., field photos, CAD drawings)
- Images automatically scale to fit the canvas while maintaining aspect ratio
- Clear background option to return to default view
- Tags render on top of the background for easy visualization
- Supports common image formats (PNG, JPG, etc.)

### Usage Workflow

#### Setting Up Constant Tags
1. Click "Choose File" under **Import Constant Tags**
2. Select your JSON file with predefined AprilTag configurations
3. Check/uncheck tags you want to set as constants
4. Click **Apply Constant Tags**
5. Constant tags appear in green on the field and cannot be dragged

#### Adding Draggable Tags
1. Enter tag information in the **Add/Edit Draggable Tag** section
2. Click **Save Tag** to add it to the field
3. Draggable tags appear in blue on the canvas
4. **Drag any blue tag** to reposition it on the field

#### Adding a Background Image
1. Click "Choose File" under **Background Image**
2. Select an image file from your computer
3. The image displays on the canvas with tags rendered on top
4. Use **Clear Background** to remove the image

#### Import/Export
- **Import All Tags**: Load a complete field layout (replaces current tags)
- **Export JSON**: Save your current layout (includes both constant and draggable tags)
- Click on tags in the canvas to select and edit them in the form

---

## Technical Details

### JSON Format
```json
{
  "field": {
    "width": 16.4592,  // in meters
    "length": 8.2296   // in meters
  },
  "tags": [
    {
      "ID": 1,
      "pose": {
        "translation": {
          "x": 1.0,  // in meters
          "y": 1.0,
          "z": 0.5
        },
        "rotation": {
          "quaternion": {
            "X": 0,
            "Y": 0,
            "Z": 0,
            "W": 1
          }
        }
      }
    }
  ]
}
```

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with HTML5 Canvas support

---

## Use Cases

### For FRC Teams
- Visualize official field layouts with constant tags
- Add custom practice tags that can be repositioned
- Overlay field photos to match real-world setups
- Export configurations for robot vision systems

### For Robotics Development
- Quick prototyping of AprilTag layouts
- Testing different tag configurations
- Visual verification before physical deployment
- Documentation of field setups
