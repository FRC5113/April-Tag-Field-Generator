function updateReferenceTagDropdown() {
  const select = document.getElementById("referenceTagId");
  select.innerHTML = '<option value="">Select a common tag...</option>';

  // Find tags that exist in both layouts
  const commonIds = tags
    .map((t) => t.ID)
    .filter((id) => frcTags.some((ft) => ft.ID === id));

  commonIds.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `Tag ${id}`;
    select.appendChild(option);
  });
}

function translateToFRCLayout() {
  const refId = parseInt(document.getElementById("referenceTagId").value);

  if (!refId && refId !== 0) {
    alert("Please select a reference tag");
    return;
  }

  const customRefTag = tags.find((t) => t.ID === refId);
  const frcRefTag = frcTags.find((t) => t.ID === refId);

  console.log(`\n=== ALIGNMENT DEBUG (Reference: Tag ${refId}) ===`);
  console.log(
    "Custom tags loaded:",
    tags.length,
    tags.map((t) => t.ID),
  );
  console.log(
    "FRC tags loaded:",
    frcTags.length,
    frcTags.map((t) => t.ID),
  );
  console.log(
    "Custom ref tag found:",
    customRefTag
      ? `ID ${customRefTag.ID} at (${customRefTag.pose.translation.x.toFixed(2)}, ${customRefTag.pose.translation.y.toFixed(2)})`
      : "NOT FOUND",
  );
  console.log(
    "FRC ref tag found:",
    frcRefTag
      ? `ID ${frcRefTag.ID} at (${frcRefTag.pose.translation.x.toFixed(2)}, ${frcRefTag.pose.translation.y.toFixed(2)})`
      : "NOT FOUND",
  );

  if (!customRefTag || !frcRefTag) {
    alert("Reference tag not found in one of the layouts");
    return;
  }

  // Get rotation offset from reference tag quaternions
  const customQuat = customRefTag.pose.rotation.quaternion;
  const frcQuat = frcRefTag.pose.rotation.quaternion;

  // Inverse of custom quaternion
  const customQuatInv = {
    X: -customQuat.X,
    Y: -customQuat.Y,
    Z: -customQuat.Z,
    W: customQuat.W,
  };

  // Rotation offset: inverse(custom) * frc
  const rotOffset = {
    X:
      customQuatInv.W * frcQuat.X +
      customQuatInv.X * frcQuat.W +
      customQuatInv.Y * frcQuat.Z -
      customQuatInv.Z * frcQuat.Y,
    Y:
      customQuatInv.W * frcQuat.Y -
      customQuatInv.X * frcQuat.Z +
      customQuatInv.Y * frcQuat.W +
      customQuatInv.Z * frcQuat.X,
    Z:
      customQuatInv.W * frcQuat.Z +
      customQuatInv.X * frcQuat.Y -
      customQuatInv.Y * frcQuat.X +
      customQuatInv.Z * frcQuat.W,
    W:
      customQuatInv.W * frcQuat.W -
      customQuatInv.X * frcQuat.X -
      customQuatInv.Y * frcQuat.Y -
      customQuatInv.Z * frcQuat.Z,
  };

  console.log("Rotation offset:", rotOffset);

  // IMPORTANT: Save original reference position before modifying anything
  const origRefX = customRefTag.pose.translation.x;
  const origRefY = customRefTag.pose.translation.y;
  const origRefZ = customRefTag.pose.translation.z;

  // IMPORTANT: Save original positions before modifying
  const originalPositions = tags.map((tag) => ({
    ID: tag.ID,
    x: tag.pose.translation.x,
    y: tag.pose.translation.y,
    z: tag.pose.translation.z,
  }));

  // Apply transformation to all tags
  tags.forEach((tag) => {
    // Get position relative to custom reference tag (use ORIGINAL positions)
    const origTag = originalPositions.find((t) => t.ID === tag.ID);
    let relX = origTag.x - origRefX;
    let relY = origTag.y - origRefY;
    let relZ = origTag.z - origRefZ;

    // Rotate position around reference point
    const rotatedPos = rotateVectorByQuaternion(
      { x: relX, y: relY, z: relZ },
      rotOffset,
    );

    // Set new position: rotated relative + FRC reference position
    const oldPos = { ...tag.pose.translation };
    tag.pose.translation.x = rotatedPos.x + frcRefTag.pose.translation.x;
    tag.pose.translation.y = rotatedPos.y + frcRefTag.pose.translation.y;
    tag.pose.translation.z = rotatedPos.z + frcRefTag.pose.translation.z;

    console.log(
      `Tag ${tag.ID}: custom_pos=(${oldPos.x.toFixed(2)}, ${oldPos.y.toFixed(2)}) rel=(${relX.toFixed(2)}, ${relY.toFixed(2)}) rotated=(${rotatedPos.x.toFixed(2)}, ${rotatedPos.y.toFixed(2)}) -> new=(${tag.pose.translation.x.toFixed(2)}, ${tag.pose.translation.y.toFixed(2)})`,
    );

    // Rotate tag orientation: rotOffset * tagOrientation
    const tagQuat = tag.pose.rotation.quaternion;
    tag.pose.rotation.quaternion = {
      X:
        rotOffset.W * tagQuat.X +
        rotOffset.X * tagQuat.W +
        rotOffset.Y * tagQuat.Z -
        rotOffset.Z * tagQuat.Y,
      Y:
        rotOffset.W * tagQuat.Y -
        rotOffset.X * tagQuat.Z +
        rotOffset.Y * tagQuat.W +
        rotOffset.Z * tagQuat.X,
      Z:
        rotOffset.W * tagQuat.Z +
        rotOffset.X * tagQuat.Y -
        rotOffset.Y * tagQuat.X +
        rotOffset.Z * tagQuat.W,
      W:
        rotOffset.W * tagQuat.W -
        rotOffset.X * tagQuat.X -
        rotOffset.Y * tagQuat.Y -
        rotOffset.Z * tagQuat.Z,
    };
  });

  // Update field dimensions to match FRC layout
  fieldWidth = frcFieldWidth;
  fieldLength = frcFieldLength;
  document.getElementById("fieldWidth").value = (fieldWidth * 39.3701).toFixed(
    2,
  );
  document.getElementById("fieldLength").value = (
    fieldLength * 39.3701
  ).toFixed(2);

  updateTagList();
  drawField();

  const info = document.getElementById("frcTagInfo");
  info.innerHTML = `<strong>Aligned!</strong> Tags rotated and positioned to match FRC field.`;
}
