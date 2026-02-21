function drawField() {
  fieldWidth =
    parseFloat(document.getElementById("fieldWidth").value) / 39.3701 || 1;
  fieldLength =
    parseFloat(document.getElementById("fieldLength").value) / 39.3701 || 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the field background
  const fieldToUse = frcTags.length > 0 ? frcFieldWidth : fieldWidth;
  const lengthToUse = frcTags.length > 0 ? frcFieldLength : fieldLength;

  ctx.fillStyle = "#333";
  ctx.fillRect(50, 50, canvas.width - 150, canvas.height - 150);

  // Draw field border
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 150, canvas.height - 150);

  const scaleX = (canvas.width - 150) / lengthToUse;
  const scaleY = (canvas.height - 150) / fieldToUse;

  // Draw FRC tags first (background)
  if (frcTags.length > 0) {
    for (const tag of frcTags) {
      const x = tag.pose.translation.x * scaleX + 50;
      const y = (fieldToUse - tag.pose.translation.y) * scaleY + 50;

      ctx.fillStyle = "#004466";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#00aacc";
      ctx.font = "10px sans-serif";
      ctx.fillText(`F${tag.ID}`, x + 8, y - 2);
    }
  }

  // Draw custom tags (foreground)
  for (const tag of tags) {
    const x = tag.pose.translation.x * scaleX + 50;
    const y = (fieldToUse - tag.pose.translation.y) * scaleY + 50;

    ctx.fillStyle = selectedTags.has(tag.ID) ? "#ff0000" : "#0077ff";
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.fill();

    // Draw rotation indicator (arrow pointing in direction of tag)
    const euler = quaternionToEuler(tag.pose.rotation.quaternion);
    const yaw = euler.yaw;
    const arrowLength = 15;
    const arrowEndX = x + Math.cos(yaw) * arrowLength;
    const arrowEndY = y + Math.sin(yaw) * arrowLength;

    ctx.strokeStyle = selectedTags.has(tag.ID) ? "#ff8888" : "#88ff88";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(arrowEndX, arrowEndY);
    ctx.stroke();

    // Draw arrowhead
    const headlen = 5;
    const angle1 = yaw + (Math.PI * 5) / 6;
    const angle2 = yaw - (Math.PI * 5) / 6;
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
      arrowEndX - headlen * Math.cos(angle1),
      arrowEndY - headlen * Math.sin(angle1),
    );
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
      arrowEndX - headlen * Math.cos(angle2),
      arrowEndY - headlen * Math.sin(angle2),
    );
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText(`ID: ${tag.ID}`, x + 8, y - 10);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(`Y: ${radiansToDegrees(yaw).toFixed(0)}°`, x + 8, y + 8);
  }
}
