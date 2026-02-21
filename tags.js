function updateTagList() {
  const tagList = document.getElementById("tagList");
  tagList.innerHTML = "";
  tags.forEach((tag, index) => {
    const euler = quaternionToEuler(tag.pose.rotation.quaternion);
    const div = document.createElement("div");
    div.className = "tag-item";
    div.innerHTML = `
      ID: <input type="number" value="${tag.ID}" onchange="editTag(${index}, 'ID', this.value)"><br>
      X: <input type="number" value="${(tag.pose.translation.x * 39.3701).toFixed(2)}" onchange="editTag(${index}, 'x', this.value)">
      Y: <input type="number" value="${(tag.pose.translation.y * 39.3701).toFixed(2)}" onchange="editTag(${index}, 'y', this.value)">
      Z: <input type="number" value="${(tag.pose.translation.z * 39.3701).toFixed(2)}" onchange="editTag(${index}, 'z', this.value)"><br>
      Roll: <input type="number" value="${radiansToDegrees(euler.roll).toFixed(2)}" onchange="editTag(${index}, 'roll', this.value)">
      Pitch: <input type="number" value="${radiansToDegrees(euler.pitch).toFixed(2)}" onchange="editTag(${index}, 'pitch', this.value)">
      Yaw: <input type="number" value="${radiansToDegrees(euler.yaw).toFixed(2)}" onchange="editTag(${index}, 'yaw', this.value)">
    `;
    tagList.appendChild(div);
  });
}

function editTag(index, field, value) {
  if (field === "ID") {
    tags[index].ID = parseInt(value);
  } else if (["roll", "pitch", "yaw"].includes(field)) {
    const euler = quaternionToEuler(tags[index].pose.rotation.quaternion);
    euler[field] = degreesToRadians(parseFloat(value));
    tags[index].pose.rotation.quaternion = eulerToQuaternion(
      euler.roll,
      euler.pitch,
      euler.yaw,
    );
  } else {
    tags[index].pose.translation[field] = parseFloat(value) / 39.3701;
  }
  drawField();
}

function populateFormFromTag(tag) {
  document.getElementById("tagId").value = tag.ID;
  document.getElementById("tagX").value = (
    tag.pose.translation.x * 39.3701
  ).toFixed(2);
  document.getElementById("tagY").value = (
    tag.pose.translation.y * 39.3701
  ).toFixed(2);
  document.getElementById("tagZ").value = (
    tag.pose.translation.z * 39.3701
  ).toFixed(2);

  const euler = quaternionToEuler(tag.pose.rotation.quaternion);
  document.getElementById("tagRoll").value = radiansToDegrees(
    euler.roll,
  ).toFixed(2);
  document.getElementById("tagPitch").value = radiansToDegrees(
    euler.pitch,
  ).toFixed(2);
  document.getElementById("tagYaw").value = radiansToDegrees(euler.yaw).toFixed(
    2,
  );
}

function addOrUpdateTag() {
  const id = parseInt(document.getElementById("tagId").value);

  let x = parseFloat(document.getElementById("tagX").value);
  let y = parseFloat(document.getElementById("tagY").value);

  const tagData = {
    ID: id,
    pose: {
      translation: {
        x: x / 39.3701,
        y: y / 39.3701,
        z: parseFloat(document.getElementById("tagZ").value) / 39.3701,
      },
      rotation: {
        quaternion: eulerToQuaternion(
          degreesToRadians(
            parseFloat(document.getElementById("tagRoll").value),
          ),
          degreesToRadians(
            parseFloat(document.getElementById("tagPitch").value),
          ),
          degreesToRadians(parseFloat(document.getElementById("tagYaw").value)),
        ),
      },
    },
  };

  const index = tags.findIndex((t) => t.ID === id);
  if (index !== -1) {
    tags[index] = tagData;
  } else {
    tags.push(tagData);
  }

  updateTagList();
  drawField();
}
