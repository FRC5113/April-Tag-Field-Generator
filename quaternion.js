function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

function radiansToDegrees(rad) {
  return (rad * 180) / Math.PI;
}

function eulerToQuaternion(roll, pitch, yaw) {
  const cr = Math.cos(roll / 2);
  const sr = Math.sin(roll / 2);
  const cp = Math.cos(pitch / 2);
  const sp = Math.sin(pitch / 2);
  const cy = Math.cos(yaw / 2);
  const sy = Math.sin(yaw / 2);

  return {
    X: sr * cp * cy - cr * sp * sy,
    Y: cr * sp * cy + sr * cp * sy,
    Z: cr * cp * sy - sr * sp * cy,
    W: cr * cp * cy + sr * sp * sy,
  };
}

function quaternionToEuler(q) {
  const sinr_cosp = 2 * (q.W * q.X + q.Y * q.Z);
  const cosr_cosp = 1 - 2 * (q.X * q.X + q.Y * q.Y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  const sinp = 2 * (q.W * q.Y - q.Z * q.X);
  const pitch =
    Math.abs(sinp) >= 1 ? (Math.sign(sinp) * Math.PI) / 2 : Math.asin(sinp);

  const siny_cosp = 2 * (q.W * q.Z + q.X * q.Y);
  const cosy_cosp = 1 - 2 * (q.Y * q.Y + q.Z * q.Z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
}

function rotateVectorByQuaternion(vector, quat) {
  // Create quaternion from vector (0, x, y, z)
  const vecQuat = { X: vector.x, Y: vector.y, Z: vector.z, W: 0 };

  // Conjugate of quaternion
  const quatConj = { X: -quat.X, Y: -quat.Y, Z: -quat.Z, W: quat.W };

  // Rotate: q * v * q^-1
  const rotatedQuat1 = {
    X:
      quat.W * vecQuat.X +
      quat.X * vecQuat.W +
      quat.Y * vecQuat.Z -
      quat.Z * vecQuat.Y,
    Y:
      quat.W * vecQuat.Y -
      quat.X * vecQuat.Z +
      quat.Y * vecQuat.W +
      quat.Z * vecQuat.X,
    Z:
      quat.W * vecQuat.Z +
      quat.X * vecQuat.Y -
      quat.Y * vecQuat.X +
      quat.Z * vecQuat.W,
    W:
      quat.W * vecQuat.W -
      quat.X * vecQuat.X -
      quat.Y * vecQuat.Y -
      quat.Z * vecQuat.Z,
  };

  return {
    x:
      rotatedQuat1.W * quatConj.X +
      rotatedQuat1.X * quatConj.W +
      rotatedQuat1.Y * quatConj.Z -
      rotatedQuat1.Z * quatConj.Y,
    y:
      rotatedQuat1.W * quatConj.Y -
      rotatedQuat1.X * quatConj.Z +
      rotatedQuat1.Y * quatConj.W +
      rotatedQuat1.Z * quatConj.X,
    z:
      rotatedQuat1.W * quatConj.Z +
      rotatedQuat1.X * quatConj.Y -
      rotatedQuat1.Y * quatConj.X +
      rotatedQuat1.Z * quatConj.W,
  };
}
