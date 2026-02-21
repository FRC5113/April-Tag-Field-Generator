// Global state
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight;

let tags = [];
let selectedTags = new Set();
let fieldWidth = 1,
  fieldLength = 1;
let frcTags = [];
let frcFieldWidth = 1,
  frcFieldLength = 1;

// Canvas click handler - select/deselect tags
canvas.addEventListener("click", function (e) {
  const scaleX = (canvas.width - 100) / fieldLength;
  const scaleY = (canvas.height - 100) / fieldWidth;
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  for (const tag of tags) {
    const x = tag.pose.translation.x * scaleX;
    const y = tag.pose.translation.y * scaleY;
    const dx = clickX - x;
    const dy = clickY - y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      if (selectedTags.has(tag.ID)) {
        selectedTags.delete(tag.ID);
      } else {
        selectedTags.add(tag.ID);
        populateFormFromTag(tag);
      }
      drawField();
      break;
    }
  }
});
