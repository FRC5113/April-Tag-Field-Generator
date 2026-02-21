function downloadJSON() {
  const data = {
    field: {
      width: fieldWidth,
      length: fieldLength,
    },
    tags,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${document.getElementById("fieldName").value || "field"}.json`;
  a.click();
}

function importJSON(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const json = JSON.parse(e.target.result);
    tags = json.tags || [];
    document.getElementById("fieldWidth").value = json.field.width * 39.3701;
    document.getElementById("fieldLength").value = json.field.length * 39.3701;
    updateTagList();
    drawField();
    if (frcTags.length > 0) updateReferenceTagDropdown();
    console.log(
      "✓ Imported CUSTOM layout - tags:",
      tags.map((t) => ({
        ID: t.ID,
        x: t.pose.translation.x.toFixed(2),
        y: t.pose.translation.y.toFixed(2),
      })),
    );
  };
  reader.readAsText(event.target.files[0]);
}

function importFRCLayout(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const json = JSON.parse(e.target.result);
    frcTags = json.tags || [];
    frcFieldWidth = json.field.width || 1;
    frcFieldLength = json.field.length || 1;

    // Populate reference tag dropdown with common tags
    updateReferenceTagDropdown();

    // Show alignment section
    document.getElementById("frcAlignmentSection").style.display = "block";

    // Display FRC tags info
    const frcInfo = document.getElementById("frcTagsInfo");
    frcInfo.innerHTML = `<strong>FRC Layout Loaded:</strong> ${frcTags.length} tags found`;

    drawField();
    console.log(
      "✓ Imported FRC layout - frcTags:",
      frcTags.map((t) => ({
        ID: t.ID,
        x: t.pose.translation.x.toFixed(2),
        y: t.pose.translation.y.toFixed(2),
      })),
    );
  };
  reader.readAsText(event.target.files[0]);
}
